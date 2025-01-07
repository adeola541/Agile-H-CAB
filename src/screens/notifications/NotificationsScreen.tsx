import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const notifications = [
  {
    id: '1',
    title: 'Your ride is arriving soon',
    time: '11:45 AM',
    isNew: true,
    icon: 'car-sport',
  },
  {
    id: '2',
    title: 'Your ride has been cancelled',
    time: '9:30 AM',
    isNew: true,
    icon: 'close-circle',
  },
  {
    id: '3',
    title: 'Promo: Get 20% off on your next ride',
    time: 'Yesterday',
    isNew: false,
    icon: 'gift',
  },
  {
    id: '4',
    title: 'Ride completed. How was your trip?',
    time: '2 days ago',
    isNew: false,
    icon: 'star',
  },
  {
    id: '5',
    title: 'Important: Service update',
    time: '3 days ago',
    isNew: false,
    icon: 'information-circle',
  },
  {
    id: '6',
    title: 'New feature: Schedule rides in advance',
    time: '4 days ago',
    isNew: false,
    icon: 'calendar',
  },
  {
    id: '7',
    title: 'Your ride is on the way',
    time: '5 days ago',
    isNew: false,
    icon: 'car',
  },
];

const NotificationsScreen = ({ navigation }) => {
  const NotificationItem = ({ item }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={[styles.iconContainer, item.isNew && styles.newNotification]}>
        <Icon name={item.icon} size={24} color={item.isNew ? '#1A73E8' : '#666'} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
      {item.isNew && <View style={styles.newDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Icon name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.notificationsList}>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} item={notification} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  newNotification: {
    backgroundColor: '#e8f0fe',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  newDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1A73E8',
    marginLeft: 8,
  },
});

export default NotificationsScreen;
