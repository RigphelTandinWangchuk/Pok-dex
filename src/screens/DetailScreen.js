import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchDescription, fetchPokemon } from '../api';
import AppButton from '../components/AppButton';
import GradientView from '../components/GradientView';
import PokemonImage from '../components/PokemonImage';
import StatBar from '../components/StatBar';
import TypeBadge from '../components/TypeBadge';
import { ErrorView, LoadingView } from '../components/StateViews';
import { MAX_TEAM_SIZE, STUDENT_NAME } from '../config';
import { useTeam } from '../context/TeamContext';
import { colorForType, colors, darken, lighten } from '../theme';
import { STAT_LABELS, STAT_ORDER, formatName, formatNumber } from '../utils';

export default function DetailScreen({ route, navigation }) {
  // The id arrives through route params (navigation.navigate('Detail', { id }))
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isInTeam, isFull, addToTeam, removeFromTeam } = useTeam();

  const [pokemon, setPokemon] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchPokemon(id);
      setPokemon(data);
      fetchDescription(data.id).then(setDescription).catch(() => {});
    } catch (e) {
      setError(e.message || 'Could not load this Pokémon.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const main = pokemon ? colorForType(pokemon.types[0]) : colors.accent;
  const inTeam = pokemon ? isInTeam(pokemon.id) : false;
  const total = pokemon ? STAT_ORDER.reduce((s, k) => s + pokemon.stats[k], 0) : 0;

  const back = (
    <Pressable
      onPress={() => navigation.goBack()}
      style={[styles.back, { top: insets.top + 10 }]}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Text style={styles.backText}>‹ Back</Text>
    </Pressable>
  );

  if (loading || error || !pokemon) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <StatusBar style="light" />
        {back}
        {loading ? (
          <LoadingView label="Loading details…" />
        ) : (
          <ErrorView message={error} onRetry={load} />
        )}
      </View>
    );
  }

  const teamButton = inTeam ? (
    <AppButton
      title="Remove from team"
      variant="danger"
      onPress={() => removeFromTeam(pokemon.id)}
    />
  ) : (
    <AppButton
      title={isFull ? `Team is full (${MAX_TEAM_SIZE}/${MAX_TEAM_SIZE})` : '＋  Add to team'}
      disabled={isFull}
      onPress={() => addToTeam(pokemon)}
    />
  );

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}>
        <GradientView
          colors={[lighten(main, 0.3), main, darken(main, 0.25)]}
          style={[styles.hero, { paddingTop: insets.top + 56 }]}
        >
          <Text style={styles.owner}>{STUDENT_NAME}'s Pokédex</Text>
          <Text style={styles.number}>{formatNumber(pokemon.id)}</Text>
          <PokemonImage
            id={pokemon.id}
            style={{ width: Math.min(width * 0.7, 300), height: Math.min(width * 0.7, 300) }}
          />
          <Text style={styles.name}>{formatName(pokemon.name)}</Text>
          <View style={styles.types}>
            {pokemon.types.map((t) => (
              <TypeBadge key={t} type={t} outlined />
            ))}
          </View>
        </GradientView>

        <View style={styles.body}>
          {description ? <Text style={styles.description}>{description}</Text> : null}

          <View style={styles.measures}>
            <View style={styles.measureBox}>
              <Text style={styles.measureValue}>{pokemon.height} m</Text>
              <Text style={styles.measureLabel}>📏 Height</Text>
            </View>
            <View style={styles.measureBox}>
              <Text style={styles.measureValue}>{pokemon.weight} kg</Text>
              <Text style={styles.measureLabel}>🏋️ Weight</Text>
            </View>
          </View>

          <View style={styles.statsHeader}>
            <Text style={styles.sectionTitle}>Base stats</Text>
            <Text style={styles.total}>Total {total}</Text>
          </View>
          {STAT_ORDER.map((k) => (
            <StatBar key={k} label={STAT_LABELS[k]} value={pokemon.stats[k]} color={main} />
          ))}

          <View style={styles.action}>{teamButton}</View>
        </View>
      </ScrollView>
      {back}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  centered: { justifyContent: 'center' },
  back: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  hero: {
    alignItems: 'center',
    paddingBottom: 26,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  owner: { color: 'rgba(255,255,255,0.8)', fontWeight: '700', fontSize: 12 },
  number: { color: 'rgba(255,255,255,0.85)', fontWeight: '800', fontSize: 15, marginTop: 4 },
  name: { color: '#fff', fontSize: 34, fontWeight: '900', marginTop: 4 },
  types: { flexDirection: 'row', gap: 8, marginTop: 10 },
  body: { padding: 20 },
  description: { color: colors.textMuted, fontSize: 14, lineHeight: 21, marginBottom: 18 },
  measures: { flexDirection: 'row', gap: 12, marginBottom: 22 },
  measureBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  measureValue: { color: '#fff', fontSize: 20, fontWeight: '900' },
  measureLabel: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  statsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  total: { color: colors.textMuted, fontWeight: '700' },
  action: { marginTop: 26 },
});
