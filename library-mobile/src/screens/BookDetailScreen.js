import { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { getBookById } from '../api/bookApi';

export default function BookDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [book, setBook] = useState(null);

  useEffect(() => {
    getBookById(id).then(setBook);
  }, []);

  if (!book) return null;

  return (
    <View style={{ padding: 16 }}>
      <Text>{book.title}</Text>
      <Text>{book.author}</Text>
      <Text>{book.isbn}</Text>
      <Text>{book.publishedYear}</Text>
      <Text>{book.available ? 'Dostupna' : 'Nedostupna'}</Text>

      <Button
        title="Uredi"
        onPress={() => navigation.navigate('BookForm', { book })}
      />
    </View>
  );
}
