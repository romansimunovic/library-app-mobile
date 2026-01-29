import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  StyleSheet,
} from 'react-native';
import { createBook, updateBook, getBookById, deleteBook } from '../api/api';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme/theme';

export default function BookFormScreen({ route, navigation }) {
  const bookId = route.params?.bookId;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [available, setAvailable] = useState(true);

  const [originalData, setOriginalData] = useState({
    title: '', author: '', isbn: '', publishedYear: '', available: true
  });

  const [errors, setErrors] = useState({
    title: '', author: '', isbn: '', publishedYear: ''
  });

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
        .catch(err => Alert.alert('Oops!', err.message));
    }
  }, [bookId]);

  // --- HANDLER ZA GODINU ---
  const handleYearChange = (text) => {
  // dozvoli samo brojeve, bez minus
  const filtered = text.replace(/[^0-9]/g, '');
  setPublishedYear(filtered);
};

const validate = () => {
  let newErrors = { title:'', author:'', isbn:'', publishedYear:'' };
  let valid = true;
  const currentYear = new Date().getFullYear();

  if (!title.trim()) {
    newErrors.title = "Oops! Books need a title.";
    valid = false;
  }

  if (!author.trim()) {
    newErrors.author = "Who wrote this? Fill in the author.";
    valid = false;
  }

  if (isbn.trim() && !/^\d+$/.test(isbn.trim())) {
    newErrors.isbn = "ISBN is numbers-only, buddy.";
    valid = false;
  }

  if (publishedYear.trim()) {
    const num = parseInt(publishedYear.trim());
    if (isNaN(num) || num < 0 || num > currentYear) {
      newErrors.publishedYear = `Year must be between 0 and ${currentYear}.`;
      valid = false;
    }
  }

  setErrors(newErrors);
  if (!valid) Alert.alert('Validation Error', 'Some fields need attention.');
  return valid;
};

  const dirty =
    title !== originalData.title ||
    author !== originalData.author ||
    isbn !== originalData.isbn ||
    publishedYear !== originalData.publishedYear ||
    available !== originalData.available;

  const handleSave = async () => {
    Keyboard.dismiss();
    if (!validate()) return;

    const bookRequest = { title: title.trim(), author: author.trim(), available };
    if (isbn.trim()) bookRequest.isbn = isbn.trim();
    if (publishedYear.trim()) bookRequest.publishedYear = parseInt(publishedYear);

    try {
      if (bookId) {
        await updateBook(bookId, bookRequest);
        Alert.alert('Success!', `Book "${title}" updated.`);
      } else {
        await createBook(bookRequest);
        Alert.alert('Success!', `Book "${title}" added.`);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Deletion',
      `Delete "${title}" forever?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteBook(bookId);
            Alert.alert('Deleted!', `"${title}" removed.`);
            navigation.goBack();
          } catch(err) {
            Alert.alert('Error', err.message);
          }
        }}
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>{bookId ? 'Edit Book' : 'Add New Book'}</Text>

        <Field
          label="Title"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
          placeholder="1984, Dune, React for Humans"
        />

        <Field
          label="Author"
          value={author}
          onChangeText={setAuthor}
          error={errors.author}
          placeholder="George Orwell"
        />

        <Field
          label="ISBN"
          value={isbn}
          onChangeText={setIsbn}
          error={errors.isbn}
          placeholder="Numbers only, no drama"
          keyboardType="numeric"
        />

        <Field
          label="Year"
          value={publishedYear}
          onChangeText={handleYearChange} // kontrolirani handler
          error={errors.publishedYear}
          placeholder="-400 or 2023"
          keyboardType="default"
        />

        <View style={styles.switchGroup}>
          <Text style={styles.switchLabel}>Available</Text>
          <Switch value={available} onValueChange={setAvailable} />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, !dirty && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={!dirty}
        >
          <Text style={styles.saveButtonText}>{bookId ? 'Update Book' : 'Create Book'}</Text>
        </TouchableOpacity>

        {bookId && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Book</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

/* -------------------------
   REUSABLE FIELD
   ------------------------- */
function Field({ label, error, onChangeText, ...props }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        {...props}
        onChangeText={onChangeText}
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#999"
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:COLORS.bg },
  header: { fontSize:28, fontWeight:'800', color:'#fff', textAlign:'center', marginVertical:32 },
  inputGroup: { marginBottom:24, paddingHorizontal:24 },
  label: { fontSize:16, fontWeight:'600', color:'#a0a0cc', marginBottom:8 },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    paddingVertical:16,
    paddingHorizontal:20,
    color: COLORS.text,
    fontSize:16,
    fontWeight:'700',
    borderWidth:3,
    borderColor: COLORS.border,
  },
  inputError: { borderColor:'#c00' },
  errorText: { color:'#c00', marginTop:4 },
  switchGroup:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:24, marginBottom:40 },
  switchLabel:{ fontSize:16, fontWeight:'600', color:'#a0a0cc' },
  saveButton: {
    backgroundColor: COLORS.brat,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    paddingVertical:18,
    alignItems:'center',
    borderWidth:3,
    borderColor: COLORS.border,
    ...SHADOW.brat,
  },
  saveButtonText: { color:'#fff', fontSize:18, fontWeight:'700' },
  deleteButton:{ backgroundColor:'#721c24', marginHorizontal:24, borderRadius:16, paddingVertical:18, alignItems:'center', marginTop:8 },
  deleteButtonText:{ color:'#fff', fontSize:18, fontWeight:'700' },
});
