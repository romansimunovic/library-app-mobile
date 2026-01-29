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
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import { createBook, updateBook, getBookById } from '../api/api';
import { COLORS, SPACING, SHADOW } from '../theme/theme';

export default function BookFormScreen({ route, navigation }) {
  const bookId = route.params?.bookId;
  const [activeField, setActiveField] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publishedYear: '',
    available: true,
  });

  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!bookId) return;
    getBookById(bookId)
      .then(book => {
        const data = {
          title: book.title,
          author: book.author,
          isbn: book.isbn || '',
          publishedYear: book.publishedYear?.toString() || '',
          available: book.available,
        };
        setFormData(data);
        setOriginalData(data);
      })
      .catch(err => Alert.alert('SYSTEM ERROR.', err.message));
  }, [bookId]);

  const validate = () => {
    const nextErrors = {};
    
    // Regex for letters and spaces only
    const alphaRegex = /^[a-zA-Z\s]*$/;
    
    if (!formData.title.trim()) nextErrors.title = "TITLE. IS. REQUIRED.";
    else if (!alphaRegex.test(formData.title)) nextErrors.title = "LETTERS. ONLY. PLEASE.";

    if (!formData.author.trim()) nextErrors.author = "WHO. WROTE. THIS?";
    else if (!alphaRegex.test(formData.author)) nextErrors.author = "REAL. NAMES. ONLY.";

    if (formData.publishedYear && !/^\d{4}$/.test(formData.publishedYear)) {
      nextErrors.publishedYear = "YEAR. MUST. BE. 4. DIGITS.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isDirty = JSON.stringify(formData) !== JSON.stringify(originalData);

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const payload = { 
        ...formData, 
        publishedYear: formData.publishedYear ? Number(formData.publishedYear) : null 
      };
      bookId ? await updateBook(bookId, payload) : await createBook(payload);
      navigation.goBack();
    } catch (err) {
      Alert.alert('FAILED.', err.message);
    }
  };

  const renderInput = (label, key, placeholder, keyboardType = 'default') => (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label.toUpperCase()}.</Text>
        {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
      </View>
      <TextInput
        value={formData[key]}
        onChangeText={(txt) => {
          setFormData({ ...formData, [key]: txt });
          if (errors[key]) setErrors({ ...errors, [key]: null });
        }}
        onFocus={() => setActiveField(key)}
        onBlur={() => setActiveField(null)}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor="#444"
        style={[
          styles.input,
          errors[key] && styles.inputError,
          activeField === key && styles.inputActive
        ]}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.header}>
            {bookId ? 'UPDATE. THE.\nARCHIVE.' : 'NEW. ENTRY.\nREQUIRED.'}
          </Text>

          {renderInput('Title', 'title', 'SOMETHING. ICONIC.')}
          {renderInput('Author', 'author', 'A. REAL. GENIUS.')}
          {renderInput('Isbn No.', 'isbn', '13. DIGITS. OF. NUMBERS.')}
          {renderInput('Year', 'publishedYear', 'YYYY.', 'numeric')}

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.label}>AVAILABILITY.</Text>
              <Text style={[styles.statusIndicator, { color: formData.available ? COLORS.brat : '#ff4444' }]}>
                {formData.available ? 'AVAILABLE. PERIOD.' : 'GONE. AT. THE. MOMENT.'}
              </Text>
            </View>
            <Switch
              value={formData.available}
              onValueChange={(val) => setFormData({ ...formData, available: val })}
              trackColor={{ true: COLORS.brat, false: '#222' }}
              thumbColor={formData.available ? '#fff' : '#666'}
            />
          </View>

          <TouchableOpacity
            disabled={!isDirty}
            onPress={handleSave}
            style={[styles.primaryButton, !isDirty && styles.disabledButton]}
          >
            <Text style={styles.primaryText}>
              {bookId ? 'SAVE. CHANGES.' : 'CONFIRM. ADDITION.'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
            <Text style={styles.cancelText}>[ ABORT. ]</Text>
          </TouchableOpacity>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: SPACING.lg, paddingBottom: 100 },
  
  header: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -3,
    marginBottom: 40,
    lineHeight: 44,
    marginTop: 20,
  },

  inputGroup: { marginBottom: 25 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 },
  label: {
    color: COLORS.brat,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 2,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 10,
    fontWeight: '900',
  },

  input: {
    backgroundColor: '#0a0a0a',
    padding: 18,
    borderWidth: 2,
    borderColor: '#222',
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    borderRadius: 0, // Perfectly sharp corners
  },

  inputActive: {
    borderColor: COLORS.brat,
    backgroundColor: '#111',
  },

  inputError: {
    borderColor: '#ff4444',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 25,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#111',
    marginBottom: 40,
  },

  statusIndicator: { fontSize: 12, fontWeight: '900', marginTop: 4 },

  primaryButton: {
    backgroundColor: COLORS.brat,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
    ...SHADOW.brat,
  },

  disabledButton: { opacity: 0.2 },
  primaryText: { color: '#000', fontWeight: '900', fontSize: 20, letterSpacing: -1 },

  cancelButton: { marginTop: 20, alignItems: 'center' },
  cancelText: { color: COLORS.muted, fontWeight: '800', fontSize: 12, letterSpacing: 2 },
});