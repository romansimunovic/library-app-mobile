import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { getBookById, deleteBook } from '../api/api';
import { COLORS, SPACING, SHADOW } from '../theme/theme';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const formatYear = year => {
  if (!year) return 'UNKNOWN';
  if (year < 0) return `${Math.abs(year)} BC`;
  return year.toString();
};

const formatIsbn = isbn => {
  if (!isbn) return 'NOT REGISTERED';
  return isbn;
};

export default function BookDetailScreen({ route, navigation }) {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'THE. DETAILS.' });

    getBookById(bookId)
      .then(data => setBook(data))
      .catch(err => Alert.alert('ERROR.', err.message))
      .finally(() => setLoading(false));
  }, [bookId]);

  const handleDelete = () => {
    Alert.alert(
      'DELETE. BOOK.',
      `WIPE "${book.title.toUpperCase()}" FROM THE ARCHIVE?`,
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'DELETE',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBook(bookId);
              navigation.navigate('BookList', { refresh: true });
            } catch (err) {
              Alert.alert('FAILED.', err.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.brat} />
      </View>
    );
  }

  if (!book) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* GIANT HERO SECTION */}
      <View style={styles.hero}>
  <Text style={styles.kicker}>BOOK ENTRY</Text>

  <Text
    style={styles.title}
    numberOfLines={3}
    adjustsFontSizeToFit
  >
    {book.title}
  </Text>

  <Text style={styles.author}>
    by {book.author}
  </Text>
</View>


      {/* STATUS BLOCK */}
      <View
  style={[
    styles.statusBlock,
    {
      backgroundColor: book.available
        ? COLORS.brat
        : COLORS.dangerDark,
    },
  ]}
>
  <Text
    style={[
      styles.statusText,
      { color: book.available ? '#000' : '#fff' },
    ]}
  >
    {book.available
      ? 'AVAILABLE FOR BORROWING'
      : 'CURRENTLY CHECKED OUT'}
  </Text>
</View>


      {/* SPECS GRID */}
      <View style={styles.grid}>
  <View style={styles.gridItem}>
    <Text style={styles.gridLabel}>ISBN</Text>
    <Text style={styles.gridValue}>
      {formatIsbn(book.isbn)}
    </Text>
  </View>

  <View style={styles.gridItem}>
    <Text style={styles.gridLabel}>PUBLISHED</Text>
    <Text style={styles.gridValue}>
      {formatYear(book.publishedYear)}
    </Text>
  </View>
</View>


      {/* ACTION ROW */}
      <View style={styles.actions}>
  <TouchableOpacity
    style={styles.editButton}
    onPress={() =>
      navigation.navigate('BookForm', { bookId })
    }
  >
    <MaterialIcons name="edit" size={24} color="#000" />
    <Text style={styles.editText}>EDIT ENTRY</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.deleteButton}
    onPress={handleDelete}
  >
    <Text style={styles.deleteText}>
      DELETE FROM ARCHIVE
    </Text>
  </TouchableOpacity>
</View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  loader: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    padding: SPACING.lg,
    paddingTop: 40,
  },
  kicker: {
    color: COLORS.brat,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: 46,
    letterSpacing: -2,
    marginBottom: 10,
  },
  author: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.muted,
    letterSpacing: 1,
  },
  statusBlock: {
    marginHorizontal: SPACING.lg,
    paddingVertical: 15,
    borderWidth: 3,
    borderColor: '#000',
    alignItems: 'center',
    transform: [{ rotate: '-1.5deg' }], // Anti-design tilt
    marginVertical: SPACING.xl,
    ...SHADOW.brat,
  },
  statusText: {
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  gridItem: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: '#333',
  },
  gridLabel: {
    color: COLORS.brat,
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 4,
  },
  gridValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  actions: {
    paddingHorizontal: SPACING.lg,
    gap: 15,
  },
  editButton: {
    backgroundColor: COLORS.brat,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 3,
    borderColor: '#000',
    ...SHADOW.brat,
  },
  editText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  deleteButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteText: {
    color: COLORS.danger,
    fontWeight: '800',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});