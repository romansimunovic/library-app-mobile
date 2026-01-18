import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function BookItem({ book, onPress, onDelete, onEdit }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
        {book.isbn ? <Text style={styles.isbn}>ISBN: {book.isbn}</Text> : null}
        <Text style={styles.year}>Godina: {book.publishedYear}</Text>
        <Text style={[styles.available, { color: book.available ? '#0a6734' : '#c00' }]}>
          {book.available ? 'Dostupna' : 'Nedostupna'}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.actionText}>Uredi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.actionText}>Obriši</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  author: {
    fontSize: 14,
    color: '#a0a0cc',
    marginBottom: 2,
  },
  isbn: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  year: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  available: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row', // horizontalno
    alignItems: 'center',
    gap: 8, // razmak između gumbića
  },
  editButton: {
    backgroundColor: '#0a6734',
    paddingVertical: 8, // veći touch area
    paddingHorizontal: 16,
    borderRadius: 16, // više rounded
  },
  deleteButton: {
    backgroundColor: '#c00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  actionText: {
    color: '#fff',
    fontSize: 14, // veći font
    fontWeight: '700',
  },
});
