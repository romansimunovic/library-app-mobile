import { useEffect, useState } from 'react';
import { View, FlatList, Button, Alert } from 'react-native';
import { getBooks, deleteBook } from '../api/bookApi';
import BookItem from '../components/BookItem';

export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setBooks(await getBooks());
    } catch {
      Alert.alert('Greška', 'Neuspješan dohvat knjiga');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadBooks);
    return unsubscribe;
  }, [navigation]);

  const confirmDelete = (id) => {
    Alert.alert(
      'Brisanje knjige',
      'Jeste li sigurni?',
      [
        { text: 'Odustani' },
        {
          text: 'Obriši',
          onPress: async () => {
            await deleteBook(id);
            loadBooks();
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="Dodaj knjigu" onPress={() => navigation.navigate('BookForm')} />
      <FlatList
        data={books}
        keyExtractor={(item) => item.bookId}
        refreshing={loading}
        onRefresh={loadBooks}
        renderItem={({ item }) => (
          <BookItem
            book={item}
            onPress={() => navigation.navigate('BookDetail', { id: item.bookId })}
            onDelete={() => confirmDelete(item.bookId)}
          />
        )}
      />
    </View>
  );
}
