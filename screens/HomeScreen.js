import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const menuItems = [
    {
      title: 'Authentication',
      description: 'Sign in with Phone number or Google',
      screen: 'Login'
    },
    {
      title: 'Realtime Chat',
      description: 'Real-time messaging with Firebase',
      screen: 'RealtimeDB'
    },
    {
      title: 'User Profile',
      description: 'Manage your profile information',
      screen: 'UserProfile'
    },
    {
      title: 'Cloud Firestore',
      description: 'Flexible, scalable NoSQL cloud database',
      screen: 'Firestore'
    },
    {
      title: 'Cloud Storage',
      description: 'Upload and manage images in Firebase Storage',
      screen: 'CloudStorage'
    }
  ];

  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.headerTitle}>Firebase Features</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => handleNavigation(item.screen)}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default HomeScreen; 