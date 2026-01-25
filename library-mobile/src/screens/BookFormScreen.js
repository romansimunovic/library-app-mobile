import React, { useState, useEffect } from 'react';
import { 
  View, TextInput, Switch, Alert, Text, ScrollView, StyleSheet, 
  TouchableOpacity, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import { createBook, updateBook, getBookById, deleteBook } from '../api/api';

export default function BookFormScreen({ route, navigation }) {
  const bookId = route.params?.bookId;

  // Stanja forme
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [available, setAvailable] = useState(true);

  // Originalna vrijednost za praćenje promjena
  const [originalData, setOriginalData] = useState({ title:'', author:'', isbn:'', publishedYear:'', available:true });

  // Error flagovi
  const [errors, setErrors] = useState({ title: false, author: false, isbn: false, publishedYear: false });

  // ISBN regex (10 ili 13 znamenki, opcionalno s crticama)
  const isbnRegex = /^(?:\d[\- ]?){9,12}[\dX]$/i;

  // Učitavanje knjige ako je edit
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
        .catch(err => Alert.alert('Greška', err.message));
    }
  }, [bookId]);

  // Provjera valjanosti unosa
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
      Alert.alert('Greška', 'Provjerite unesena polja (ISBN mora imati 10 ili 13 znakova, godina 4 znamenke).');
    }
    return valid;
  };

  // Provjera da li ima promjena
  const dirty = title !== originalData.title || author !== originalData.author || isbn !== originalData.isbn || publishedYear !== originalData.publishedYear || available !== originalData.available;

  // Save
  const handleSave = async () => {
    Keyboard.dismiss();
    if (!validate()) return;

    const bookRequest = { title:title.trim(), author:author.trim(), available };
    if (isbn.trim()) bookRequest.isbn = isbn.trim();
    if (publishedYear.trim()) bookRequest.publishedYear = parseInt(publishedYear);

    try {
      if (bookId) {
        await updateBook(bookId, bookRequest);
        Alert.alert('Uspjeh', `Knjiga "${title}" ažurirana!`);
      } else {
        await createBook(bookRequest);
        Alert.alert('Uspjeh', `Knjiga "${title}" dodana!`);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Greška', error.message);
    }
  };

  // Delete
  const handleDelete = () => {
    Alert.alert(
      'Potvrda brisanja',
      `Jeste li sigurni da želite obrisati knjigu "${title}"?`,
      [
        { text:'Odustani', style:'cancel' },
        { text:'Obriši', style:'destructive', onPress: async () => {
          try {
            await deleteBook(bookId);
            Alert.alert('Uspjeh', `Knjiga "${title}" obrisana!`);
            navigation.goBack();
          } catch(error) {
            Alert.alert('Greška', error.message);
          }
        }}
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow:1, paddingBottom:40 }}>
        <Text style={styles.header}>{bookId ? 'Uredi knjigu' : 'Dodaj knjigu'}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Naslov</Text>
          <TextInput value={title} onChangeText={setTitle} style={[styles.input, errors.title && styles.inputError]} placeholder="Unesite naslov" placeholderTextColor="#999" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Autor</Text>
          <TextInput value={author} onChangeText={setAuthor} style={[styles.input, errors.author && styles.inputError]} placeholder="Unesite autora" placeholderTextColor="#999" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>ISBN</Text>
          <TextInput value={isbn} onChangeText={setIsbn} style={[styles.input, errors.isbn && styles.inputError]} placeholder="npr. 978-3-16-148410-0" placeholderTextColor="#999" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Godina</Text>
          <TextInput value={publishedYear} onChangeText={setPublishedYear} keyboardType="numeric" style={[styles.input, errors.publishedYear && styles.inputError]} placeholder="npr. 2023" placeholderTextColor="#999" />
        </View>

        <View style={styles.switchGroup}>
          <Text style={styles.switchLabel}>Dostupna</Text>
          <Switch value={available} onValueChange={setAvailable} trackColor={{true:'#0a6734', false:'#721c24'}} thumbColor="#fff" />
        </View>

        <TouchableOpacity style={[styles.saveButton, !dirty && {opacity:0.6}]} onPress={handleSave} disabled={!dirty}>
          <Text style={styles.saveButtonText}>{bookId ? 'Ažuriraj' : 'Kreiraj'}</Text>
        </TouchableOpacity>

        {bookId && (
          <TouchableOpacity style={[styles.deleteButton, {marginTop:8}]} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Obriši knjigu</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0f0f23' },
  header:{ fontSize:28, fontWeight:'800', color:'#fff', textAlign:'center', marginVertical:32 },
  inputGroup:{ marginBottom:24, paddingHorizontal:24 },
  label:{ fontSize:16, fontWeight:'600', color:'#a0a0cc', marginBottom:8 },
  input:{ backgroundColor:'#1a1a2e', borderRadius:16, paddingVertical:16, paddingHorizontal:20, fontSize:16, color:'#fff', borderWidth:1, borderColor:'#2a2a3e' },
  inputError:{ borderColor:'#c00' },
  switchGroup:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:24, marginBottom:40 },
  switchLabel:{ fontSize:16, fontWeight:'600', color:'#a0a0cc' },
  saveButton:{ backgroundColor:'#0a6734', marginHorizontal:24, borderRadius:16, paddingVertical:18, alignItems:'center', marginBottom:16 },
  saveButtonText:{ color:'#fff', fontSize:18, fontWeight:'700' },
  deleteButton:{ backgroundColor:'#721c24', marginHorizontal:24, borderRadius:16, paddingVertical:18, alignItems:'center' },
  deleteButtonText:{ color:'#fff', fontSize:18, fontWeight:'700' },
});
