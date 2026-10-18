import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colorForType, typeEmoji } from '../theme';

export default function TypeBadge({ type, size = 'md', outlined = false }) {
  const small = size === 'sm';
  return (
    <View
      style={[
        styles.badge,
        small && styles.badgeSm,
        outlined && styles.outlined,
        { backgroundColor: colorForType(type) },
      ]}
    >
      <Text style={[styles.emoji, small && styles.emojiSm]}>{typeEmoji[type]}</Text>
      <Text style={[styles.text, small && styles.textSm]}>{type.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 5,
  },
  badgeSm: { paddingHorizontal: 8, paddingVertical: 3, gap: 4 },
  outlined: { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.75)' },
  emoji: { fontSize: 12 },
  emojiSm: { fontSize: 10 },
  text: { color: '#fff', fontWeight: '800', fontSize: 12, letterSpacing: 0.4 },
  textSm: { fontSize: 10 },
});
