import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Switch, Alert, Text, ScrollView, StyleSheet } from 'react-native';
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Naslov:</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />
      <Text style={styles.label}>Autor:</Text>
      <TextInput value={author} onChangeText={setAuthor} style={styles.input} />
      <Text style={styles.label}>ISBN:</Text>
      <TextInput value={isbn} onChangeText={setIsbn} style={styles.input} />
      <Text style={styles.label}>Godina izdavanja:</Text>
      <TextInput
        value={publishedYear}
        onChangeText={setPublishedYear}
        keyboardType="numeric"
        style={styles.input}
      />
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Dostupna:</Text>
        <Switch value={available} onValueChange={setAvailable} />
      </View>
      <Button title="Spremi" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#f9f9f9', flexGrow: 1 },
  label: { fontSize: 16, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 16 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 }
});
