import React from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TriviaScreen from '../screens/TriviaScreen';

export type RootStackParamList = {
  Trivia: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const triviaTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0B1020',
    card: '#0B1020',
    text: '#FFFFFF',
    border: '#222B46',
    primary: '#F59E0B',
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={triviaTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Trivia" component={TriviaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
