import React, { useState, useEffect } from 'react';
import { 
  View, TextInput, Switch, Alert, Text, ScrollView, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import { createBook, updateBook, getBookById, deleteBook } from '../api/api';

/**
 * Screen for creating or editing a book.
 * Validations: required fields and basic ISBN check.
 * Highlights invalid inputs visually.
 */
export default function BookFormScreen({ route, navigation }) {
  const bookId = route.params?.bookId;

  // Form fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [available, setAvailable] = useState(true);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Fetch book if editing
  useEffect(() => {
    if (bookId) {
      getBookById(bookId)
        .then(book => {
          setTitle(book.title);
          setAuthor(book.author);
          setIsbn(book.isbn || '');
          setPublishedYear(book.publishedYear?.toString() || '');
          setAvailable(book.available);
        })
        .catch(err => Alert.alert('Error', err.message));
    }
  }, [bookId]);

  /** 
   * Validate inputs.
   * @returns {boolean} true if all fields are valid
   */
  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!author.trim()) newErrors.author = 'Author is required';

    // basic ISBN format check: e.g., 978-3-16-148410-0
    if (isbn.trim() && !/^\d{3}-\d-\d{2}-\d{6}-\d$/.test(isbn.trim())) {
      newErrors.isbn = 'ISBN format is invalid';
    }

    // optional year check
    if (publishedYear.trim() && (isNaN(publishedYear) || parseInt(publishedYear) <= 0)) {
      newErrors.publishedYear = 'Enter a valid year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Save book (create or update)
   */
  const handleSave = async () => {
    if (!validate()) return; // stop if validation fails

    const bookRequest = {
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim() || null,
      publishedYear: publishedYear.trim() ? parseInt(publishedYear) : null,
      available,
    };

    try {
      if (bookId) {
        await updateBook(bookId, bookRequest);
        Alert.alert('Success', `Book "${title}" has been updated`);
      } else {
        await createBook(bookRequest);
        Alert.alert('Success', `Book "${title}" has been added`);
      }
      navigation.navigate('BookList', { refresh: true });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView 
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      >
        <Text style={styles.header}>{bookId ? 'Edit Book' : 'Add Book'}</Text>

        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput 
            value={title} 
            onChangeText={setTitle} 
            style={[styles.input, errors.title && styles.inputError]} 
            placeholder="Enter title"
            placeholderTextColor="#999"
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Author */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Author</Text>
          <TextInput 
            value={author} 
            onChangeText={setAuthor} 
            style={[styles.input, errors.author && styles.inputError]} 
            placeholder="Enter author"
            placeholderTextColor="#999"
          />
          {errors.author && <Text style={styles.errorText}>{errors.author}</Text>}
        </View>

        {/* ISBN */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>ISBN</Text>
          <TextInput 
            value={isbn} 
            onChangeText={setIsbn} 
            style={[styles.input, errors.isbn && styles.inputError]} 
            placeholder="e.g., 978-3-16-148410-0"
            placeholderTextColor="#999"
          />
          {errors.isbn && <Text style={styles.errorText}>{errors.isbn}</Text>}
        </View>

        {/* Year */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Year</Text>
          <TextInput
            value={publishedYear}
            onChangeText={setPublishedYear}
            keyboardType="numeric"
            style={[styles.input, errors.publishedYear && styles.inputError]} 
            placeholder="e.g., 2023"
            placeholderTextColor="#999"
          />
          {errors.publishedYear && <Text style={styles.errorText}>{errors.publishedYear}</Text>}
        </View>

        {/* Availability */}
        <View style={styles.switchGroup}>
          <Text style={styles.switchLabel}>Available</Text>
          <Switch 
            value={available} 
            onValueChange={setAvailable} 
            trackColor={{ true: '#0a6734', false: '#721c24' }}
            thumbColor="#ffffff"
          />
        </View>

        {/* Save */}
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={() => {
            Keyboard.dismiss();
            handleSave();
          }}
        >
          <Text style={styles.saveButtonText}>{bookId ? 'Update' : 'Create'}</Text>
        </TouchableOpacity>

        {/* Delete if editing */}
        {bookId && (
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => Alert.alert(
              'Confirmation', 
              'Are you sure you want to delete this book?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: async () => {
                  try {
                    await deleteBook(bookId);
                    Alert.alert('Success', `Book "${title}" has been deleted`);
                    navigation.navigate('BookList', { refresh: true });
                  } catch (error) {
                    Alert.alert('Error', error.message);
                  }
                } }
              ]
            )}
          >
            <Text style={styles.deleteButtonText}>Delete Book</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  header: { fontSize: 28, fontWeight: '800', color: '#ffffff', textAlign: 'center', marginVertical: 32 },
  inputGroup: { marginBottom: 24, paddingHorizontal: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#a0a0cc', marginBottom: 8 },
  input: { backgroundColor: '#1a1a2e', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, fontSize: 16, color: '#ffffff', borderWidth: 1, borderColor: '#2a2a3e' },
  inputError: { borderColor: '#c00' },
  errorText: { color: '#c00', marginTop: 4, fontSize: 12 },
  switchGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 40 },
  switchLabel: { fontSize: 16, fontWeight: '600', color: '#a0a0cc' },
  saveButton: { backgroundColor: '#0a6734', marginHorizontal: 24, borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 16 },
  saveButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
  deleteButton: { backgroundColor: '#721c24', marginHorizontal: 24, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  deleteButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
});
