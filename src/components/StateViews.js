import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AppButton from './AppButton';
import { colors } from '../theme';

export function LoadingView({ label = 'Loading…', color = colors.accent, style }) {
  return (
    <View style={[styles.center, style]} accessibilityLabel={label}>
      <ActivityIndicator size="large" color={color} />
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

export function ErrorView({ message, onRetry, style }) {
  return (
    <View style={[styles.center, style]}>
      <Text style={styles.icon}>📡</Text>
      <Text style={styles.title}>Oops! Something went wrong</Text>
      <Text style={styles.muted}>{message}</Text>
      <AppButton title="Retry" onPress={onRetry} style={styles.retry} />
    </View>
  );
}

export function EmptyView({ icon = '🔍', title, message, style }) {
  return (
    <View style={[styles.center, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.muted}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', padding: 28, gap: 8 },
  icon: { fontSize: 42 },
  title: { color: '#fff', fontSize: 18, fontWeight: '800', textAlign: 'center' },
  muted: { color: colors.textMuted, fontSize: 14, textAlign: 'center' },
  retry: { marginTop: 10, minWidth: 140 },
});
