import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const DriverInfoScreen = ({ navigation }) => {
  const driverInfo = {
    name: 'David Brown',
    avatar: require('../../assets/images/driver-avatar.jpg'),
    rating: 4.8,
    totalRides: 1784,
    experience: '18 months',
    goodConversation: '95%',
    tripTime: 'Today at 9:00am',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver Info</Text>
        <TouchableOpacity>
          <Icon name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.driverProfile}>
        <Image source={driverInfo.avatar} style={styles.avatar} />
        <Text style={styles.name}>{driverInfo.name}</Text>
        <Text style={styles.tripTime}>{driverInfo.tripTime}</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Your assigned driver for this trip:</Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{driverInfo.experience}</Text>
            <Text style={styles.statLabel}>With us</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{driverInfo.rating} Rating</Text>
            <Text style={styles.statLabel}>123 Trips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{driverInfo.totalRides} Rides</Text>
            <Text style={styles.statLabel}>with us</Text>
          </View>
        </View>
        <Text style={styles.conversationRate}>
          {driverInfo.goodConversation} Good Conversation
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.button, styles.messageButton]}>
          <Icon name="chatbubble-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.callButton]}>
          <Icon name="call-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ratingSection}>
        <Text style={styles.ratingTitle}>Other rides Rated</Text>
        <View style={styles.ratingBar}>
          <View style={styles.ratingFill} />
        </View>
      </View>
    </ScrollView>
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
  driverProfile: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tripTime: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  conversationRate: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  messageButton: {
    backgroundColor: '#1A73E8',
  },
  callButton: {
    backgroundColor: '#34A853',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingSection: {
    padding: 20,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ratingBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  ratingFill: {
    width: '95%',
    height: '100%',
    backgroundColor: '#1A73E8',
    borderRadius: 4,
  },
});

export default DriverInfoScreen;
