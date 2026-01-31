import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { getBooks } from '../api/api';
import { COLORS, SPACING, SHADOW, TYPOGRAPHY, RADIUS } from '../theme/theme';

/**
 * Atmospheric Home Screen providing an overview of the archive stats
 * and an immersive entry point into the collection.
 */
export default function BookHomeScreen({ navigation }) {
  const [stats, setStats] = useState({ total: 0, available: 0, latestYear: 0 });
  const [loading, setLoading] = useState(true);

  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1.1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Fetch Statistics with Safety Checks
    getBooks().then(data => {
      const total = data.length;
      const available = data.filter(b => b.available).length;
      
      // Prevent -Infinity if data is empty
      const years = data.map(b => b.publishedYear).filter(y => y != null);
      const latestYear = years.length > 0 ? Math.max(...years) : 0;
      
      setStats({ total, available, latestYear });
      setLoading(false);

      // 2. Trigger Intro Sequence
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(slideUp, { toValue: 0, duration: 1000, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ]).start();
    }).catch(err => console.error("Home Stats Error:", err));

    // 3. Perpetual Button Pulse (Ethereal Breathing)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideUp }] }]}>
          <Text style={styles.kicker}>quicker than a ray of light.</Text>
          <Text style={styles.title}>your{"\n"}archive.</Text>
          
          <View style={[styles.imageContainer, SHADOW.softGlow]}>
            <Animated.Image
              source={require('../../assets/images/rayoflight.png')}
              style={[styles.cover, { transform: [{ scale: scaleAnim }] }]}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.statsRow, { opacity: fadeAnim, transform: [{ translateY: slideUp }] }]}>
          <StatBox label="manifested" value={loading ? '—' : stats.total} />
          <StatBox label="present" value={loading ? '—' : stats.available} isBordered />
          <StatBox label="latest" value={loading ? '—' : stats.latestYear} />
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: pulseAnim }, { translateY: slideUp }] }}>
          <TouchableOpacity 
            activeOpacity={0.8}
            style={[styles.mainAction, SHADOW.softGlow]} 
            onPress={() => navigation.navigate('BookList')}
          >
            <Text style={styles.actionText}>view your collection</Text>
            <Ionicons name="chevron-forward-outline" size={20} color={COLORS.bg} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.Text style={[styles.footerBranding, { opacity: fadeAnim }]}>
          v1.0. ethereal. dreaming.
        </Animated.Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const StatBox = ({ label, value, isBordered }) => (
  <View style={[styles.statBox, isBordered && styles.statBorder]}>
    <Text style={styles.statNum}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: SPACING.lg, paddingBottom: 60 },
  header: { marginBottom: 30 },
  kicker: { ...TYPOGRAPHY.ethereal, color: COLORS.ethereal, fontSize: 14, marginBottom: 8 },
  title: { fontSize: 64, fontWeight: '200', color: COLORS.text, lineHeight: 60, letterSpacing: -2 },
  imageContainer: { marginTop: 24, borderRadius: RADIUS.lg, overflow: 'hidden', height: 280, backgroundColor: '#000' },
  cover: { width: '100%', height: '100%', opacity: 0.8 },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26, 95, 122, 0.3)' },
  statsRow: { 
    flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    borderRadius: RADIUS.md, marginVertical: 30, padding: 20, 
    borderWidth: 1, borderColor: 'rgba(113, 181, 209, 0.1)' 
  },
  statBox: { flex: 1, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(113, 181, 209, 0.2)' },
  statNum: { fontSize: 24, fontWeight: '300', color: COLORS.text },
  statLabel: { ...TYPOGRAPHY.ethereal, fontSize: 9, color: COLORS.muted, marginTop: 4 },
  mainAction: { 
    backgroundColor: COLORS.ethereal, padding: 22, borderRadius: RADIUS.xl, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center' 
  },
  actionText: { color: COLORS.bg, fontSize: 16, fontWeight: '600', letterSpacing: 2, marginRight: 10 },
  footerBranding: { marginTop: 40, textAlign: 'center', ...TYPOGRAPHY.ethereal, color: COLORS.muted, fontSize: 10, opacity: 0.5 }
});