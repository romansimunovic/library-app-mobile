import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
} from 'react-native';
import BookItem from '../components/BookItem';
import { getBooks, deleteBook, searchBooks } from '../api/api';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOW, RADIUS, TYPOGRAPHY } from '../theme/theme';
import * as Haptics from 'expo-haptics';

/**
 * Main Archive View. Handles searching, sorting, and listing books.
 */
export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [searchVisible, setSearchVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const SORT_OPTIONS = ['newest', 'oldest', 'a-z', 'z-a'];

  const fetchBooks = async () => {
    try {
      setLoading(true);
      let data = search ? await searchBooks(search) : await getBooks();

      // Sorting Logic
      data.sort((a, b) => {
        const yearA = parseInt(a.publishedYear) || 0;
        const yearB = parseInt(b.publishedYear) || 0;
        if (sortOption === 'newest') return yearB - yearA;
        if (sortOption === 'oldest') return yearA - yearB;
        if (sortOption === 'a-z') return a.title.localeCompare(b.title);
        if (sortOption === 'z-a') return b.title.localeCompare(a.title);
        return 0;
      });

      setBooks(data);
    } catch (err) {
      console.error("[Archive Fetch Error]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, [sortOption, search]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchBooks);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (id, title) => {
    Alert.alert(
      'Release Entry',
      `Remove "${title.toLowerCase()}" from the archive?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await deleteBook(id);
              if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              await fetchBooks();
              setTimeout(() => Alert.alert('Deleted', 'Entry removed.'), 500);
            } catch (err) {
              Alert.alert('Error', 'Could not delete entry.');
            }
          } 
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER SECTION - No spaces between tags to prevent Web errors */}
      <View style={styles.header}>
        <Text style={styles.kicker}>collection</Text>
        <Text style={styles.headerTitle}>your book collection</Text>
      </View>

      {/* ACTION CONTROLS */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setSearchVisible(true)}>
          <Ionicons name="search-outline" size={18} color={COLORS.ethereal} />
          <Text style={styles.btnLabel}>search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => setDropdownVisible(true)}>
          <Text style={styles.btnLabel}>{sortOption}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={18} color={COLORS.ethereal} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionBtn, styles.addBtn]} 
          onPress={() => navigation.navigate('BookForm')}
        >
          <Ionicons name="add" size={20} color={COLORS.bg} />
          <Text style={[styles.btnLabel, { color: COLORS.bg }]}>add</Text>
        </TouchableOpacity>
      </View>

      {/* MAIN LIST CONTENT */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.ethereal} size="large" />
          <Text style={styles.statusText}>Syncing archive...</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={item => item.bookId.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>nothing manifested.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <BookItem
              book={item}
              onPress={() => navigation.navigate('BookDetail', { bookId: item.bookId })}
              onEdit={() => navigation.navigate('BookForm', { bookId: item.bookId })}
              onDelete={() => handleDelete(item.bookId, item.title)}
            />
          )}
        />
      )}

      {/* MODALS REMAIN THE SAME BUT ENSURE CLEAN JSX */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: SPACING.md, paddingTop: 60, marginBottom: 20 },
  kicker: { ...TYPOGRAPHY.ethereal, color: COLORS.ethereal, fontSize: 12 },
  headerTitle: { fontSize: 31, fontWeight: '200', color: COLORS.text },
  actionRow: { flexDirection: 'row', gap: 10, paddingHorizontal: SPACING.md, marginBottom: 20 },
  actionBtn: { 
    flex: 1, height: 45, borderRadius: RADIUS.xl, 
    backgroundColor: COLORS.surface, flexDirection: 'row', 
    alignItems: 'center', justifyContent: 'center', gap: 5 
  },
  addBtn: { backgroundColor: COLORS.ethereal },
  btnLabel: { ...TYPOGRAPHY.ethereal, color: COLORS.text, fontSize: 11, fontWeight: '500' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statusText: { ...TYPOGRAPHY.ethereal, color: COLORS.muted, marginTop: 15, fontSize: 10 },
  list: { paddingBottom: 40 },
  empty: { marginTop: 100, alignItems: 'center' },
  emptyTitle: { ...TYPOGRAPHY.ethereal, color: COLORS.muted }
});