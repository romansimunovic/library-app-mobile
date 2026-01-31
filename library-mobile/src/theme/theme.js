import { StyleSheet } from 'react-native';

export const COLORS = {
  // Deep Madonna Blue (The background of the album cover)
  bg: '#1A5F7A',        
  // Card surfaces - slightly lighter blue or semi-transparent
  surface: 'rgba(255, 255, 255, 0.1)', 
  // Text needs to be white or very pale blue now
  text: '#FFFFFF',      
  muted: '#B0D8E8',     
  // The glowing "Ray" color
  ethereal: '#71B5D1', 
  danger: '#FF6B6B',
};

export const SPACING = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
};

export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 30, 
};

export const TYPOGRAPHY = {
  header: {
    fontWeight: '200',
  },
  ethereal: {
    letterSpacing: 2,
    textTransform: 'lowercase',
  }
};

export const SHADOW = {
  softGlow: {
    shadowColor: '#71B5D1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
};