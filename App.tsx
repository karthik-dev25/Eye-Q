// App.tsx
import * as React from 'react';
import AppNavigator from './src/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
        <AppNavigator />
    </PaperProvider>
  );
}
