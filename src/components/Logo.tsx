import React, { useEffect, useRef } from 'react';
import { Image, Animated, StyleSheet } from 'react-native';

interface LogoProps {
  size?: number;
  animated?: boolean;
}

export const Logo = ({ size = 150, animated = true }: LogoProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(1);
      scaleAnim.setValue(1);
    }
  }, [animated]);

  return (
    <Animated.Image
      source={require('../../assets/logo.png')}
      style={[
        styles.logo,
        {
          width: size,
          height: size,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    // Style de base (width/height définis dynamiquement)
  },
});