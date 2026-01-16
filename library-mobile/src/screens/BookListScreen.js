import React, { useState, useEffect } from 'react';
import { View, FlatList, Button, Alert, Text, StyleSheet } from 'react-native';
import BookItem from '../components/BookItem';
import { getBooks, deleteBook } from '../api/api';

export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks(); // dohvat BookResponse
      setBooks(data);
    } catch (error) {
      Alert.alert('Greška', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      'Potvrda brisanja',
      'Jeste li sigurni da želite obrisati knjigu?',
      [
        { text: 'Ne', style: 'cancel' },
        {
          text: 'Da',
          onPress: async () => {
            try {
              await deleteBook(id);
              fetchBooks(); // refresh
            } catch (error) {
              Alert.alert('Greška', error.message);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Dodaj knjigu" onPress={() => navigation.navigate('BookForm')} />
      {loading ? (
        <Text style={styles.loading}>Učitavanje...</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.bookId}
          renderItem={({ item }) => (
            <BookItem
              book={item}
              onPress={() => navigation.navigate('BookDetail', { bookId: item.bookId })}
              onDelete={() => handleDelete(item.bookId)}
              onEdit={() => navigation.navigate('BookForm', { bookId: item.bookId })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f4f8' },
  loading: { marginTop: 16, textAlign: 'center', fontStyle: 'italic' }
});
