import { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { createBook, updateBook } from '../api/bookApi';

export default function BookFormScreen({ route, navigation }) {
  const book = route.params?.book;

  const [title, setTitle] = useState(book?.title || '');
  const [author, setAuthor] = useState(book?.author || '');

  const save = async () => {
    if (!title.trim()) {
      Alert.alert('Greška', 'Naslov je obavezan');
      return;
    }

    const payload = { title, author };

    try {
      book
        ? await updateBook(book.bookId, payload)
        : await createBook(payload);
      navigation.goBack();
    } catch {
      Alert.alert('Greška', 'Spremanje nije uspjelo');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Naslov" value={title} onChangeText={setTitle} />
      <TextInput placeholder="Autor" value={author} onChangeText={setAuthor} />
      <Button title="Spremi" onPress={save} />
    </View>
  );
}
