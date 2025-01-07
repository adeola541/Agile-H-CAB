import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { format } from 'date-fns';

const ScheduleRideScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);

  const timeSlots = [
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
  ];

  const handleTimeSelection = time => {
    setSelectedTime(time);
  };

  const handlePayment = () => {
    navigation.navigate('Payment');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule Ride</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.dateSection}>
          <View style={styles.dateHeader}>
            <Text style={styles.sectionTitle}>Schedule Your Ride</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[...Array(7)].map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() + index);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCard,
                    selectedDate.getDate() === date.getDate() &&
                      styles.selectedDate,
                  ]}
                  onPress={() => setSelectedDate(date)}>
                  <Text
                    style={[
                      styles.dateNumber,
                      selectedDate.getDate() === date.getDate() &&
                        styles.selectedText,
                    ]}>
                    {format(date, 'd')}
                  </Text>
                  <Text
                    style={[
                      styles.dateDay,
                      selectedDate.getDate() === date.getDate() &&
                        styles.selectedText,
                    ]}>
                    {format(date, 'EEE')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.timeSection}>
          {timeSlots.map((time, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeSlot,
                selectedTime === time && styles.selectedTime,
              ]}
              onPress={() => handleTimeSelection(time)}>
              <Text
                style={[
                  styles.timeText,
                  selectedTime === time && styles.selectedTimeText,
                ]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.priceSection}>
          <View style={styles.priceCard}>
            <View style={styles.priceHeader}>
              <Text style={styles.duration}>8:00 AM - 8:30 AM</Text>
              <Text style={styles.price}>CFA350</Text>
            </View>
            <Text style={styles.details}>30 mins • 15 miles</Text>
            <Text style={styles.vehicleType}>H-cab Max</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  dateSection: {
    padding: 15,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#1A73E8',
  },
  dateCard: {
    width: 60,
    height: 70,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDate: {
    backgroundColor: '#1A73E8',
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateDay: {
    fontSize: 14,
  },
  selectedText: {
    color: '#fff',
  },
  timeSection: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '30%',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedTime: {
    backgroundColor: '#1A73E8',
  },
  timeText: {
    fontSize: 16,
  },
  selectedTimeText: {
    color: '#fff',
  },
  priceSection: {
    padding: 15,
  },
  priceCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  duration: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A73E8',
  },
  details: {
    color: '#666',
    marginBottom: 5,
  },
  vehicleType: {
    color: '#666',
  },
  payButton: {
    backgroundColor: '#1A73E8',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ScheduleRideScreen;
