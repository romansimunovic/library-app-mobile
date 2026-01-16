import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function BookItem({ book, onPress, onDelete }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <View>
        <Text style={styles.title}>{book.title}</Text>
        <Text>{book.author}</Text>
        <Text>{book.available ? 'Dostupna' : 'Nedostupna'}</Text>
      </View>
      <Text onPress={onDelete}>Obriši</Text>
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
  },
  title: { fontWeight: '600' },
});
