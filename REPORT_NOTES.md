# Lab report notes (paste into the VLE report format)

## How it works

**Infinite scroll.** `usePokedexList` asks PokeAPI for `pokemon?offset=167&limit=20`. The FlatList's `onEndReached`
calls `loadMore`, which requests the next 20 using the stored offset. Each page is merged by id with a `Set`, so no
Pokémon appears twice. A `busy` flag stops two pages being fetched at once, and the list stops when the offset reaches 1025.

**Search.** The first search downloads all 1025 names once (`pokemon?limit=1025`) and caches them. The text box value is
passed through `useDebounce` (450 ms), so the search only runs after the user stops typing. Matching names are shown
20 at a time (same infinite scroll). If nothing matches, a "No Pokémon found" message is shown. Every new search gets a
request id, so a slow old response can never overwrite a newer one.

**Team storage.** `TeamContext` holds the team array (max 6, no duplicates) and gives `addToTeam`, `removeFromTeam`,
`isInTeam`, `isFull` and `combinedStats` to all screens. On start it reads the team from AsyncStorage; after that, every
change is written back. The save effect waits for the first load to finish so an empty list never overwrites the saved team.

**Game.** A random id from the first 151 is chosen (never the same twice in a row) plus 3 different wrong names; the
four options are shuffled. The artwork is drawn with `tintColor: '#000'` to make a silhouette. After an answer the
tint is removed, the correct button turns green and a wrong choice turns red. Score, streak and best streak are
kept in state; the best streak is also saved in AsyncStorage.

**Own feature: filter by type.** The round type icons call `type/{name}`, keep only Pokémon up to #1025, and feed the
same infinite-scroll list. It can be combined with the search box.

## Errors faced and fixes

> Keep the ones you really met while building and testing on your phone, and add your own if different — the report must be honest about what happened to you.

1. **Saved team was wiped on start.** The "save" effect ran once with the initial empty array before the stored team
   had loaded. Fix: a `ready` flag so saving only starts after the first read finishes.
2. **Old search results replaced new ones.** A slow request for "ch" could finish after the request for "char".
   Fix: a `requestId` counter; responses whose id is no longer current are ignored.
3. **Duplicate Pokémon / keys warning when scrolling quickly.** `onEndReached` fired twice and the same page was added
   twice. Fix: a `busy` ref guard plus merging by id with a `Set`.
4. **`npx expo install` could not fetch version info.** Fix: installed the exact versions listed in
   `expo/bundledNativeModules.json` so every package matches the Expo SDK.
5. **Long names such as "Charmander" wrapped in the hero banner.** Fix: single line + `adjustsFontSizeToFit`.

## GitHub
Repository name: `pokedex-02240167` — add the URL here: ______________________
