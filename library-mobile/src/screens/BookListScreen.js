import React, { useState, useEffect } from 'react';
import { 
  View, FlatList, Alert, Text, StyleSheet, TouchableOpacity, TextInput 
} from 'react-native';
import BookItem from '../components/BookItem';
import { getBooks, deleteBook, searchBooks } from '../api/api';

export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortNewest, setSortNewest] = useState(true);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      let data = search ? await searchBooks(search) : await getBooks();
      data.sort((a, b) => sortNewest ? b.publishedYear - a.publishedYear : a.publishedYear - b.publishedYear);
      setBooks(data);
    } catch (error) {
      Alert.alert('Greška', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [sortNewest, search]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchBooks);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (id) => {
    Alert.alert(
      'Potvrda brisanja',
      'Jeste li sigurni da želite obrisati knjigu?',
      [
        { text: 'Ne', style: 'cancel' },
        {
          text: 'Da',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBook(id);
              fetchBooks();
            } catch (error) {
              Alert.alert('Greška', error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Knjige</Text>
      </View>

      {/* SEARCH, SORT, ADD */}
      <View style={styles.actionRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pretraži naslov ili autora"
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setSortNewest(!sortNewest)}
        >
          <Text style={styles.sortButtonText}>
            {sortNewest ? 'Najnovije' : 'Najstarije'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('BookForm')}
        >
          <Text style={styles.addButtonText}>+ Dodaj</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Učitavanje knjiga...</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.bookId}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Još nema knjiga</Text>
              <Text style={styles.emptySubtext}>
                Dodajte prvu knjigu pritiskom na gumb + Dodaj
              </Text>
            </View>
          }
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
  container: { flex: 1, backgroundColor: '#0f0f23' },

  header: { 
    paddingHorizontal: 24, 
    paddingTop: 60, 
    paddingBottom: 20, 
    backgroundColor: '#1a1a2e', 
    alignItems: 'center',
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff' },

  actionRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingVertical: 16, 
    gap: 8,
  },
  searchInput: { 
    flex: 1, 
    backgroundColor: '#1a1a2e', 
    color: '#fff', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    height: 44, 
    fontSize: 16,
  },
  sortButton: {
    backgroundColor: '#0a6734', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 12,
  },
  sortButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  addButton: { 
    backgroundColor: '#0a6734', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 12,
  },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  list: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 60, flexGrow: 1 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#a0a0cc', fontSize: 16 },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 20, fontWeight: '600', color: '#fff', marginBottom: 8 },
  emptySubtext: { fontSize: 16, color: '#a0a0cc', textAlign: 'center', lineHeight: 24 },
});
