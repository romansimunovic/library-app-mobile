import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { getBookById, deleteBook } from '../api/api';
import { COLORS, SPACING, SHADOW, RADIUS, TYPOGRAPHY } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BookDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,
      headerTintColor: COLORS.ethereal,
    });

    getBookById(bookId)
      .then(data => setBook(data))
      .catch(err => Alert.alert('Error', err.message))
      .finally(() => setLoading(false));
  }, [bookId]);

  const handleDelete = () => {
    Alert.alert(
      'Release Entry',
      `Permanently remove "${book.title.toLowerCase()}"?`,
      [
        { text: 'cancel', style: 'cancel' },
        {
          text: 'release',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBook(bookId);
              if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              navigation.navigate('BookList');
            } catch (err) {
              Alert.alert('failed.', err.message);
            }
          },
        },
      ]
    );
  };

  if (loading) return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={COLORS.ethereal} />
    </View>
  );

  if (!book) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 40 }]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.kicker}>archive entry</Text>
          <Text style={styles.title}>{book.title.toLowerCase()}</Text>
          <View style={styles.authorContainer}>
            <View style={styles.line} />
            <Text style={styles.author}>{book.author.toLowerCase()}</Text>
            <View style={styles.line} />
          </View>
        </View>

        <View style={[styles.statusBlock, SHADOW.softGlow]}>
          <View style={[styles.statusDot, { backgroundColor: book.available ? COLORS.ethereal : COLORS.danger }]} />
          <Text style={styles.statusText}>
            {book.available ? 'present in the collection' : 'currently wandering'}
          </Text>
        </View>

        <View style={styles.grid}>
          <GridItem label="identity / isbn" value={book.isbn || 'unregistered'} />
          <GridItem label="manifested / year" value={book.publishedYear || 'unknown'} />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.editButton, SHADOW.softGlow]}
            onPress={() => navigation.navigate('BookForm', { bookId })}
          >
            <Ionicons name="pencil-outline" size={18} color={COLORS.bg} />
            <Text style={styles.editText}>edit details</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteText}>delete from collection</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const GridItem = ({ label, value }) => (
  <View style={styles.gridItem}>
    <Text style={styles.gridLabel}>{label}</Text>
    <Text style={styles.gridValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingBottom: 60 },
  loader: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  hero: { padding: SPACING.lg, alignItems: 'center', marginBottom: 20 },
  kicker: { ...TYPOGRAPHY.ethereal, color: COLORS.ethereal, fontSize: 12, marginBottom: 8 },
  title: { fontSize: 48, fontWeight: '200', color: COLORS.text, textAlign: 'center', lineHeight: 52 },
  authorContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 15, gap: 10 },
  line: { height: 1, width: 20, backgroundColor: COLORS.muted, opacity: 0.3 },
  author: { ...TYPOGRAPHY.ethereal, fontSize: 14, color: COLORS.muted },
  statusBlock: {
    marginHorizontal: SPACING.lg, paddingVertical: 15, borderRadius: RADIUS.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', marginBottom: 40,
    borderWidth: 1, borderColor: 'rgba(113, 181, 209, 0.2)'
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 10 },
  statusText: { ...TYPOGRAPHY.ethereal, color: COLORS.text, fontSize: 11 },
  grid: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.md, marginBottom: 30 },
  gridItem: { 
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: SPACING.lg, 
    borderRadius: RADIUS.lg, borderWidth: 1, borderColor: 'rgba(113, 181, 209, 0.05)'
  },
  gridLabel: { color: COLORS.ethereal, fontSize: 9, ...TYPOGRAPHY.ethereal, marginBottom: 8, opacity: 0.8 },
  gridValue: { color: COLORS.text, fontSize: 18, fontWeight: '300' },
  actions: { paddingHorizontal: SPACING.lg, gap: 15 },
  editButton: {
    backgroundColor: COLORS.ethereal, paddingVertical: 20, borderRadius: RADIUS.xl,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10
  },
  editText: { ...TYPOGRAPHY.ethereal, fontSize: 14, fontWeight: '600', color: COLORS.bg },
  deleteButton: { paddingVertical: 15, alignItems: 'center' },
  deleteText: { color: COLORS.danger, ...TYPOGRAPHY.ethereal, fontSize: 14, opacity: 0.78 },
});