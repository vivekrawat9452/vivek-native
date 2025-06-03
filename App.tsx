import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './config/firebaseInit';

// Import screens
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RealtimeDBScreen from './screens/RealtimeDBScreen';
import FirestoreScreen from './screens/FirestoreScreen';
import CloudStorageScreen from './screens/CloudStorageScreen';
import UserProfile from './screens/UserProfile';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: '#f5f5f5',
  },
  headerTintColor: '#333',
  headerTitleStyle: {
    fontWeight: '600' as const,
  },
};

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={screenOptions}
          id="RootNavigator"
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Firebase Features' }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ title: 'Authentication' }}
          />
          <Stack.Screen 
            name="RealtimeDB" 
            component={RealtimeDBScreen}
            options={{ title: 'Realtime Database' }}
          />
          <Stack.Screen 
            name="Firestore" 
            component={FirestoreScreen}
            options={{ title: 'Cloud Firestore' }}
          />
          <Stack.Screen 
            name="CloudStorage" 
            component={CloudStorageScreen}
            options={{ title: 'Cloud Storage' }}
          />
          <Stack.Screen 
            name="UserProfile" 
            component={UserProfile}
            options={{ title: 'User Profile' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App; 