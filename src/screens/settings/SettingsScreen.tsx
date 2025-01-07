import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    highContrast: false,
    screenReader: false,
    largeText: false,
    securePayment: true,
    dataEncryption: true,
    twoFactor: false,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const SettingItem = ({ icon, title, value, onToggle }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color="#666" />
        <Text style={styles.settingText}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#767577', true: '#1A73E8' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Icon name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="search-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accessibility</Text>
        <SettingItem
          icon="contrast"
          title="High Contrast Mode"
          value={settings.highContrast}
          onToggle={() => toggleSetting('highContrast')}
        />
        <SettingItem
          icon="eye"
          title="Screen Reader Support"
          value={settings.screenReader}
          onToggle={() => toggleSetting('screenReader')}
        />
        <SettingItem
          icon="text"
          title="Large Text Option"
          value={settings.largeText}
          onToggle={() => toggleSetting('largeText')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <SettingItem
          icon="card"
          title="Secure Payment Gateway"
          value={settings.securePayment}
          onToggle={() => toggleSetting('securePayment')}
        />
        <SettingItem
          icon="lock-closed"
          title="Data Encryption"
          value={settings.dataEncryption}
          onToggle={() => toggleSetting('dataEncryption')}
        />
        <SettingItem
          icon="shield-checkmark"
          title="Two-Factor Authentication"
          value={settings.twoFactor}
          onToggle={() => toggleSetting('twoFactor')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Referral Program</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Rating System</Text>
        </TouchableOpacity>
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
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#666',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1A73E8',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SettingsScreen;
