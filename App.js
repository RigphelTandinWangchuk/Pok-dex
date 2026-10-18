import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TeamProvider } from './src/context/TeamContext';
import AppNavigator from './src/navigation/AppNavigator';
import SplashOverlay from './src/components/SplashOverlay';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* The team lives in Context so every screen shares it */}
      <TeamProvider>
        <SplashOverlay>
          <AppNavigator />
        </SplashOverlay>
      </TeamProvider>
    </SafeAreaProvider>
  );
}
