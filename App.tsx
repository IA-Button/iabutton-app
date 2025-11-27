import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './src/navigation/types';

import SignInScreen from './src/screens/SignIn/SignInScreen';
import SignUpScreen from './src/screens/SignUp/SignUpScreen';
import GeneratedFilesScreen from './src/screens/GeneratedFiles/GeneratedFilesScreen';
import ChatScreen from './src/screens/Chat/ChatScreen';
import BluetoothScreen from './src/screens/Bluetooth/BluetoothScreen';
import BluetoothSearchingScreen from './src/screens/Bluetooth/SearchingScreen';
import SettingsScreen from './src/screens/Settings/SettingsScreen';
import { AuthProvider } from './src/context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();
const StackNav = Stack.Navigator as any;

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <StackNav initialRouteName="SignIn" screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="chat" component={ChatScreen} />
          <Stack.Screen name="generatedFiles" component={GeneratedFilesScreen} />
          <Stack.Screen name="Bluetooth" component={BluetoothScreen} />
          <Stack.Screen name="BluetoothSearching" component={BluetoothSearchingScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </StackNav>
      </NavigationContainer>
    </AuthProvider>
  );
}
