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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { createBook, updateBook, getBookById } from '../api/api';
import { COLORS, RADIUS, SHADOW, TYPOGRAPHY } from '../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Screen for manifesting new books or refining existing entries.
 * Includes strict validation for Title, Author, ISBN, and Year.
 */
export default function BookFormScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const bookId = route.params?.bookId;

  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,
      headerTintColor: COLORS.ethereal,
    });

    if (bookId) {
      loadBookData();
    }
  }, [bookId]);

  const loadBookData = async () => {
    try {
      const book = await getBookById(bookId);
      setTitle(book.title);
      setAuthor(book.author);
      setIsbn(book.isbn || '');
      setPublishedYear(book.publishedYear?.toString() || '');
      setAvailable(book.available);
    } catch (err) {
      Alert.alert('Error', 'Could not retrieve book details.');
    }
  };

  /**
   * Validates form inputs based on strict requirements:
   * Title: Alphanumeric, Author: Alpha, ISBN: Numeric, Year: 0-2026.
   */
  const validateForm = () => {
    const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;
    const alphaRegex = /^[a-zA-Z\sčćžšđČĆŽŠĐ]+$/;
    const numericRegex = /^\d+$/;
    const currentYear = 2026;

    if (!title.trim() || !alphanumericRegex.test(title)) {
      Alert.alert('Invalid Title', 'Title must contain only letters and numbers.');
      return false;
    }
    if (!author.trim() || !alphaRegex.test(author)) {
      Alert.alert('Invalid Author', 'Author name must contain only letters.');
      return false;
    }
    if (!isbn.trim() || !numericRegex.test(isbn)) {
      Alert.alert('Invalid ISBN', 'ISBN must contain only numbers.');
      return false;
    }
    const yearNum = parseInt(publishedYear);
    if (!publishedYear || isNaN(yearNum) || yearNum < 0 || yearNum > currentYear) {
      Alert.alert('Invalid Year', `Year must be between 0 and ${currentYear}.`);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const bookRequest = {
      title: title.trim(),
      author: author.trim(),
      available,
      isbn: isbn.trim(),
      publishedYear: parseInt(publishedYear),
    };

    try {
      if (bookId) {
        await updateBook(bookId, bookRequest);
      } else {
        await createBook(bookRequest);
      }
      
      // Trigger Haptics for physical feedback (mobile only)
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      Alert.alert(
        bookId ? 'Updated' : 'Manifested',
        `The book has been successfully ${bookId ? 'refined' : 'added'}.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      Alert.alert('System Error', err.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.flex}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 60 }]}
        >
          <StatusBar style="light" />
          <Text style={styles.headerText}>{bookId ? 'refining light' : 'new manifestation'}</Text>

          <Field label="Title" value={title} onChangeText={setTitle} placeholder="Letters and numbers..." />
          <Field label="Author" value={author} onChangeText={setAuthor} placeholder="Letters only..." />
          <Field label="ISBN" value={isbn} onChangeText={setIsbn} placeholder="Numbers only..." keyboardType="numeric" />
          <Field label="Year" value={publishedYear} onChangeText={setPublishedYear} placeholder="0 - 2026..." keyboardType="numeric" />

          <View style={styles.switchGroup}>
            <View>
              <Text style={styles.switchLabel}>Available in Archive</Text>
              <Text style={styles.switchSub}>{available ? 'Present' : 'Wandering'}</Text>
            </View>
            <Switch
              value={available}
              onValueChange={setAvailable}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: COLORS.ethereal }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.saveButton, SHADOW.softGlow]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>{bookId ? 'UPDATE ENTRY' : 'MANIFEST BOOK'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

/**
 * Reusable Input Field Component
 */
function Field({ label, ...props }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...props}
        style={styles.input}
        placeholderTextColor="rgba(113, 181, 209, 0.4)"
        selectionColor={COLORS.ethereal}
        keyboardAppearance="dark"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingBottom: 60 },
  headerText: {
    ...TYPOGRAPHY.header,
    fontSize: 38,
    color: COLORS.text,
    paddingHorizontal: 24,
    marginBottom: 30,
    fontWeight: '200',
  },
  inputGroup: { marginBottom: 20, paddingHorizontal: 24 },
  fieldLabel: { ...TYPOGRAPHY.ethereal, fontSize: 10, color: COLORS.ethereal, marginBottom: 8, textTransform: 'uppercase' },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: RADIUS.md,
    padding: 16,
    color: COLORS.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(113, 181, 209, 0.15)',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 20,
  },
  switchLabel: { ...TYPOGRAPHY.ethereal, color: COLORS.text, fontSize: 13 },
  switchSub: { ...TYPOGRAPHY.ethereal, color: COLORS.muted, fontSize: 10 },
  saveButton: {
    backgroundColor: COLORS.ethereal,
    marginHorizontal: 24,
    borderRadius: RADIUS.xl,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: { color: COLORS.bg, fontWeight: '700', fontSize: 14, letterSpacing: 1.5 },
});