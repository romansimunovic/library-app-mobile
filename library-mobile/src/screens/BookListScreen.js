import React, { useState, useEffect } from 'react';
import { 
  View, FlatList, Alert, Text, StyleSheet, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback 
} from 'react-native';
import BookItem from '../components/BookItem';
import { getBooks, deleteBook, searchBooks } from '../api/api';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

/**
 * Screen displaying the list of books.
 * Supports searching, sorting, adding, editing, and deleting books.
 */
export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('Newest');
  const [searchVisible, setSearchVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      let data = search ? await searchBooks(search) : await getBooks();

      switch(sortOption) {
        case 'Newest': data.sort((a,b)=>b.publishedYear - a.publishedYear); break;
        case 'Oldest': data.sort((a,b)=>a.publishedYear - b.publishedYear); break;
        case 'A-Z': data.sort((a,b)=>a.title.localeCompare(b.title)); break;
        case 'Z-A': data.sort((a,b)=>b.title.localeCompare(a.title)); break;
      }

      setBooks(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, [sortOption, search]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchBooks);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Confirmation',
      'Are you sure you want to delete this book?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', style: 'destructive', onPress: async () => { await deleteBook(id); fetchBooks(); } },
      ]
    );
  };

  const SORT_OPTIONS = ['Newest','Oldest','A-Z','Z-A'];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Books</Text>
      </View>

      {/* ACTION ROW */}
      <View style={styles.actionRow}>
        {/* SEARCH ICON */}
        <TouchableOpacity onPress={()=>setSearchVisible(true)} style={styles.searchIconButton}>
          <Ionicons name="search" size={28} color="#fff" />
        </TouchableOpacity>

        {/* SORT DROPDOWN */}
        <TouchableOpacity 
          style={styles.sortButton} 
          onPress={()=>setDropdownVisible(true)}
        >
          <Text style={styles.sortButtonText}>{sortOption}</Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="#fff" />
        </TouchableOpacity>

        {/* ADD BUTTON */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={()=>navigation.navigate('BookForm')}
        >
          <Ionicons name="add" size={20} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.addButtonText}>Add Book</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH MODAL */}
      <Modal visible={searchVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={()=>setSearchVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.searchModal}>
              <TextInput
                style={styles.searchInputModal}
                placeholder="Type book title"
                placeholderTextColor="#aaa"
                value={search}
                autoFocus
                onChangeText={setSearch}
                onSubmitEditing={() => { fetchBooks(); setSearchVisible(false); }}
              />
              <TouchableOpacity onPress={() => { fetchBooks(); setSearchVisible(false); }}>
                <Ionicons name="search" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* SORT DROPDOWN MODAL */}
      <Modal visible={dropdownVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={()=>setDropdownVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownModal}>
              {SORT_OPTIONS.map((option,index)=>(
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={()=>{ setSortOption(option); setDropdownVisible(false); }}
                >
                  <Text style={styles.dropdownItemText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* BOOK LIST */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading books...</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item)=>item.bookId}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No books yet</Text>
              <Text style={styles.emptySubtext}>Add your first book by pressing the + Add button</Text>
            </View>
          }
          renderItem={({item})=>(
            <BookItem
              book={item}
              onPress={()=>navigation.navigate('BookDetail',{ bookId:item.bookId })}
              onDelete={()=>handleDelete(item.bookId)}
              onEdit={()=>navigation.navigate('BookForm',{ bookId:item.bookId })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#0f0f23' },
  header:{ paddingHorizontal:24, paddingTop:60, paddingBottom:20, backgroundColor:'#1a1a2e', alignItems:'center' },
  headerTitle:{ fontSize:28, fontWeight:'800', color:'#fff' },

  actionRow:{ flexDirection:'row', alignItems:'center', paddingHorizontal:24, paddingVertical:16, gap:12 },

  searchIconButton:{ backgroundColor:'#2a2a40', padding:12, borderRadius:14 },

  sortButton:{ flexDirection:'row', alignItems:'center', backgroundColor:'#4c4c6a', paddingHorizontal:16, paddingVertical:12, borderRadius:14, gap:6 },
  sortButtonText:{ color:'#fff', fontWeight:'700', fontSize:14 },

  addButton:{ flexDirection:'row', alignItems:'center', backgroundColor:'#0f552d', paddingHorizontal:16, paddingVertical:12, borderRadius:14 },
  addButtonText:{ color:'#fff', fontWeight:'700', fontSize:14 },

  modalOverlay:{ flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center' },
  searchModal:{ flexDirection:'row', backgroundColor:'#1a1a2e', borderRadius:14, paddingHorizontal:12, alignItems:'center', width:'85%', height:50 },
  searchInputModal:{ flex:1, color:'#fff', fontSize:16, marginRight:8 },

  dropdownModal:{ backgroundColor:'#1a1a2e', borderRadius:14, width:'60%', paddingVertical:8 },
  dropdownItem:{ paddingVertical:12, paddingHorizontal:16 },
  dropdownItemText:{ color:'#fff', fontSize:16 },

  list:{ paddingHorizontal:24, paddingTop:8, paddingBottom:60, flexGrow:1 },

  loadingContainer:{ flex:1, justifyContent:'center', alignItems:'center' },
  loadingText:{ color:'#a0a0cc', fontSize:16 },

  emptyContainer:{ flex:1, justifyContent:'center', alignItems:'center', paddingTop:80 },
  emptyText:{ fontSize:20, fontWeight:'600', color:'#fff', marginBottom:8 },
  emptySubtext:{ fontSize:16, color:'#a0a0cc', textAlign:'center', lineHeight:24 },
});
