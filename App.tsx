/* eslint-disable react/no-unstable-nested-components */
// App.tsx
import * as React from 'react';
import AppNavigator from './src/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function App() {
  return (
    <PaperProvider 
    settings={{
        icon: (props) => <MaterialCommunityIcons {...props} />,
      }}
    >
        <AppNavigator />
    </PaperProvider>
  );
}
