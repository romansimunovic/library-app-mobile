import React, { useEffect, useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Platform, Animated 
} from 'react-native';
import { getBooks } from '../api/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

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

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }).start();
      } catch (err) {
        console.log('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const renderCard = (icon, title, subtitle, onPress, color='#1a1a2e') => {
    const scaleAnim = new Animated.Value(1);

    return (
      <AnimatedTouchable
        style={[styles.card, { backgroundColor: color, transform: [{ scale: scaleAnim }] }]}
        onPress={onPress}
        onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start()}
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

  const renderStatTile = (icon, value, label, color) => (
    <Animated.View style={[styles.statTile, { backgroundColor: color, opacity: fadeAnim }]}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Library App!</Text>
          <Text style={styles.subtitle}>Browse books, add new ones, and track key stats</Text>
        </View>

        {/* Action Cards */}
        <View style={styles.cardsContainer}>
          {renderCard(
            <Ionicons name="book" size={36} color="#fff" />,
            'View Books',
            'See all titles and details',
            () => navigation.navigate('BookList')
          )}
          {renderCard(
            <MaterialIcons name="library-add" size={36} color="#fff" />,
            'Add New Book',
            'Enter a new book',
            () => navigation.navigate('BookForm'),
            '#2b2b5a'
          )}
        </View>

        {/* Statistics Tiles */}
        <View style={styles.statsContainer}>
          {loading ? (
            <ActivityIndicator color="#ffffff" size="large" style={{ marginTop: 12 }} />
          ) : (
            <>
              {renderStatTile(
                <FontAwesome5 name="book" size={28} color="#fff" />,
                stats.total,
                'Total Books',
                '#216e44'
              )}
              {renderStatTile(
                <Ionicons name="checkmark-circle" size={28} color="#fff" />,
                stats.available,
                'Available',
                '#2d2d58'
              )}
              {renderStatTile(
                <MaterialIcons name="update" size={28} color="#fff" />,
                stats.latestYear,
                'Latest Year',
                '#8a1a1a'
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f0f23', paddingTop: Platform.OS === 'android' ? 24 : 0 },
  container: { flexGrow: 1, padding: 24, alignItems: 'center', justifyContent: 'flex-start' },

  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '900', color: '#fff', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#a0a0cc', textAlign: 'center', marginTop: 6, maxWidth: 320 },

  cardsContainer: { width: '100%', alignItems: 'center', gap: 16, marginBottom: 32 },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#d0d0f0' },

  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  statTile: { 
    flex: 1, 
    marginHorizontal: 6, 
    borderRadius: 16, 
    paddingVertical: 20, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width:0, height:5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statValue: { fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 6 },
  statLabel: { fontSize: 14, color: '#e6e6e6', marginTop: 4, textAlign: 'center' },
});
