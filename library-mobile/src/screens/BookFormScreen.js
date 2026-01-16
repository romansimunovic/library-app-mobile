import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  Switch, 
  Alert, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Keyboard,      
  TouchableWithoutFeedback  
} from 'react-native';
import { createBook, updateBook, getBookById } from '../api/api';

export default function BookFormScreen({ route, navigation }) {
  const bookId = route.params?.bookId;
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [available, setAvailable] = useState(true);

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

  const handleSave = async () => {
    if (!title.trim() || !author.trim()) {
      Alert.alert('Greška', 'Naslov i autor knjige ne smiju biti prazni');
      return;
    }

    const bookRequest = {
      title,
      author,
      isbn: isbn || null,
      publishedYear: publishedYear ? parseInt(publishedYear) : 0,
      available
    };

    try {
      if (bookId) {
        await updateBook(bookId, bookRequest);
      } else {
        await createBook(bookRequest);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Greška', error.message);
    }
  };

  return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <ScrollView 
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Text style={styles.header}>Knjiga</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Naslov</Text>
        <TextInput 
          value={title} 
          onChangeText={setTitle} 
          style={styles.input} 
          placeholder="Unesite naslov"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Autor</Text>
        <TextInput 
          value={author} 
          onChangeText={setAuthor} 
          style={styles.input} 
          placeholder="Unesite autora"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>ISBN</Text>
        <TextInput 
          value={isbn} 
          onChangeText={setIsbn} 
          style={styles.input} 
          placeholder="npr. 978-3-16-148410-0"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Godina</Text>
        <TextInput
          value={publishedYear}
          onChangeText={setPublishedYear}
          keyboardType="numeric"
          style={styles.input}
          placeholder="npr. 2023"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.switchGroup}>
        <Text style={styles.switchLabel}>Dostupna</Text>
        <Switch 
          value={available} 
          onValueChange={setAvailable} 
          trackColor={{true: '#0a6734', false: '#721c24'}}
        />
      </View>

      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={() => {
          Keyboard.dismiss();
          handleSave();
        }}
      >
        <Text style={styles.saveButtonText}>{bookId ? 'Ažuriraj' : 'Stvori'}</Text>
      </TouchableOpacity>
    </ScrollView>
  </TouchableWithoutFeedback>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    padding: 32,
    paddingTop: 60,
  },
  inputGroup: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a0a0cc',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a0a0cc',
  },
  saveButton: {
    backgroundColor: '#0a6734',
    marginHorizontal: 24,
    marginBottom: 40,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});
