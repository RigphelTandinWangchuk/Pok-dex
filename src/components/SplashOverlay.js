import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, StyleSheet, Text } from 'react-native';
import { STUDENT_NAME } from '../config';

const SHOW_MS = 2200; // how long the splash stays fully visible
const FADE_MS = 450;

/**
 * Custom start-up screen drawn inside the app, so it also shows in Expo Go
 * (Expo Go ignores the native splash settings in app.json).
 */
export default function SplashOverlay({ children }) {
  const [visible, setVisible] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }).start();
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_MS,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, SHOW_MS);
    return () => clearTimeout(timer);
  }, [opacity, scale]);

  return (
    <>
      {children}
      {visible && (
        <Animated.View style={[styles.overlay, { opacity }]} pointerEvents="auto">
          <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
            <Image
              source={require('../../assets/splash-icon.png')}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.title}>{STUDENT_NAME}'s Pokédex</Text>
            <ActivityIndicator color="#f2b800" style={{ marginTop: 16 }} />
          </Animated.View>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  image: { width: 240, height: 320 },
  title: { marginTop: 14, fontSize: 24, fontWeight: '900', color: '#16181d' },
});
