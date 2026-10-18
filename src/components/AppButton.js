import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

/** variant: 'primary' (purple) | 'dark' | 'danger' */
export default function AppButton({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, disabled && styles.textDisabled, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  primary: { backgroundColor: colors.accent },
  dark: { backgroundColor: colors.buttonDark, borderColor: colors.border },
  danger: { backgroundColor: colors.dangerSoft, borderColor: colors.danger },
  disabled: { backgroundColor: '#1a1d24', borderColor: colors.border },
  pressed: { opacity: 0.8 },
  text: { color: '#fff', fontWeight: '800', fontSize: 15 },
  textDisabled: { color: '#6b7280' },
});
