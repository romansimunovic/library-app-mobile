// src/screens/BookFormScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, TextInput, Switch, Alert, Text, ScrollView, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import { createBook, updateBook, getBookById } from '../api/api';

/**
 * Ekran za dodavanje i uređivanje knjiga
 * Validacija: obavezna polja i osnovna provjera ISBN-a
 * Vizualno isticanje pogrešnih unosa
 */
export default function BookFormScreen({ route, navigation }) {
  const bookId = route.params?.bookId;

  // Polja forme
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [available, setAvailable] = useState(true);

  // Polja za validaciju
  const [errors, setErrors] = useState({});

  // Dohvat podataka ako je edit
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
        .catch(err => Alert.alert('Greška', err.message));
    }
  }, [bookId]);

  /** 
   * Provjera valjanosti unosa
   * @returns boolean - true ako su svi unosi ispravni
   */
  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Naslov je obavezan';
    if (!author.trim()) newErrors.author = 'Autor je obavezan';

    // osnovna provjera ISBN formata: npr. 978-3-16-148410-0
    if (isbn.trim() && !/^\d{3}-\d-\d{2}-\d{6}-\d$/.test(isbn.trim())) {
      newErrors.isbn = 'ISBN nije u ispravnom formatu';
    }

    // opcionalna provjera godine
    if (publishedYear.trim() && (isNaN(publishedYear) || parseInt(publishedYear) <= 0)) {
      newErrors.publishedYear = 'Unesite valjanu godinu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Spremanje knjige (dodavanje ili update)
   */
  const handleSave = async () => {
    if (!validate()) return; // ako nisu validni podaci, ne ide dalje

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
        Alert.alert('Uspjeh', `Knjiga "${title}" je ažurirana`);
      } else {
        await createBook(bookRequest);
        Alert.alert('Uspjeh', `Knjiga "${title}" je dodana`);
      }
      navigation.navigate('BookList', { refresh: true });
    } catch (error) {
      Alert.alert('Greška', error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView 
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      >
        <Text style={styles.header}>{bookId ? 'Uredi knjigu' : 'Dodaj knjigu'}</Text>

        {/* Naslov */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Naslov</Text>
          <TextInput 
            value={title} 
            onChangeText={setTitle} 
            style={[styles.input, errors.title && styles.inputError]} 
            placeholder="Unesite naslov"
            placeholderTextColor="#999"
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Autor */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Autor</Text>
          <TextInput 
            value={author} 
            onChangeText={setAuthor} 
            style={[styles.input, errors.author && styles.inputError]} 
            placeholder="Unesite autora"
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
            placeholder="npr. 978-3-16-148410-0"
            placeholderTextColor="#999"
          />
          {errors.isbn && <Text style={styles.errorText}>{errors.isbn}</Text>}
        </View>

        {/* Godina */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Godina</Text>
          <TextInput
            value={publishedYear}
            onChangeText={setPublishedYear}
            keyboardType="numeric"
            style={[styles.input, errors.publishedYear && styles.inputError]} 
            placeholder="npr. 2023"
            placeholderTextColor="#999"
          />
          {errors.publishedYear && <Text style={styles.errorText}>{errors.publishedYear}</Text>}
        </View>

        {/* Dostupnost */}
        <View style={styles.switchGroup}>
          <Text style={styles.switchLabel}>Dostupna</Text>
          <Switch 
            value={available} 
            onValueChange={setAvailable} 
            trackColor={{ true: '#0a6734', false: '#721c24' }}
            thumbColor="#ffffff"
          />
        </View>

        {/* Spremi */}
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={() => {
            Keyboard.dismiss();
            handleSave();
          }}
        >
          <Text style={styles.saveButtonText}>{bookId ? 'Ažuriraj' : 'Kreiraj'}</Text>
        </TouchableOpacity>

        {/* Obriši ako edit */}
        {bookId && (
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => Alert.alert(
              'Potvrda', 
              'Jeste li sigurni da želite obrisati ovu knjigu?',
              [
                { text: 'Odustani', style: 'cancel' },
                { text: 'Obriši', style: 'destructive', onPress: async () => {
                  try {
                    await deleteBook(bookId);
                    Alert.alert('Uspjeh', `Knjiga "${title}" je obrisana`);
                    navigation.navigate('BookList', { refresh: true });
                  } catch (error) {
                    Alert.alert('Greška', error.message);
                  }
                } }
              ]
            )}
          >
            <Text style={styles.deleteButtonText}>Obriši knjigu</Text>
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
  inputError: { borderColor: '#c00' }, // crveni border za pogrešan unos
  errorText: { color: '#c00', marginTop: 4, fontSize: 12 },
  switchGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 40 },
  switchLabel: { fontSize: 16, fontWeight: '600', color: '#a0a0cc' },
  saveButton: { backgroundColor: '#0a6734', marginHorizontal: 24, borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 16 },
  saveButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
  deleteButton: { backgroundColor: '#721c24', marginHorizontal: 24, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  deleteButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
});
