import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert
} from 'react-native';
import { getDatabase, ref, push, onValue } from '@react-native-firebase/database';
import { colors } from '../globals/styles';

const UserProfile = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const database = getDatabase();
  const userId = `user_${Date.now()}`; // Create unique user ID using timestamp

  useEffect(() => {
    // Listen for users data
    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const usersList = Object.entries(data).map(([id, userData]) => ({
            id,
            ...userData
          }));
          setUsers(usersList);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error('Error loading users:', error);
        Alert.alert('Error', 'Failed to load users data');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !age.trim() || !gender.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const usersRef = ref(database, 'users');
      await push(usersRef, {
        name: name.trim(),
        age: parseInt(age.trim()),
        gender: gender.trim(),
        userId,
        createdAt: Date.now()
      });

      // Clear form after successful submission
      setName('');
      setAge('');
      setGender('');
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to save user data');
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <Text style={styles.userName}>{item.name}</Text>
      <View style={styles.userDetails}>
        <Text style={styles.userInfo}>Age: {item.age}</Text>
        <Text style={styles.userInfo}>Gender: {item.gender}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>User Profile</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.textcolor}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholderTextColor={colors.textcolor}
        />
        <TextInput
          style={styles.input}
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
          placeholderTextColor={colors.textcolor}
        />
        <TouchableOpacity
          style={[styles.submitButton, (!name || !age || !gender) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!name || !age || !gender}
        >
          <Text style={styles.submitButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.usersListContainer}>
        <Text style={styles.subHeader}>All Users</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading users...</Text>
        ) : (
          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={item => item.id}
            style={styles.usersList}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  formContainer: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    color: colors.textcolor,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  usersListContainer: {
    flex: 1,
  },
  usersList: {
    flex: 1,
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  userDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfo: {
    fontSize: 14,
    color: colors.textcolor,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: colors.textcolor,
  },
});

export default UserProfile; 