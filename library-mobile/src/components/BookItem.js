import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../theme/theme';

export default function BookItem({ book, onPress, onDelete, onEdit }) {
  // Only apply the neon glow shadow if the book is available
  const cardGlowStyle = book.available ? {
    shadowColor: COLORS.brat,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8, // For Android support
    borderColor: COLORS.brat,
  } : {
    borderColor: '#333',
    shadowOpacity: 0,
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      style={[styles.card, cardGlowStyle]} 
      onPress={onPress}
    >
      <View style={styles.mainInfo}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {book.title ? book.title.toUpperCase() : 'UNTITLED.'}
          </Text>
          <Text style={styles.author}>
            BY {book.author ? book.author.toUpperCase() : 'UNKNOWN AUTHOR'}
          </Text>
        </View>
        
        <View style={[
          styles.miniBadge, 
          { backgroundColor: book.available ? COLORS.brat : COLORS.danger }
        ]}>
          <Text style={[
            styles.miniBadgeText, 
            { color: book.available ? '#000' : '#fff' }
          ]}>
            {book.available ? 'IN' : 'OUT'}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.metaText}>
          {book.publishedYear || '0000'}
        </Text>
        <View style={styles.btnRow}>
          <TouchableOpacity onPress={onEdit} style={styles.iconBtn} hitSlop={10}>
            <MaterialIcons name="edit" size={20} color={COLORS.brat} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.iconBtn} hitSlop={10}>
            <Ionicons name="trash" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.md,
    borderWidth: 2,
    padding: SPACING.md,
    borderRadius: 2, // Sharp industrial look
  },
  mainInfo: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start' 
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: { 
    fontSize: 20, 
    fontWeight: '900', 
    color: COLORS.text, 
    letterSpacing: -1, 
    lineHeight: 22 
  },
  author: { 
    color: COLORS.muted, 
    fontWeight: '700', 
    fontSize: 12, 
    marginTop: 4,
    letterSpacing: 1
  },
  miniBadge: { 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderWidth: 1,
    borderColor: '#000',
    minWidth: 35,
    alignItems: 'center'
  },
  miniBadgeText: { 
    fontWeight: '900', 
    fontSize: 10 
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#222'
  },
  metaText: { 
    color: '#555', 
    fontSize: 12,
    fontWeight: '800' 
  },
  btnRow: { 
    flexDirection: 'row', 
    gap: 20 
  },
  iconBtn: { 
    padding: 2 
  }
});