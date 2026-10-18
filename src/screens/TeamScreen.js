import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppButton from '../components/AppButton';
import PokemonImage from '../components/PokemonImage';
import ScreenHeader from '../components/ScreenHeader';
import StatBar from '../components/StatBar';
import TypeBadge from '../components/TypeBadge';
import { EmptyView, LoadingView } from '../components/StateViews';
import { MAX_TEAM_SIZE } from '../config';
import { useTeam } from '../context/TeamContext';
import { colorForType, colors, darken } from '../theme';
import { STAT_LABELS, STAT_ORDER, formatName, formatNumber } from '../utils';

export default function TeamScreen({ navigation }) {
  const { team, ready, isFull, removeFromTeam, combinedStats } = useTeam();
  const openDetail = (id) => navigation.navigate('Detail', { id });

  const counter = (
    <View style={[styles.counter, isFull && styles.counterFull]}>
      <Text style={styles.counterText}>
        {team.length}/{MAX_TEAM_SIZE}
      </Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScreenHeader title="My Team" right={counter} />

      {!ready ? (
        <LoadingView label="Loading your team…" />
      ) : team.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyView
            icon="🎒"
            title="Your team is empty"
            message="Open a Pokémon in the Pokédex and tap “Add to team”. You can pick up to 6."
          />
          <AppButton
            title="Browse the Pokédex"
            onPress={() => navigation.navigate('Pokédex')}
            style={{ marginHorizontal: 40 }}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Combined base stats</Text>
              <Text style={styles.panelTotal}>Total {combinedStats.total}</Text>
            </View>
            {STAT_ORDER.map((k) => (
              <StatBar
                key={k}
                label={STAT_LABELS[k]}
                value={combinedStats[k]}
                max={MAX_TEAM_SIZE * 180}
                color={colors.accent}
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Members</Text>
          {team.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => openDetail(m.id)}
              style={[styles.member, { borderLeftColor: colorForType(m.types[0]) }]}
              accessibilityRole="button"
              accessibilityLabel={`${formatName(m.name)}. Open details`}
            >
              <View style={[styles.thumb, { backgroundColor: darken(colorForType(m.types[0]), 0.55) }]}>
                <PokemonImage id={m.id} style={styles.thumbImg} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.memberNumber}>{formatNumber(m.id)}</Text>
                <Text style={styles.memberName}>{formatName(m.name)}</Text>
                <View style={styles.memberTypes}>
                  {m.types.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </View>
              </View>
              <Pressable
                onPress={() => removeFromTeam(m.id)}
                style={styles.remove}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${formatName(m.name)} from team`}
              >
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            </Pressable>
          ))}
          {isFull && <Text style={styles.fullNote}>Your team is full (6/6). Remove someone to add a new Pokémon.</Text>}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 30 },
  counter: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  counterFull: { backgroundColor: colors.success },
  counterText: { color: '#fff', fontWeight: '900', fontSize: 20 },
  panel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
  },
  panelHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  panelTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  panelTotal: { color: colors.textMuted, fontWeight: '800' },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 22, marginBottom: 10 },
  member: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 5,
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    gap: 12,
  },
  thumb: { width: 72, height: 72, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  thumbImg: { width: 64, height: 64 },
  memberNumber: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  memberName: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 6 },
  memberTypes: { flexDirection: 'row', gap: 6 },
  remove: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  removeText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  fullNote: { color: colors.textMuted, textAlign: 'center', marginTop: 8, fontSize: 13 },
});
