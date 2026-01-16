// BookDetailScreen.js - Modernizirani stilovi
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

  if (loading) return <ActivityIndicator style={styles.loader} size="large" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.subtitle}>{book.author}</Text>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>ISBN</Text>
          <Text style={styles.value}>{book.isbn || '-'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Godina</Text>
          <Text style={styles.value}>{book.publishedYear || '-'}</Text>
        </View>
        
        <View style={styles.statusRow}>
          <Text style={styles.label}>Status</Text>
          <View style={[styles.status, book.available ? styles.available : styles.unavailable]}>
            <Text style={styles.statusText}>{book.available ? 'Dostupna' : 'Zadana'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23'
  },
  header: {
    padding: 32,
    paddingTop: 60,
    backgroundColor: '#1a1a2e',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 34,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#a0a0cc',
  },
  details: {
    flex: 1,
    padding: 30,
    gap: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a0a0cc',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  status: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  available: {
    backgroundColor: '#0a6734',
  },
  unavailable: {
    backgroundColor: '#721c24',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0f0f23',
  },
});
