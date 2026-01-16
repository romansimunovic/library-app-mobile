// BookHomeScreen.js - Modernizirani stilovi
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function BookHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Library</Text>
        <Text style={styles.subtitle}>Upravljajte svojom knjižnicom</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Books')}
        >
          <Text style={styles.actionButtonText}>Počnite</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: '#a0a0cc',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 26,
  },
  actionButton: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 20,
    paddingHorizontal: 48,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});
