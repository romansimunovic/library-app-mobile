import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { getBookById } from '../api/api';

export default function BookDetailScreen({ route }) {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookById(bookId)
      .then(data => setBook(data))
      .catch(err => Alert.alert('Greška', err.message))
      .finally(() => setLoading(false));
  }, [bookId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.label}>Autor: <Text style={styles.value}>{book.author}</Text></Text>
      <Text style={styles.label}>ISBN: <Text style={styles.value}>{book.isbn || '-'}</Text></Text>
      <Text style={styles.label}>Godina izdavanja: <Text style={styles.value}>{book.publishedYear || '-'}</Text></Text>
      <Text style={styles.label}>Dostupna: <Text style={styles.value}>{book.available ? 'Da' : 'Ne'}</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  value: { fontWeight: '600' }
});
