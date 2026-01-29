import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getBooks } from '../api/api';
import { COLORS, SPACING, SHADOW, TYPOGRAPHY } from '../theme/theme';

export default function BookHomeScreen({ navigation }) {
  const [stats, setStats] = useState({ total: 0, available: 0, latestYear: '-' });
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const books = await getBooks();
        const available = books.filter(b => b.available).length;
        const latestYear = books.length > 0 
          ? Math.max(...books.map(b => b.publishedYear || 0)) 
          : '-';

        setStats({ total: books.length, available, latestYear });

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const ActionCard = ({ title, subtitle, onPress, isSecondary }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.actionCard, 
        isSecondary ? styles.actionCardSecondary : styles.actionCardPrimary
      ]}
      onPress={onPress}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.actionTitle, { color: isSecondary ? COLORS.text : '#000' }]}>
          {title.toUpperCase()}.
        </Text>
        <Text style={[styles.actionSubtitle, { color: isSecondary ? COLORS.muted : '#333' }]}>
          {subtitle.toUpperCase()}
        </Text>
      </View>
      <Ionicons 
        name="arrow-forward-sharp" 
        size={24} 
        color={isSecondary ? COLORS.brat : '#000'} 
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* BIG ENERGY HEADER */}
        <View style={styles.header}>
          <Text style={styles.kicker}>THE ARCHIVE.</Text>
          <Text style={styles.title}>LIBRARY.{"\n"}CONTROL.</Text>
          
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/images/brat.png')}
              style={styles.cover}
              resizeMode="cover"
            />
            <View style={styles.imageGlitch} />
          </View>
        </View>

        {/* STATS STRIP */}
        <Animated.View style={[styles.statsRow, { opacity: fadeAnim }]}>
          {loading ? (
            <ActivityIndicator color={COLORS.brat} />
          ) : (
            <>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{stats.total}</Text>
                <Text style={styles.statLabel}>TOTAL.</Text>
              </View>
              <View style={[styles.statBox, styles.statBoxCenter]}>
                <Text style={styles.statNum}>{stats.available}</Text>
                <Text style={styles.statLabel}>READY.</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{stats.latestYear}</Text>
                <Text style={styles.statLabel}>NEWEST.</Text>
              </View>
            </>
          )}
        </Animated.View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <ActionCard
            title="Browse Books"
            subtitle="View full inventory"
            onPress={() => navigation.navigate('BookList')}
          />
          <ActionCard
            title="Add New Entry"
            subtitle="Update the library"
            onPress={() => navigation.navigate('BookForm')}
            isSecondary
          />
        </View>

        <Text style={styles.footerBranding}>SO. BRAT. V1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: SPACING.lg, paddingBottom: 40 },
  header: { marginBottom: 30, marginTop: 20 },
  kicker: { ...TYPOGRAPHY.glitch, color: COLORS.brat, letterSpacing: 4, fontSize: 14 },
  title: { fontSize: 56, fontWeight: '900', color: COLORS.text, lineHeight: 52, letterSpacing: -3 },
  imageContainer: { marginTop: 20, position: 'relative' },
  cover: { width: '100%', height: 200, borderWidth: 3, borderColor: COLORS.brat, ...SHADOW.brat },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.surface, borderWidth: 2, borderColor: '#222', marginTop: 30 },
  statBox: { flex: 1, padding: 15, alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '900', color: COLORS.brat },
  statLabel: { fontSize: 10, fontWeight: '800', color: COLORS.muted },
  actions: { gap: 15, marginTop: 20 },
  actionCard: { padding: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 3, borderColor: '#000' },
  actionCardPrimary: { backgroundColor: COLORS.brat, ...SHADOW.brat },
  actionTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -1 },
});