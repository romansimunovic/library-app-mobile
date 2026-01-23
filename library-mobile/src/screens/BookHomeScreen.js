import React, { useEffect, useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Platform, Animated 
} from 'react-native';
import { getBooks } from '../api/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function BookHomeScreen({ navigation }) {
  const [stats, setStats] = useState({ total: 0, available: 0, latestYear: '-' });
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const books = await getBooks();
        const available = books.filter(b => b.available).length;
        const latestYear = books.length > 0 ? Math.max(...books.map(b => b.publishedYear || 0)) : '-';
        setStats({ total: books.length, available, latestYear });

        // Fade in statistika
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }).start();
      } catch (err) {
        console.log('Greška pri dohvaćanju statistike:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const renderCard = (icon, title, subtitle, onPress, color='#1a1a2e') => {
    const scaleAnim = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
    };
    const onPressOut = () => {
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
    };

    return (
      <AnimatedTouchable
        style={[styles.card, { backgroundColor: color, transform: [{ scale: scaleAnim }] }]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          {icon}
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
          </View>
        </View>
      </AnimatedTouchable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Biblioteka</Text>
          <Text style={styles.subtitle}>Pregledajte knjige, dodajte nove i pratite statistiku</Text>
        </View>

        <View style={styles.cardsContainer}>
          {renderCard(
            <Ionicons name="book" size={36} color="#fff" />,
            'Pregled knjiga',
            'Svi naslovi i detalji',
            () => navigation.navigate('BookList')
          )}
          {renderCard(
            <MaterialIcons name="library-add" size={36} color="#fff" />,
            'Dodaj novu knjigu',
            'Unesite novu knjigu u sustav',
            () => navigation.navigate('BookForm'),
            '#2b2b5a'
          )}
        </View>

        <Animated.View style={[styles.statsCard, { opacity: fadeAnim }]}>
          <Text style={styles.statsTitle}>Statistika knjižnice</Text>
          {loading ? (
            <ActivityIndicator color="#ffffff" style={{ marginTop: 12 }} size="large" />
          ) : (
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.total}</Text>
                <Text style={styles.statLabel}>Ukupno knjiga</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.available}</Text>
                <Text style={styles.statLabel}>Dostupne knjige</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.latestYear}</Text>
                <Text style={styles.statLabel}>Najnovije izdanje</Text>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f0f23', paddingTop: Platform.OS === 'android' ? 24 : 0 },
  container: { flexGrow: 1, padding: 24, alignItems: 'center', justifyContent: 'flex-start' },

  header: { alignItems: 'center', marginBottom: 32, marginTop: 16 },
  title: { fontSize: 36, fontWeight: '900', color: '#fff', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#a0a0cc', textAlign: 'center', marginTop: 8, lineHeight: 22, maxWidth: 320 },

  cardsContainer: { width: '100%', alignItems: 'center', gap: 16 },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#d0d0f0' },

  statsCard: {
    width: '95%',
    backgroundColor: '#0a6734',
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  statsTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 20 },

  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  statItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  statNumber: { fontSize: 30, fontWeight: '500', color: '#fff', textAlign: 'center' },
  statLabel: { fontSize: 16, fontWeight: '500', color: '#e6e6e6', marginTop: 4, textAlign: 'center' },
});
