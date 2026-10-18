import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import GradientView from './GradientView';
import PokemonImage from './PokemonImage';
import TypeBadge from './TypeBadge';
import { colors, colorForType, darken } from '../theme';
import { formatName, formatNumber } from '../utils';

/** Card used in the Pokédex grid. */
function PokemonCard({ pokemon, width, onPress }) {
  const main = colorForType(pokemon.types[0]);
  return (
    <Pressable
      onPress={() => onPress(pokemon)}
      accessibilityRole="button"
      accessibilityLabel={`${formatName(pokemon.name)}, number ${pokemon.id}. Open details`}
      style={({ pressed }) => [{ width }, pressed && styles.pressed]}
    >
      <GradientView colors={['#07080b', '#0b0e14', darken(main, 0.45)]} style={styles.card}>
        <Text style={styles.number}>{formatNumber(pokemon.id)}</Text>
        <PokemonImage id={pokemon.id} style={styles.image} />
        <Text style={styles.name} numberOfLines={1}>
          • {formatName(pokemon.name)} •
        </Text>
        <View style={styles.types}>
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </View>
        <View style={styles.measures}>
          <View style={styles.measure}>
            <Text style={styles.value}>{pokemon.height} M</Text>
            <Text style={styles.label}>📏 Height</Text>
          </View>
          <View style={styles.measure}>
            <Text style={styles.value}>{pokemon.weight} KG</Text>
            <Text style={styles.label}>🏋️ Weight</Text>
          </View>
        </View>
        <View style={styles.button}>
          <Text style={styles.buttonText}>⚡ More details</Text>
        </View>
      </GradientView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
    alignItems: 'center',
  },
  number: {
    alignSelf: 'flex-end',
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    fontWeight: '700',
  },
  image: { width: 120, height: 110, marginTop: -4 },
  name: { color: '#fff', fontSize: 16, fontWeight: '800', marginTop: 6 },
  types: { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' },
  measures: { flexDirection: 'row', gap: 22, marginTop: 10 },
  measure: { alignItems: 'center' },
  value: { color: '#fff', fontSize: 14, fontWeight: '800' },
  label: { color: colors.textMuted, fontSize: 10, marginTop: 1 },
  button: {
    marginTop: 12,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(8,10,14,0.85)',
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});

export default React.memo(PokemonCard);
