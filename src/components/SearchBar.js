import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme';

export default function SearchBar({ value, onChangeText, onSubmit }) {
  return (
    <View>
      <Text style={styles.caption}>🔍 Find your Pokémon:</Text>
      <View style={styles.row}>
        <View style={styles.inputWrap}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
            placeholder="Name or number, e.g. char"
            placeholderTextColor="#667085"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search all Pokémon"
          />
          {value.length > 0 && (
            <Pressable
              onPress={() => onChangeText('')}
              hitSlop={10}
              accessibilityLabel="Clear search"
            >
              <Text style={styles.clear}>✕</Text>
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={onSubmit}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
          accessibilityRole="button"
          accessibilityLabel="Search"
        >
          <Text style={styles.buttonText}>🔍</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  caption: { color: '#fff', fontWeight: '700', fontSize: 13, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'stretch' },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    paddingHorizontal: 12,
  },
  input: { flex: 1, color: '#fff', fontSize: 15, paddingVertical: 12 },
  clear: { color: colors.textMuted, fontSize: 16, paddingLeft: 8 },
  button: {
    width: 52,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  buttonText: { fontSize: 18 },
});
