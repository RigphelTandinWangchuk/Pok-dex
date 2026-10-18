import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { artworkUrl, fetchGameNames } from '../api';
import AppButton from '../components/AppButton';
import PokemonImage from '../components/PokemonImage';
import ScreenHeader from '../components/ScreenHeader';
import { ErrorView, LoadingView } from '../components/StateViews';
import { GAME_POOL } from '../config';
import { colors } from '../theme';
import { formatName, randomInt, shuffle } from '../utils';

const BEST_KEY = 'pokedex-02240167:bestStreak';

export default function GameScreen() {
  const [round, setRound] = useState(null); // { answer, options }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [picked, setPicked] = useState(null); // id of the chosen option
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const lastId = useRef(null);

  // best streak survives closing the app
  useEffect(() => {
    AsyncStorage.getItem(BEST_KEY)
      .then((v) => {
        const n = parseInt(v, 10);
        if (!Number.isNaN(n)) setBest((b) => Math.max(b, n));
      })
      .catch(() => {});
  }, []);

  const newRound = useCallback(async () => {
    setLoading(true);
    setError('');
    setPicked(null);
    try {
      const pool = await fetchGameNames(); // first 151 only
      // random Pokémon from the first 151 (never the same one twice in a row)
      let answer;
      do {
        answer = pool[randomInt(0, GAME_POOL - 1)];
      } while (answer.id === lastId.current);
      lastId.current = answer.id;

      // 3 different wrong answers
      const wrong = shuffle(pool.filter((p) => p.id !== answer.id)).slice(0, 3);
      const options = shuffle([answer, ...wrong]); // random order

      // load the picture first so the silhouette is ready when the round shows
      await Image.prefetch(artworkUrl(answer.id)).catch(() => {});
      setRound({ answer, options });
    } catch (e) {
      setError(e.message || 'Could not start a round.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    newRound();
  }, [newRound]);

  const answered = picked !== null;

  const choose = (option) => {
    if (answered || !round) return;
    setPicked(option.id);
    if (option.id === round.answer.id) {
      const nextStreak = streak + 1;
      setScore((s) => s + 1);
      setStreak(nextStreak);
      if (nextStreak > best) {
        setBest(nextStreak);
        AsyncStorage.setItem(BEST_KEY, String(nextStreak)).catch(() => {});
      }
    } else {
      setStreak(0);
    }
  };

  const optionStyle = (option) => {
    if (!answered) return null;
    if (option.id === round.answer.id) return styles.correct; // right answer: green
    if (option.id === picked) return styles.wrong; // wrong choice: red
    return styles.dimmed;
  };

  const correct = answered && round && picked === round.answer.id;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScreenHeader title="Who's that Pokémon?" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.scoreRow}>
          <Stat label="Score" value={score} />
          <Stat label="Streak" value={streak} />
          <Stat label="Best" value={best} />
        </View>

        {loading ? (
          <LoadingView label="Finding a Pokémon…" />
        ) : error || !round ? (
          <ErrorView message={error} onRetry={newRound} />
        ) : (
          <>
            <View style={styles.stage}>
              <View style={styles.glow} />
              <PokemonImage id={round.answer.id} style={styles.image} silhouette={!answered} />
            </View>

            <Text
              style={[styles.feedback, answered && (correct ? styles.good : styles.bad)]}
              accessibilityLiveRegion="polite"
            >
              {!answered
                ? 'Choose the right name'
                : correct
                ? `Correct! It's ${formatName(round.answer.name)}!`
                : `Not quite. It's ${formatName(round.answer.name)}.`}
            </Text>

            <View style={styles.options}>
              {round.options.map((o) => (
                <Pressable
                  key={o.id}
                  disabled={answered}
                  onPress={() => choose(o)}
                  accessibilityRole="button"
                  accessibilityLabel={formatName(o.name)}
                  style={({ pressed }) => [
                    styles.option,
                    optionStyle(o),
                    pressed && !answered && { opacity: 0.8 },
                  ]}
                >
                  <Text style={styles.optionText}>{formatName(o.name)}</Text>
                </Pressable>
              ))}
            </View>

            <AppButton
              title="Next  ›"
              onPress={newRound}
              disabled={!answered}
              style={styles.next}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 30 },
  scoreRow: { flexDirection: 'row', gap: 10 },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  statValue: { color: '#fff', fontSize: 22, fontWeight: '900' },
  statLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  stage: {
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  glow: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: '#2b1646',
  },
  image: { width: 240, height: 240 },
  feedback: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
  },
  good: { color: '#5bd68a' },
  bad: { color: '#ff7b7b' },
  options: { gap: 10 },
  option: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  optionText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  correct: { backgroundColor: colors.successSoft, borderColor: colors.success },
  wrong: { backgroundColor: colors.dangerSoft, borderColor: colors.danger },
  dimmed: { opacity: 0.45 },
  next: { marginTop: 16 },
});
