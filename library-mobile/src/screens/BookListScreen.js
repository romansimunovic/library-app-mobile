// BookListScreen.js - Modernizirani stilovi
import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BookItem from '../components/BookItem';
import { getBooks, deleteBook } from '../api/api';

export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
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
              fetchBooks();
            } catch (error) {
              Alert.alert('Greška', error.error.message);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Knjige</Text>
    </View>
    
    <View style={styles.actionRow}>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('BookForm')}
      >
        <Text style={styles.addButtonText}>Dodaj knjigu</Text>
      </TouchableOpacity>
    </View>

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
            <Text style={styles.emptySubtext}>Dodajte prvu knjigu pritiskom na gumb gore</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#1a1a2e',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  actionRow: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  addButton: {
    backgroundColor: '#0a6734',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 60,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#a0a0cc',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#a0a0cc',
    textAlign: 'center',
    lineHeight: 24,
  },
});
