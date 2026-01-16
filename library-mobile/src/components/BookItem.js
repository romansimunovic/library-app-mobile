// BookItem.js - ISPRAVLJEN
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function BookItem({ book, onPress, onDelete, onEdit }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
        <View style={[styles.status, book.available ? styles.available : styles.unavailable]}>
          <Text style={styles.statusText}>{book.available ? 'Dostupna' : 'Zadana'}</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editButtonText}>Uredi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>Obriši</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({  // ← SAMO JEDAN const styles!
  container: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,  // ← Bolji razmak
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  content: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    color: '#a0a0cc',
    marginBottom: 8,
  },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  available: {
    backgroundColor: '#0a6734',
  },
  unavailable: {
    backgroundColor: '#721c24',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  editButtonText: {
    color: '#1e90ff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    color: '#ff4500',
    fontSize: 14,
    fontWeight: '600',
  },
});
