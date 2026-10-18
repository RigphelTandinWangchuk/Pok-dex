import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import PokemonCard from '../components/PokemonCard';
import FeaturedHero from '../components/FeaturedHero';
import SearchBar from '../components/SearchBar';
import TypeFilterBar from '../components/TypeFilterBar';
import AppButton from '../components/AppButton';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import useDebounce from '../hooks/useDebounce';
import usePokedexList from '../hooks/usePokedexList';
import { colors } from '../theme';
import { formatName } from '../utils';

const H_PADDING = 16;
const GAP = 12;

export default function PokedexScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - H_PADDING * 2 - GAP) / 2;

  const [text, setText] = useState('');
  const [type, setType] = useState(null);
  // Debounce: the search only runs after the user stops typing for 450 ms
  const [query, flushQuery] = useDebounce(text, 450);

  const list = usePokedexList(query, type);

  // The hero shows the first Pokémon of the list (keeps the last one while loading)
  const [featured, setFeatured] = useState(null);
  const first = list.items[0] || null;
  useEffect(() => {
    if (first) setFeatured(first);
  }, [first && first.id]);

  const openDetail = useCallback(
    (pokemon) => navigation.navigate('Detail', { id: pokemon.id }),
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }) => <PokemonCard pokemon={item} width={cardWidth} onPress={openDetail} />,
    [cardWidth, openDetail]
  );

  const header = (
    <View>
      <FeaturedHero pokemon={featured} onPress={openDetail} />
      <View style={styles.controls}>
        <TypeFilterBar selected={type} onSelect={setType} />
        <SearchBar value={text} onChangeText={setText} onSubmit={flushQuery} />
      </View>
    </View>
  );

  let emptyComponent = null;
  if (list.status === 'loading') {
    emptyComponent = <LoadingView label="Loading Pokémon…" />;
  } else if (list.status === 'error') {
    emptyComponent = <ErrorView message={list.error} onRetry={list.retry} />;
  } else if (list.items.length === 0) {
    emptyComponent = (
      <EmptyView
        title="No Pokémon found"
        message={
          query.trim()
            ? `Nothing matches “${query.trim()}”${type ? ` among ${formatName(type)} types` : ''}.`
            : 'Try another type.'
        }
      />
    );
  }

  let footer = null;
  if (list.loadingMore) {
    footer = <ActivityIndicator style={styles.footer} color={colors.accent} />;
  } else if (list.moreError) {
    footer = (
      <View style={styles.footer}>
        <Text style={styles.footerText}>Couldn't load more Pokémon.</Text>
        <AppButton title="Retry" onPress={list.loadMore} style={{ marginTop: 8, minWidth: 120 }} />
      </View>
    );
  } else if (list.status === 'ready' && !list.hasMore && list.items.length > 0) {
    footer = <Text style={[styles.footer, styles.footerText]}>— You reached the end —</Text>;
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <FlatList
        data={list.status === 'ready' ? list.items : []}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.column}
        ListHeaderComponent={header}
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={footer}
        onEndReached={list.loadMore}
        onEndReachedThreshold={0.6}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={6}
        windowSize={7}
        contentContainerStyle={styles.content}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 24 },
  controls: { paddingHorizontal: H_PADDING, gap: 18, marginTop: 4, marginBottom: 22 },
  column: { paddingHorizontal: H_PADDING, gap: GAP, marginBottom: GAP + 6 },
  footer: { paddingVertical: 20, alignItems: 'center' },
  footerText: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
});
