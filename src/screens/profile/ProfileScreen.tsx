import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({ navigation }) => {
  const userProfile = {
    name: 'Quincy Abernathy',
    email: 'quincy.abernathy@example.com',
    phone: '+1-555-0123',
    bio: 'Loves exploring new places and meeting new people.',
    avatar: require('../../assets/images/profile-avatar.jpg'),
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Icon name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileInfo}>
        <Image source={userProfile.avatar} style={styles.avatar} />
        <Text style={styles.name}>{userProfile.name}</Text>
        <Text style={styles.bio}>{userProfile.bio}</Text>
        <View style={styles.contactInfo}>
          <Text style={styles.contactText}>Email: {userProfile.email}</Text>
          <Text style={styles.contactText}>Phone: {userProfile.phone}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ride History</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RideHistory')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <RideHistoryItem
          image={require('../../assets/images/car-history.jpg')}
          description="Quick and easy ride to the airport."
          date="2 weeks ago"
        />
      </View>
    </ScrollView>
  );
};

const RideHistoryItem = ({ image, description, date }) => (
  <View style={styles.historyItem}>
    <Image source={image} style={styles.historyImage} />
    <View style={styles.historyContent}>
      <Text style={styles.historyDescription}>{description}</Text>
      <Text style={styles.historyDate}>{date}</Text>
    </View>
  </View>
);

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
  profileInfo: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  contactInfo: {
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#1A73E8',
    fontSize: 14,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  historyImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
    justifyContent: 'center',
  },
  historyDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
  },
});

export default ProfileScreen;
