import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PokedexScreen from '../screens/PokedexScreen';
import TeamScreen from '../screens/TeamScreen';
import GameScreen from '../screens/GameScreen';
import DetailScreen from '../screens/DetailScreen';
import { useTeam } from '../context/TeamContext';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: '#0a0b0f',
    border: colors.border,
    primary: '#c27bff',
  },
};

const tabIcon = (emoji) => ({ focused }) => (
  <Text style={[styles.icon, { opacity: focused ? 1 : 0.5 }]}>{emoji}</Text>
);

function Tabs() {
  const { team } = useTeam();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#c27bff',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: { backgroundColor: '#0a0b0f', borderTopColor: colors.border },
        tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
      }}
    >
      <Tab.Screen name="Pokédex" component={PokedexScreen} options={{ tabBarIcon: tabIcon('📖') }} />
      <Tab.Screen
        name="My Team"
        component={TeamScreen}
        options={{
          tabBarIcon: tabIcon('🎒'),
          tabBarBadge: team.length > 0 ? team.length : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.accent, color: '#fff' },
        }}
      />
      <Tab.Screen name="Game" component={GameScreen} options={{ tabBarIcon: tabIcon('🎮') }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      {/* The Detail screen opens ON TOP of the tabs (stack navigation) */}
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  icon: { fontSize: 20 },
});
