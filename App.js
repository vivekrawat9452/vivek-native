import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import UserProfileScreen from './screens/UserProfile';
import RealtimeDBScreen from './screens/RealtimeDBScreen';
import FirestoreScreen from './screens/FirestoreScreen';
import CloudStorageScreen from './screens/CloudStorageScreen';
import './config/firebaseInit'; // Import Firebase initialization
import { colors } from './globals/styles';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitle: 'Back',
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            title: 'Firebase Features',
            headerBackVisible: false
          }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ 
            title: 'Authentication',
          }}
        />
        <Stack.Screen 
          name="UserProfile" 
          component={UserProfileScreen}
          options={{ 
            title: 'User Profile',
          }}
        />
        <Stack.Screen 
          name="RealtimeDB" 
          component={RealtimeDBScreen}
          options={{ 
            title: 'Realtime Database',
          }}
        />
        <Stack.Screen 
          name="Firestore" 
          component={FirestoreScreen}
          options={{ 
            title: 'Cloud Firestore',
          }}
        />
        <Stack.Screen 
          name="CloudStorage" 
          component={CloudStorageScreen}
          options={{ 
            title: 'Cloud Storage',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
