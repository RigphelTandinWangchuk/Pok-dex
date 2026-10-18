import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TYPE_LIST, colorForType, colors, typeEmoji } from '../theme';

/** Row of round type icons: tap one to filter, tap again (or 🏠) to clear. */
export default function TypeFilterBar({ selected, onSelect }) {
  return (
    <View>
      <Text style={styles.caption}>
        📋 Search by type:{' '}
        <Text style={styles.selected}>{selected ? selected.toUpperCase() : 'ALL'}</Text>
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bar}
        keyboardShouldPersistTaps="handled"
      >
        <Chip
          label="All types"
          emoji="🏠"
          color="#2a2f3a"
          active={selected === null}
          onPress={() => onSelect(null)}
        />
        {TYPE_LIST.map((t) => (
          <Chip
            key={t}
            label={t}
            emoji={typeEmoji[t]}
            color={colorForType(t)}
            active={selected === t}
            onPress={() => onSelect(selected === t ? null : t)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function Chip({ label, emoji, color, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Filter by ${label}`}
      accessibilityState={{ selected: active }}
      style={[styles.chip, { backgroundColor: color }, active && styles.chipActive]}
    >
      <Text style={styles.chipEmoji}>{emoji}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  caption: { color: '#fff', fontWeight: '700', fontSize: 13, marginBottom: 8 },
  selected: { color: colors.textMuted, fontWeight: '800' },
  bar: {
    gap: 8,
    padding: 8,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chip: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  chipActive: { opacity: 1, borderColor: '#fff', transform: [{ scale: 1.08 }] },
  chipEmoji: { fontSize: 18 },
});
