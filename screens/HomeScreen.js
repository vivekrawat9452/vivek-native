import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../globals/styles';

const HomeScreen = () => {
  const navigation = useNavigation();

  const menuItems = [
    {
      title: 'Authentication',
      description: 'Sign in with Phone number or Google',
      screen: 'Login'
    },
    {
      title: 'Firebase Realtime Database',
      description: 'Real-time data sync and storage',
      screen: 'RealtimeDB'
    },
    {
      title: 'Firebase Cloud Firestore',
      description: 'Flexible, scalable NoSQL cloud database',
      screen: 'Firestore'
    },
    {
      title: 'Cloud Storage',
      description: 'Upload and manage images in Firebase Storage',
      screen: 'CloudStorage'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Firebase Features</Text>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  menuContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textcolor,
    opacity: 0.8,
  },
});

export default HomeScreen; 