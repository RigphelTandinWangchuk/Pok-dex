import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientView from './GradientView';
import PokemonImage from './PokemonImage';
import TypeBadge from './TypeBadge';
import AppButton from './AppButton';
import { fetchDescription } from '../api';
import { STUDENT_NAME } from '../config';
import { colorForType, darken, lighten } from '../theme';
import { formatName, formatNumber } from '../utils';

const CURVE_RADIUS = 450;

/**
 * Big green (type coloured) banner at the top of the Pokédex,
 * like the design: title, featured Pokémon, description, button.
 */
export default function FeaturedHero({ pokemon, onPress }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!pokemon) return undefined;
    let alive = true;
    setDescription('');
    fetchDescription(pokemon.id)
      .then((t) => alive && setDescription(t))
      .catch(() => alive && setDescription(''));
    return () => {
      alive = false;
    };
  }, [pokemon && pokemon.id]);

  const base = pokemon ? colorForType(pokemon.types[0]) : '#7c4dff';
  const top = lighten(base, 0.35);
  const bottom = darken(base, 0.1);
  const imageSize = Math.min(width * 0.5, 260);

  return (
    <View style={styles.wrapper}>
      {/* oversized rounded box gives the curved bottom edge of the design */}
      <GradientView
        colors={[top, base, bottom]}
        steps={96}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: CURVE_RADIUS * 2,
          left: (width - CURVE_RADIUS * 2) / 2,
          borderBottomLeftRadius: CURVE_RADIUS,
          borderBottomRightRadius: CURVE_RADIUS,
        }}
      />
      <View style={[styles.ring, { borderColor: 'rgba(255,255,255,0.10)' }]} pointerEvents="none" />

      <View style={[styles.content, { paddingTop: insets.top + 14 }]}>
        <Text style={styles.brand}>Pokédex</Text>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          {STUDENT_NAME}'s Pokédex
        </Text>

        {pokemon ? (
          <>
            <View style={styles.row}>
              <View style={styles.left}>
                <Text style={styles.number}>{formatNumber(pokemon.id)}</Text>
                <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
                  {formatName(pokemon.name)}
                </Text>
                <View style={styles.types}>
                  {pokemon.types.map((t) => (
                    <TypeBadge key={t} type={t} outlined />
                  ))}
                </View>
              </View>
              <PokemonImage
                id={pokemon.id}
                style={{ width: imageSize, height: imageSize, marginRight: -12 }}
              />
            </View>
            <Text style={styles.description} numberOfLines={5}>
              {description || 'Loading description…'}
            </Text>
            <AppButton
              title="⚡  More details"
              variant="dark"
              onPress={() => onPress(pokemon)}
              style={styles.button}
            />
          </>
        ) : (
          <Text style={styles.description}>Loading featured Pokémon…</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { minHeight: 440, paddingBottom: 50 },
  ring: {
    position: 'absolute',
    left: -110,
    top: 120,
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 34,
  },
  content: { paddingHorizontal: 20 },
  brand: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 6,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  title: { color: '#fff', fontSize: 30, fontWeight: '900', marginTop: 14 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  left: { flex: 1, paddingRight: 4 },
  number: { color: 'rgba(255,255,255,0.8)', fontWeight: '800', fontSize: 14 },
  name: { color: '#fff', fontSize: 26, fontWeight: '900', marginBottom: 8 },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  description: { color: '#fff', fontSize: 13, lineHeight: 19, marginTop: 6 },
  button: { marginTop: 16 },
});
