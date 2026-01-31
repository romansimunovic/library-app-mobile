import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOW } from '../theme/theme';

export default function BookItem({ book, onPress, onEdit, onDelete }) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress} 
      style={[styles.card, SHADOW.softGlow]}
    >
      {/* TOP ROW: Identity & Actions */}
      <View style={styles.header}>
        <View style={styles.identity}>
          <Text style={styles.title} numberOfLines={1}>
            {book.title.toLowerCase()}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {book.author.toLowerCase()}
          </Text>
        </View>
        
        <View style={styles.actionCluster}>
          <TouchableOpacity onPress={onEdit} style={styles.iconBtn}>
            <Ionicons name="pencil-outline" size={16} color={COLORS.ethereal} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.iconBtn}>
            <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* BOTTOM ROW: Technical Specs */}
      <View style={styles.specRow}>
        <View style={styles.specItem}>
          <MaterialCommunityIcons name="identifier" size={12} color={COLORS.muted} />
          <Text style={styles.specText}>{book.isbn || 'no-isbn'}</Text>
        </View>

        <View style={styles.specItem}>
          <MaterialCommunityIcons name="calendar-blank" size={12} color={COLORS.muted} />
          <Text style={styles.specText}>{book.publishedYear || '—'}</Text>
        </View>

        <View style={[styles.badge, { borderColor: book.available ? COLORS.ethereal : COLORS.danger }]}>
          <View style={[styles.statusDot, { backgroundColor: book.available ? COLORS.ethereal : COLORS.danger }]} />
          <Text style={[styles.badgeText, { color: book.available ? COLORS.ethereal : COLORS.danger }]}>
            {book.available ? 'present' : 'away'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginHorizontal: SPACING.md,
    marginBottom: 12,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(113, 181, 209, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  identity: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  author: {
    ...TYPOGRAPHY.ethereal,
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  actionCluster: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: RADIUS.md,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specText: {
    ...TYPOGRAPHY.ethereal,
    fontSize: 10,
    color: COLORS.muted,
  },
  badge: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    gap: 5,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  badgeText: {
    ...TYPOGRAPHY.ethereal,
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  }
});