import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { artworkUrl } from '../api';

/**
 * Official artwork. `silhouette` paints it solid black (game screen).
 * Falls back to a "?" if the picture cannot be loaded.
 */
export default function PokemonImage({ id, style, silhouette = false }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <View style={[styles.fallback, style]}>
        <Text style={styles.fallbackText}>?</Text>
      </View>
    );
  }
  return (
    <Image
      source={{ uri: artworkUrl(id) }}
      style={[style, silhouette && styles.silhouette]}
      resizeMode="contain"
      onError={() => setFailed(true)}
      accessibilityIgnoresInvertColors
    />
  );
}

const styles = StyleSheet.create({
  silhouette: { tintColor: '#000000' },
  fallback: { alignItems: 'center', justifyContent: 'center' },
  fallbackText: { color: '#6b7280', fontSize: 40, fontWeight: '800' },
});
