import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Switch,
  Alert,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { createBook, updateBook, getBookById, deleteBook } from '../api/api';
import { COLORS, RADIUS, SPACING, SHADOW } from '../theme/theme';

const CURRENT_YEAR = new Date().getFullYear();

export default function BookFormScreen({ route, navigation }) {
  const bookId = route.params?.bookId;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [available, setAvailable] = useState(true);

  const [errors, setErrors] = useState({});

  const [originalData, setOriginalData] = useState({
    title: '',
    author: '',
    isbn: '',
    publishedYear: '',
    available: true,
  });

  useEffect(() => {
    if (!bookId) return;

    getBookById(bookId)
      .then(book => {
        setTitle(book.title);
        setAuthor(book.author);
        setIsbn(book.isbn?.toString() || '');
        setPublishedYear(book.publishedYear?.toString() || '');
        setAvailable(book.available);

        setOriginalData({
          title: book.title,
          author: book.author,
          isbn: book.isbn?.toString() || '',
          publishedYear: book.publishedYear?.toString() || '',
          available: book.available,
        });
      })
      .catch(err => Alert.alert('Oops', err.message));
  }, [bookId]);

  /* -------------------------
     INPUT FILTERING (NO REGEX)
     ------------------------- */

  const handleTitleChange = (text = '') => {
  const cleaned = text
    .split('')
    .filter(char =>
      char.match(/\p{L}|\p{N}|\s/u)
    )
    .join('');

  setTitle(cleaned);
};


 const handleAuthorChange = (text = '') => {
  const cleaned = text
    .split('')
    .filter(char =>
      char.match(/\p{L}|\s/u)
    )
    .join('');

  setAuthor(cleaned);
};


  const handleIsbnChange = (text = '') => {
  const cleaned = text
    .split('')
    .filter(char => char >= '0' && char <= '9')
    .join('');

  setIsbn(cleaned);
};


  const handleYearChange = (text = '') => {
  let cleaned = text
    .split('')
    .filter(char =>
      (char >= '0' && char <= '9') || char === '-'
    )
    .join('');

  // Only allow ONE leading minus
  if (cleaned.includes('-')) {
    cleaned =
      (cleaned.startsWith('-') ? '-' : '') +
      cleaned.replace(/-/g, '');
  }

  setPublishedYear(cleaned);
};


  /* -------------------------
     VALIDATION
     ------------------------- */

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title can’t be empty. Even ancient scrolls had names.';
    }

    if (!author.trim()) {
      newErrors.author = 'Author missing. Books don’t write themselves (yet).';
    }

    if (isbn) {
      if (!(isbn.length === 10 || isbn.length === 13)) {
        newErrors.isbn = 'ISBN must be 10 or 13 digits. Not 11. Not vibes.';
      }
    }

    if (publishedYear) {
      const year = Number(publishedYear);

      if (Number.isNaN(year)) {
        newErrors.publishedYear = 'That doesn’t look like a year from this universe.';
      } else if (year === 0) {
        newErrors.publishedYear = 'There is no year 0. History skipped it.';
      } else if (year > CURRENT_YEAR) {
        newErrors.publishedYear = `Nice try, time traveler. Max year is ${CURRENT_YEAR}.`;
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Alert.alert(
        'Hold up ✋',
        'Some fields are acting suspicious. Fix them and we’re good.'
      );
      return false;
    }

    return true;
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

    const payload = {
      title: title.trim(),
      author: author.trim(),
      available,
    };

    if (isbn) payload.isbn = isbn;
    if (publishedYear) payload.publishedYear = Number(publishedYear);

    try {
      if (bookId) {
        await updateBook(bookId, payload);
        Alert.alert('Saved ', 'Book updated. Librarians everywhere approve.');
      } else {
        await createBook(payload);
        Alert.alert('Added ', 'New book added to the universe.');
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete book?',
      'This action is forever. Like deleting history.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteBook(bookId);
            navigation.goBack();
          },
        },
      ]
    );
  };
return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.header}>
        {bookId ? 'Edit Book' : 'Add New Book'}
      </Text>

      <Field
        label="Title"
        value={title}
        onChangeText={handleTitleChange}
        error={errors.title}
        placeholder="1984, Dune, React for Humans"
      />

      <Field
        label="Author"
        value={author}
        onChangeText={handleAuthorChange}
        error={errors.author}
        placeholder="George Orwell"
      />

      <Field
        label="ISBN"
        value={isbn}
        onChangeText={handleIsbnChange}
        error={errors.isbn}
        placeholder="Numbers only, no drama"
        keyboardType="numeric"
      />

      <Field
        label="Year"
        value={publishedYear}
        onChangeText={handleYearChange}
        error={errors.publishedYear}
        placeholder="–400 or 2023"
        keyboardType="numeric"
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
        <Text style={styles.saveButtonText}>
          {bookId ? 'Update Book' : 'Create Book'}
        </Text>
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


/* -------------------------
   STYLES
   ------------------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 32,
  },
  inputGroup: { marginBottom: 20, paddingHorizontal: 24 },
  label: { color: '#a0a0cc', marginBottom: 6, fontWeight: '600' },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    color: COLORS.text,
    fontSize: 16,
  },
  inputError: { borderColor: '#c0392b' },
  errorText: {
    marginTop: 6,
    color: '#c0392b',
    fontSize: 13,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  switchLabel: { color: '#a0a0cc', fontWeight: '600' },
  saveButton: {
    backgroundColor: COLORS.brat,
    marginHorizontal: SPACING.lg,
    paddingVertical: 18,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    ...SHADOW.brat,
  },
  saveButtonText: { color: '#000', fontWeight: '900', fontSize: 18 },
  deleteButton: {
    backgroundColor: '#721c24',
    marginHorizontal: 24,
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  deleteButtonText: { color: '#fff', fontWeight: '700' },
});
