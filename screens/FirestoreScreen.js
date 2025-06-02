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
import firestore from '@react-native-firebase/firestore';
import { colors } from '../globals/styles';

const FirestoreScreen = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('tasks')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const taskList = [];
        querySnapshot.forEach(documentSnapshot => {
          taskList.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data()
          });
        });
        setTasks(taskList);
      });

    return () => subscriber();
  }, []);

  const addTask = async () => {
    if (task.trim()) {
      try {
        await firestore().collection('tasks').add({
          title: task,
          completed: false,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
        setTask('');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      await firestore()
        .collection('tasks')
        .doc(id)
        .update({
          completed: !completed
        });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderTask = ({ item }) => (
    <TouchableOpacity 
      style={[styles.taskContainer, item.completed && styles.taskCompleted]}
      onPress={() => toggleTask(item.id, item.completed)}
    >
      <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
        {item.title}
      </Text>
      <Text style={styles.timestamp}>
        {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleString() : 'Just now'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Cloud Firestore Demo</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={task}
          onChangeText={setTask}
          placeholder="Add a new task..."
          placeholderTextColor={colors.textcolor}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={addTask}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    color: colors.textcolor,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  taskContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  taskCompleted: {
    backgroundColor: '#f8f8f8',
    opacity: 0.8,
  },
  taskText: {
    fontSize: 16,
    color: colors.textcolor,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textcolor + '80',
  },
  timestamp: {
    fontSize: 12,
    color: colors.textcolor,
    opacity: 0.6,
    marginTop: 4,
  },
});

export default FirestoreScreen; 