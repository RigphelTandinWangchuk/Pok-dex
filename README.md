# Pokédex App — Lab Work #9 (React Native / Expo)

Cross-Platform Mobile Application Development · Unit IV · College of Science and Technology, RUB

A Pokédex built with **Expo + React Navigation** that loads live data from
[PokeAPI](https://pokeapi.co/docs/v2). The UI follows the supplied design: dark theme, a type-coloured hero banner,
a round type-filter row, a search box and gradient Pokémon cards.

## 1. Before you run it — personalise (30 seconds)

Open `src/config.js` and change one line:

```js
export const STUDENT_NAME = 'Your Name';   // e.g. 'Pema'  ->  "Pema's Pokédex"
```

The student number is already set to `02240167`, so the list starts at **offset 167** (first Pokémon shown: #168).

## 2. Run on your phone

```bash
npm install
npx expo start
```

Install **Expo Go** on your phone, scan the QR code (phone and computer on the same Wi-Fi).

## 3. Features (all lab requirements)

| Requirement | Where |
|---|---|
| 3 bottom tabs (Pokédex, My Team, Game) + Detail screen on a native stack | `src/navigation/AppNavigator.js` |
| FlatList, 20 at a time, infinite scroll, no duplicates | `src/screens/PokedexScreen.js`, `src/hooks/usePokedexList.js` |
| Loading indicator, error message + **Retry** | `src/components/StateViews.js` |
| Search across **all** Pokémon, debounced (450 ms), "nothing found" message | `src/hooks/useDebounce.js`, `usePokedexList.js` |
| Detail via route params: artwork, name, types, height (m), weight (kg), 6 stat bars, add/remove | `src/screens/DetailScreen.js` |
| Team ≤ 6, no duplicates, button disabled when full, count (4/6), combined stats, remove | `src/screens/TeamScreen.js` |
| Team shared with Context and saved with AsyncStorage | `src/context/TeamContext.js` |
| Game: silhouette, 4 shuffled answers, green/red reveal, score, streak, best streak, Next | `src/screens/GameScreen.js` |
| API calls in a separate file | `src/api.js` |
| Reusable components with props | `src/components/*` (PokemonCard, StatBar, TypeBadge, …) |
| No UI component libraries | only React Native core + React Navigation + AsyncStorage |
| **Own feature: filter by type** | `src/components/TypeFilterBar.js` |

## 4. Still to do for submission (cannot be done for you)

1. Put your name in `src/config.js`, run on your phone and take the screenshots (every screen, error state, search results, 6/6 team, game after an answer).
2. Record the ≤ 3-minute screen recording (close and reopen the app to show the saved team).
3. Create the public GitHub repo `pokedex-02240167` and push this folder.
4. Write the lab report in the VLE format — `REPORT_NOTES.md` has the explanations ready to paste.
