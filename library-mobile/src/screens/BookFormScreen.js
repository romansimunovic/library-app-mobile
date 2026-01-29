import React, { useState, useEffect } from 'react';
import { 
  View, TextInput, Switch, Alert, Text, ScrollView, StyleSheet, 
  TouchableOpacity, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import { createBook, updateBook, getBookById, deleteBook } from '../api/api';
import { COLORS, RADIUS, SPACING, SHADOW } from '../theme/theme';

/**
 * BookFormScreen
 * 
 * Screen for creating a new book or editing an existing one.
 * If `bookId` is provided in route params, the screen fetches the book data for editing.
 * Handles validation, dirty-checking, saving, and deleting.
 */
export default function BookFormScreen({ route, navigation }) {
  const bookId = route.params?.bookId;

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [available, setAvailable] = useState(true);

  // Original data for dirty checking
  const [originalData, setOriginalData] = useState({ title:'', author:'', isbn:'', publishedYear:'', available:true });

  // Error flags for validation
  const [errors, setErrors] = useState({ title: false, author: false, isbn: false, publishedYear: false });

  // ISBN regex: matches 10 or 13 digits, optional dashes or spaces
  const isbnRegex = /^(?:\d[\- ]?){9,12}[\dX]$/i;

  /**
   * Fetch book data if editing
   */
  useEffect(() => {
    if (bookId) {
      getBookById(bookId)
        .then(book => {
          setTitle(book.title);
          setAuthor(book.author);
          setIsbn(book.isbn || '');
          setPublishedYear(book.publishedYear?.toString() || '');
          setAvailable(book.available);
          setOriginalData({
            title: book.title,
            author: book.author,
            isbn: book.isbn || '',
            publishedYear: book.publishedYear?.toString() || '',
            available: book.available
          });
        })
        .catch(err => Alert.alert('Error', err.message));
    }
  }, [bookId]);

  /**
   * Validate form fields
   * - Title and Author are required
   * - ISBN must be 10 or 13 characters if provided
   * - Published year must be 4 digits and <= current year
   */
  const validate = () => {
    let valid = true;
    const newErrors = { title:false, author:false, isbn:false, publishedYear:false };
    const currentYear = new Date().getFullYear();

    if (!title.trim()) { newErrors.title = true; valid = false; }
    if (!author.trim()) { newErrors.author = true; valid = false; }
    if (isbn.trim() && !isbnRegex.test(isbn.trim())) { newErrors.isbn = true; valid = false; }
    if (publishedYear.trim() && (!/^\d{4}$/.test(publishedYear.trim()) || parseInt(publishedYear) <=0 || parseInt(publishedYear) > currentYear)) { 
      newErrors.publishedYear = true; valid = false; 
    }

    setErrors(newErrors);

    if (!valid) {
      Alert.alert('Validation Error', 'Please check your input fields. ISBN must be 10 or 13 characters. Year must be a 4-digit number.');
    }

    return valid;
  };

  // Check if any field has been modified
  const dirty = title !== originalData.title || author !== originalData.author || isbn !== originalData.isbn || publishedYear !== originalData.publishedYear || available !== originalData.available;

  /**
   * Save handler
   * - Creates a new book if no bookId
   * - Updates existing book if bookId exists
   */
  const handleSave = async () => {
    Keyboard.dismiss();
    if (!validate()) return;

    const bookRequest = { title:title.trim(), author:author.trim(), available };
    if (isbn.trim()) bookRequest.isbn = isbn.trim();
    if (publishedYear.trim()) bookRequest.publishedYear = parseInt(publishedYear);

    try {
      if (bookId) {
        await updateBook(bookId, bookRequest);
        Alert.alert('Success', `Book "${title}" updated successfully!`);
      } else {
        await createBook(bookRequest);
        Alert.alert('Success', `Book "${title}" added successfully!`);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  /**
   * Delete handler
   */
  const handleDelete = () => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete the book "${title}"?`,
      [
        { text:'Cancel', style:'cancel' },
        { text:'Delete', style:'destructive', onPress: async () => {
          try {
            await deleteBook(bookId);
            Alert.alert('Success', `Book "${title}" deleted successfully!`);
            navigation.goBack();
          } catch(error) {
            Alert.alert('Error', error.message);
          }
        }}
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow:1, paddingBottom:40 }}>
        <Text style={styles.header}>{bookId ? 'Edit Book' : 'Add New Book'}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Enter book title"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Author</Text>
          <TextInput
            value={author}
            onChangeText={setAuthor}
            style={[styles.input, errors.author && styles.inputError]}
            placeholder="Enter author's name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>ISBN</Text>
          <TextInput
            value={isbn}
            onChangeText={setIsbn}
            style={[styles.input, errors.isbn && styles.inputError]}
            placeholder="e.g. 978-3-16-148410-0"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Year</Text>
          <TextInput
            value={publishedYear}
            onChangeText={setPublishedYear}
            keyboardType="numeric"
            style={[styles.input, errors.publishedYear && styles.inputError]}
            placeholder="e.g. 2023"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.switchGroup}>
          <Text style={styles.switchLabel}>Available</Text>
          <Switch
            value={available}
            onValueChange={setAvailable}
            trackColor={{true:'#0a6734', false:'#721c24'}}
            thumbColor="#fff"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, !dirty && {opacity:0.6}]}
          onPress={handleSave}
          disabled={!dirty}
        >
          <Text style={styles.saveButtonText}>{bookId ? 'Update Book' : 'Create Book'}</Text>
        </TouchableOpacity>

        {bookId && (
          <TouchableOpacity style={[styles.deleteButton, {marginTop:8}]} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Book</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: COLORS.bg,
},
  header:{ fontSize:28, fontWeight:'800', color:'#fff', textAlign:'center', marginVertical:32 },
  inputGroup:{ marginBottom:24, paddingHorizontal:24 },
  label:{ fontSize:16, fontWeight:'600', color:'#a0a0cc', marginBottom:8 },
input: {
  backgroundColor: COLORS.surface,
  borderRadius: RADIUS.xl,
  paddingVertical: 16,
  paddingHorizontal: 20,

  color: COLORS.text,
  fontSize: 16,
  fontWeight: '700',

  borderWidth: 3,
  borderColor: COLORS.border,
},
  inputError:{ borderColor:'#c00' },
  switchGroup:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:24, marginBottom:40 },
  switchLabel:{ fontSize:16, fontWeight:'600', color:'#a0a0cc' },
saveButton: {
  backgroundColor: COLORS.brat,
  marginHorizontal: SPACING.lg,
  borderRadius: RADIUS.xl,
  paddingVertical: 18,
  alignItems: 'center',

  borderWidth: 3,
  borderColor: COLORS.border,

  ...SHADOW.brat,
},

saveButtonText: {
  color: '#000',
  fontSize: 18,
  fontWeight: '900',
  letterSpacing: -0.5,
},
  saveButtonText:{ color:'#fff', fontSize:18, fontWeight:'700' },
  deleteButton:{ backgroundColor:'#721c24', marginHorizontal:24, borderRadius:16, paddingVertical:18, alignItems:'center' },
  deleteButtonText:{ color:'#fff', fontSize:18, fontWeight:'700' },
});
