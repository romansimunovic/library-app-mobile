import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Component representing a single book card.
 * Displays title, author, ISBN, year, availability, and action buttons.
 */
export default function BookItem({ book, onPress, onDelete, onEdit }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
        {book.isbn && <Text style={styles.isbn}>ISBN: {book.isbn}</Text>}
        <Text style={styles.year}>Year: {book.publishedYear}</Text>
        <Text style={[styles.available, { color: book.available ? '#4da775' : '#d13232' }]}>
          {book.available ? 'Available' : 'Unavailable'}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:{ backgroundColor:'#1a1a2e', borderRadius:16, padding:16, marginBottom:12, flexDirection:'row', justifyContent:'space-between', alignItems:'center', shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.3, shadowRadius:6, elevation:4 },
  info:{ flex:1, marginRight:12 },
  title:{ fontSize:18, fontWeight:'700', color:'#fff', marginBottom:2 },
  author:{ fontSize:14, color:'#a0a0cc', marginBottom:2 },
  isbn:{ fontSize:12, color:'#888', marginBottom:2 },
  year:{ fontSize:12, color:'#888', marginBottom:2 },
  available:{ fontSize:12, fontWeight:'600' },
  actions:{ flexDirection:'row', alignItems:'center', gap:8 },
  editButton:{ backgroundColor:'#273588', paddingVertical:10, paddingHorizontal:16, borderRadius:16 },
  deleteButton:{ backgroundColor:'#ad2424', paddingVertical:10, paddingHorizontal:16, borderRadius:16 },
  actionText:{ color:'#fff', fontSize:14, fontWeight:'700' },
});
