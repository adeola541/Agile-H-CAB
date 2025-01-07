import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createMessage, getMessages, subscribeToMessages } from '../../backend/services/database';
import { Message } from '../../types/database';

const ChatScreen = ({ navigation, route }) => {
  const { rideId, driver } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(rideId, (updatedMessages) => {
      setMessages(updatedMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [rideId]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const messageData = {
          rideId,
          senderId: 'current-user-id', // Update this to get the current user's ID from MongoDB
          receiverId: driver.id,
          content: newMessage.trim(),
          type: 'text',
          read: false,
        };

        await createMessage(rideId, messageData);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        // Handle error (show toast, etc.)
      }
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.senderId === 'current-user-id'; // Update this to get the current user's ID from MongoDB
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.driverMessage,
        ]}>
        {!isUser && (
          <Image source={{ uri: driver.profilePicture }} style={styles.messageAvatar} />
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.driverBubble,
          ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.driverMessageText,
          ]}>
            {item.content}
          </Text>
          <Text style={styles.timestamp}>{formatTime(item.createdAt)}</Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.driverInfo}>
          <Image 
            source={{ uri: driver.profilePicture }} 
            style={styles.avatar}
          />
          <View>
            <Text style={styles.driverName}>{`${driver.firstName} ${driver.lastName}`}</Text>
            <Text style={styles.status}>
              {driver.status === 'available' ? 'Online' : 'Busy'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('DriverInfo', { driver })}>
          <Icon name="information-circle-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !newMessage.trim() && styles.disabledButton,
          ]}
          onPress={sendMessage}
          disabled={!newMessage.trim()}>
          <Icon
            name="send"
            size={24}
            color={newMessage.trim() ? '#1A73E8' : '#999'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 12,
    color: '#34A853',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  driverMessage: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#1A73E8',
    borderBottomRightRadius: 4,
  },
  driverBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#fff',
  },
  driverMessageText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ChatScreen;
