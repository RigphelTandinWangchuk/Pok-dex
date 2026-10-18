import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { mix } from '../theme';

/**
 * Vertical gradient built only from React Native Views (thin coloured
 * strips), so no extra library is needed.
 * colors: 2+ hex colours, top -> bottom.
 */
export default function GradientView({ colors, steps = 48, style, children }) {
  const strips = useMemo(() => {
    const segments = colors.length - 1;
    return Array.from({ length: steps }, (_, i) => {
      const t = (i + 0.5) / steps;
      const pos = Math.min(t * segments, segments - 1e-6);
      const seg = Math.floor(pos);
      return mix(colors[seg], colors[seg + 1], pos - seg);
    });
  }, [colors.join(','), steps]);

  return (
    <View style={[styles.container, style]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {strips.map((c, i) => (
          <View key={i} style={{ flex: 1, backgroundColor: c }} />
        ))}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
});
