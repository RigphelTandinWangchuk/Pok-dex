import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

/** One horizontal stat bar: label, number and a filled bar. */
export default function StatBar({ label, value, max = 255, color = colors.accent }) {
  const progress = useRef(new Animated.Value(0)).current;
  const ratio = Math.max(0, Math.min(1, value / max));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: ratio,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [ratio, progress]);

  return (
    <View style={styles.row} accessible accessibilityLabel={`${label} ${value}`}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  label: { width: 70, color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  value: { width: 44, color: '#fff', fontSize: 14, fontWeight: '800', textAlign: 'right', marginRight: 10 },
  track: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 5 },
});
