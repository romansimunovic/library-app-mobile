// src/screens/BookHomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { getBooks } from '../api/api';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookHomeScreen({ navigation }) {
  const [stats, setStats] = useState({ total: 0, available: 0, latestYear: '-' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const books = await getBooks();
        const available = books.filter(b => b.available).length;
        const latestYear = books.length > 0 ? Math.max(...books.map(b => b.publishedYear || 0)) : '-';
        setStats({ total: books.length, available, latestYear });
      } catch (err) {
        console.log('Greška pri dohvaćanju statistike:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Biblioteka</Text>
          <Text style={styles.subtitle}>Pregledajte knjige, dodajte nove i pratite statistiku</Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('BookList')}
          >
            <Text style={styles.cardTitle}>Pregled knjiga</Text>
            <Text style={styles.cardSubtitle}>Svi naslovi i detalji</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('BookForm')}
          >
            <Text style={styles.cardTitle}>Dodaj novu knjigu</Text>
            <Text style={styles.cardSubtitle}>Unesite novu knjigu u sustav</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Statistika knjižnice</Text>
          {loading ? (
            <ActivityIndicator color="#ffffff" style={{ marginTop: 12 }} size="large" />
          ) : (
            <>
              <Text style={styles.statsText}>Ukupno knjiga: {stats.total}</Text>
              <Text style={styles.statsText}>Dostupno knjiga: {stats.available}</Text>
              <Text style={styles.statsText}>Najnovija godina izdanja: {stats.latestYear}</Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f0f23',
    paddingTop: Platform.OS === 'android' ? 24 : 0, // na Androidu dodajemo dodatni padding
  },
  container: {
    flexGrow: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16, // više prostora od status bara
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0cc',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    maxWidth: 300,
  },
  cardsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#1a1a2e',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#a0a0cc',
    textAlign: 'center',
  },
  statsCard: {
    width: '90%',
    backgroundColor: '#0a6734',
    padding: 24,
    borderRadius: 16,
    marginTop: 24,
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  statsText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
  },
});
