import React, { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AutomationContext } from '@/context/AutomationContext';

const Settings = () => {
  const context = useContext(AutomationContext);
  
  if (!context) {
    return null;
  }

  const { delayMs, setDelayMs, clearSettings } = context;

  const handleClearSettings = () => {
    Alert.alert(
      'Clear All Settings?',
      'This will delete all saved numbers, dates, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Clear',
          onPress: async () => {
            await clearSettings();
            Alert.alert('Success', 'All settings have been cleared.');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingGroup}>
        <Text style={styles.label}>Delay (ms)</Text>
        <TextInput
          style={styles.input}
          placeholder="1200"
          value={delayMs.toString()}
          onChangeText={(text) => setDelayMs(parseInt(text, 10) || 1200)}
          keyboardType="number-pad"
        />
        <Text style={styles.hint}>Time to wait between actions (milliseconds)</Text>
      </View>

      <TouchableOpacity style={styles.clearBtn} onPress={handleClearSettings}>
        <Text style={styles.clearBtnText}>🗑️ Clear All Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    gap: 12,
  },
  settingGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
  },
  hint: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  clearBtn: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtnText: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default Settings;
