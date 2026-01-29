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
} from 'react-native';
import BookItem from '../components/BookItem';
import { getBooks, deleteBook, searchBooks } from '../api/api';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOW } from '../theme/theme';

export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('NEWEST');
  const [searchVisible, setSearchVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const SORT_OPTIONS = ['NEWEST', 'OLDEST', 'A-Z', 'Z-A'];

  const fetchBooks = async () => {
    try {
      setLoading(true);
      let data = search ? await searchBooks(search) : await getBooks();

      switch (sortOption) {
        case 'NEWEST': data.sort((a, b) => b.publishedYear - a.publishedYear); break;
        case 'OLDEST': data.sort((a, b) => a.publishedYear - b.publishedYear); break;
        case 'A-Z': data.sort((a, b) => a.title.localeCompare(b.title)); break;
        case 'Z-A': data.sort((a, b) => b.title.localeCompare(a.title)); break;
      }
      setBooks(data);
    } catch (err) {
      Alert.alert('SYSTEM ERROR.', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, [sortOption, search]);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchBooks);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (id, title) => {
    Alert.alert(
      'WIPE ENTRY?',
      `DELETE "${title.toUpperCase()}" FOREVER?`,
      [
        { text: 'NO.', style: 'cancel' },
        { text: 'YES. DELETE.', style: 'destructive', onPress: async () => { await deleteBook(id); fetchBooks(); } },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* AGGRESSIVE HEADER */}
      <View style={styles.header}>
        <Text style={styles.kicker}>THE COLLECTION.</Text>
        <Text style={styles.headerTitle}>READING. IS.{"\n"}SO. BRAT.</Text>
      </View>

      {/* TIGHT ACTION ROW */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, styles.bgBrat]} onPress={() => setSearchVisible(true)}>
          <Ionicons name="search-sharp" size={20} color="#000" />
          <Text style={styles.btnLabel}>SEARCH.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.bgDark]} onPress={() => setDropdownVisible(true)}>
          <Text style={styles.btnLabelWhite}>{sortOption}.</Text>
          <MaterialIcons name="arrow-drop-down" size={20} color={COLORS.brat} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.bgBrat]} onPress={() => navigation.navigate('BookForm')}>
          <Ionicons name="add-sharp" size={20} color="#000" />
          <Text style={styles.btnLabel}>ADD.</Text>
        </TouchableOpacity>
      </View>

      {/* FULL SCREEN SEARCH MODAL */}
      <Modal visible={searchVisible} transparent animationType="none">
        <TouchableWithoutFeedback onPress={() => setSearchVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.searchBox}>
              <Text style={styles.searchLabel}>SEARCH. THE. ARCHIVE.</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="FIND. A. VIBE..."
                placeholderTextColor="rgba(0,0,0,0.3)"
                autoFocus
                value={search}
                onChangeText={setSearch}
                onSubmitEditing={() => setSearchVisible(false)}
              />
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSearchVisible(false)}>
                <Text style={styles.closeBtnText}>[ CLOSE ]</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* SORT MODAL */}
      <Modal visible={dropdownVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownBox}>
              {SORT_OPTIONS.map((option, i) => (
                <TouchableOpacity key={i} style={styles.dropdownItem} onPress={() => { setSortOption(option); setDropdownVisible(false); }}>
                  <Text style={styles.dropdownText}>{option}.</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* THE LIST */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.brat} size="large" />
          <Text style={styles.statusText}>LOADING. VIBES.</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={item => item.bookId.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>NO. BOOKS. FOUND.</Text>
              <Text style={styles.emptySub}>Start adding to the archive.</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: SPACING.md },
  
  header: { paddingTop: 60, marginBottom: 25 },
  kicker: { color: COLORS.brat, fontWeight: '900', letterSpacing: 3, fontSize: 12 },
  headerTitle: { 
    fontSize: 48, 
    fontWeight: '900', 
    color: COLORS.text, 
    letterSpacing: -3, 
    lineHeight: 44,
    marginTop: 5
  },

  actionRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  actionBtn: { 
    flex: 1, 
    height: 50, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000'
  },
  bgBrat: { backgroundColor: COLORS.brat, ...SHADOW.brat },
  bgDark: { backgroundColor: '#111' },
  btnLabel: { fontWeight: '900', fontSize: 11, marginLeft: 4, color: '#000' },
  btnLabelWhite: { fontWeight: '900', fontSize: 11, marginRight: 4, color: '#fff' },

  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.95)', 
    justifyContent: 'center', 
    padding: 20 
  },
  searchBox: { 
    backgroundColor: COLORS.brat, 
    padding: 30, 
    borderWidth: 4, 
    borderColor: '#000' 
  },
  searchLabel: { fontWeight: '900', fontSize: 12, marginBottom: 10 },
  searchInput: { fontSize: 32, fontWeight: '900', color: '#000', letterSpacing: -1 },
  closeBtn: { marginTop: 20, alignSelf: 'flex-end' },
  closeBtnText: { fontWeight: '900', fontSize: 12 },

  dropdownBox: { backgroundColor: '#111', borderWidth: 2, borderColor: COLORS.brat },
  dropdownItem: { paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
  dropdownText: { color: '#fff', fontWeight: '900', fontSize: 16, textAlign: 'center' },

  list: { paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statusText: { color: COLORS.brat, fontWeight: '900', marginTop: 10, letterSpacing: 2 },

  empty: { marginTop: 100, alignItems: 'center' },
  emptyTitle: { fontSize: 24, fontWeight: '900', color: '#444' },
  emptySub: { color: '#666', marginTop: 5, fontWeight: '700' },
});