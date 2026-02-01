import React, { useContext } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { AutomationContext } from '@/context/AutomationContext';

const Settings = () => {
  const { delayMs, setDelayMs, startIndex, setStartIndex } = useContext(AutomationContext);

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
      </View>

      <View style={styles.settingGroup}>
        <Text style={styles.label}>Start Index</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          value={startIndex.toString()}
          onChangeText={(text) => setStartIndex(parseInt(text, 10) || 0)}
          keyboardType="number-pad"
        />
      </View>
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
});

export default Settings;
