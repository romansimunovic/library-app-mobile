import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function BookItem({ book, onPress, onDelete, onEdit }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{book.title}</Text>
        <Text>{book.author}</Text>
        <Text>{book.available ? 'Dostupna' : 'Nedostupna'}</Text>
      </View>
      <View style={styles.buttons}>
        <Text onPress={onEdit} style={styles.editBtn}>Uredi</Text>
        <Text onPress={onDelete} style={styles.deleteBtn}>Obriši</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: { fontWeight: '600', marginBottom: 4 },
  buttons: { flexDirection: 'row' },
  editBtn: { marginRight: 16, color: '#1e90ff', fontWeight: 'bold' },
  deleteBtn: { color: '#ff4500', fontWeight: 'bold' }
});
