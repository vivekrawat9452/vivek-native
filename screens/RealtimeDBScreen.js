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
import { getDatabase, ref, push, query, orderByChild, limitToLast, onValue } from '@react-native-firebase/database';
import { colors } from '../globals/styles';

const RealtimeDBScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const database = getDatabase();

  useEffect(() => {
    const messagesRef = ref(database, 'messages');
    // Create a query for the last 20 messages, ordered by createdAt
    const messagesQuery = query(
      messagesRef,
      orderByChild('createdAt'),
      limitToLast(20)
    );
    
    // Listen for messages
    const unsubscribeMessages = onValue(messagesQuery, (snapshot) => {
      setLoading(true);
      try {
        const data = snapshot.val();
        if (data) {
          // Convert object to array and sort by createdAt
          const messageList = Object.entries(data).map(([id, message]) => ({
            id,
            ...message
          })).sort((a, b) => b.createdAt - a.createdAt);
          setMessages(messageList);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        Alert.alert('Error', 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('Database error:', error);
      Alert.alert('Error', 'Failed to connect to database');
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribeMessages();
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const messagesRef = ref(database, 'messages');
      await push(messagesRef, {
        text: message.trim(),
        senderId: 'Anonymous User',
        receiverId: 'ALL',
        createdAt: Date.now()
      });
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <View style={styles.messageHeader}>
        <Text style={styles.senderId}>From: {item.senderId}</Text>
        <Text style={styles.receiverId}>To: {item.receiverId}</Text>
      </View>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text>Loading messages...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Realtime Database Demo</Text>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.list}
        inverted={false}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={colors.textcolor}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    padding: 16,
  },
  list: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
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
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  senderId: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  receiverId: {
    fontSize: 12,
    color: colors.textcolor,
    opacity: 0.7,
  },
  messageText: {
    fontSize: 16,
    color: colors.textcolor,
    marginVertical: 4,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textcolor,
    opacity: 0.6,
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    color: colors.textcolor,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RealtimeDBScreen; 