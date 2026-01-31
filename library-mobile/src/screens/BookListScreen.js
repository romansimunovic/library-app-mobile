import React, { useState, useEffect, useCallback } from 'react';
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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import BookItem from '../components/BookItem';
import { getBooks, deleteBook, searchBooks } from '../api/api';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme/theme';

/**
 * BookListScreen
 *
 * Main archive screen responsible for:
 * - Fetching and displaying books
 * - Searching (debounced)
 * - Sorting
 * - Navigation to detail/edit/create views
 *
 * Design principle:
 * UI state drives data state, not the other way around.
 */
export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  const [searchVisible, setSearchVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);

  const SORT_OPTIONS = ['newest', 'oldest', 'a-z', 'z-a'];

  /**
   * Fetches books from API depending on search state.
   * Sorting is applied client-side for predictability.
   */
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);

      const data = search.trim()
        ? await searchBooks(search.trim())
        : await getBooks();

      const sorted = [...data].sort((a, b) => {
        const yearA = parseInt(a.publishedYear) || 0;
        const yearB = parseInt(b.publishedYear) || 0;

        switch (sortOption) {
          case 'newest':
            return yearB - yearA;
          case 'oldest':
            return yearA - yearB;
          case 'a-z':
            return a.title.localeCompare(b.title);
          case 'z-a':
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });

      setBooks(sorted);
    } catch (error) {
      console.error('[Book Fetch Error]', error);
    } finally {
      setLoading(false);
    }
  }, [search, sortOption]);

  /**
   * Debounced search effect.
   * Prevents API spam while typing.
   */
  useEffect(() => {
    const timeout = setTimeout(fetchBooks, 400);
    return () => clearTimeout(timeout);
  }, [fetchBooks]);

  /**
   * Refresh data when screen gains focus.
   */
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchBooks);
    return unsubscribe;
  }, [navigation, fetchBooks]);

  /**
   * Deletes a book entry with confirmation.
   */
  const handleDelete = (id, title) => {
    Alert.alert(
      'Release Entry',
      `Remove "${title}" from the archive?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBook(id);
              if (Platform.OS !== 'web') {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
              }
              fetchBooks();
            } catch {
              Alert.alert('Error', 'Failed to delete entry.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.kicker}>collection</Text>
        <Text style={styles.headerTitle}>your book archive</Text>
      </View>

      {/* ACTION BAR */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setSearchVisible(true)}
        >
          <Ionicons name="search-outline" size={18} color={COLORS.ethereal} />
          <Text style={styles.btnLabel}>search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setSortVisible(true)}
        >
          <Text style={styles.btnLabel}>{sortOption}</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={18}
            color={COLORS.ethereal}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.addBtn]}
          onPress={() => navigation.navigate('BookForm')}
        >
          <Ionicons name="add" size={20} color={COLORS.bg} />
          <Text style={[styles.btnLabel, { color: COLORS.bg }]}>add</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.ethereal} />
          <Text style={styles.statusText}>Syncing archive…</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.bookId.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>nothing here yet.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <BookItem
              book={item}
              onPress={() =>
                navigation.navigate('BookDetail', { bookId: item.bookId })
              }
              onEdit={() =>
                navigation.navigate('BookForm', { bookId: item.bookId })
              }
              onDelete={() => handleDelete(item.bookId, item.title)}
            />
          )}
        />
      )}

      {/* SEARCH MODAL */}
      <Modal visible={searchVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setSearchVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                <TextInput
                  autoFocus
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search by title…"
                  placeholderTextColor={COLORS.muted}
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={() => setSearchVisible(false)}
                  style={styles.modalBtn}
                >
                  <Text style={{ color: COLORS.ethereal }}>done</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* SORT MODAL */}
      <Modal visible={sortVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setSortVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    setSortOption(option);
                    setSortVisible(false);
                  }}
                  style={styles.sortOption}
                >
                  <Text style={styles.btnLabel}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    paddingTop: 60,
    paddingHorizontal: SPACING.md,
    marginBottom: 20,
  },
  kicker: { ...TYPOGRAPHY.ethereal, fontSize: 12, color: COLORS.ethereal },
  headerTitle: { fontSize: 30, fontWeight: '200', color: COLORS.text },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: SPACING.md,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    height: 45,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addBtn: { backgroundColor: COLORS.ethereal },
  btnLabel: { ...TYPOGRAPHY.ethereal, fontSize: 11, color: COLORS.text },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statusText: { marginTop: 10, color: COLORS.muted, fontSize: 10 },

  list: { paddingBottom: 40 },
  empty: { marginTop: 120, alignItems: 'center' },
  emptyTitle: { color: COLORS.muted },

  /* ---------- MODAL LAYERING ---------- */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)', // push background back harder
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    width: '85%',
    backgroundColor: COLORS.bg, // clear surface separation
    borderRadius: RADIUS.xl,
    padding: 20,

    // subtle outline = edge definition
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',

    // elevation / depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 16,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.muted,
    color: COLORS.text,
    paddingVertical: 8,
  },

  modalBtn: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },

  /* ---------- SORT OPTIONS ---------- */

  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
  },

  sortOptionText: {
    fontSize: 14,
    color: COLORS.text, // readable by default
  },

  sortOptionActive: {
    backgroundColor: COLORS.ethereal,
  },

  sortOptionTextActive: {
    color: COLORS.bg,
    fontWeight: '600',
  },
});
