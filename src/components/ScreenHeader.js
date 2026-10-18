import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientView from './GradientView';
import { STUDENT_NAME } from '../config';
import { colors } from '../theme';

/** Header for My Team / Game: shows the student's name on every screen. */
export default function ScreenHeader({ title, right }) {
  const insets = useSafeAreaInsets();
  return (
    <GradientView
      colors={['#3a1160', colors.accentDark, '#1a0a2b']}
      style={[styles.header, { paddingTop: insets.top + 12 }]}
    >
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.owner}>{STUDENT_NAME}'s Pokédex</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        {right}
      </View>
    </GradientView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 18,
    paddingBottom: 16,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  owner: { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '700' },
  title: { color: '#fff', fontSize: 26, fontWeight: '900', marginTop: 2 },
});
