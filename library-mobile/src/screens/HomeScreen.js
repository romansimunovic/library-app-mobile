import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Library App</Text>
      <Text style={styles.subtitle}>
        Pregled, dodavanje i upravljanje knjigama
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '600' },
  subtitle: { marginTop: 8, color: '#555' },
});
