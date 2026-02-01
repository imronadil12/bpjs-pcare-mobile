import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AutomationContext } from '@/context/AutomationContext';
import { parseNumbers, loadFromUrl } from '@/utils/automationUtils';

const NumbersInput = () => {
  const context = useContext(AutomationContext);
  
  if (!context) {
    return null;
  }

  const { numbers, setNumbersFromText } = context;
  const [inputText, setInputText] = useState(numbers.join('\n'));
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTextChange = (text: string) => {
    setInputText(text);
    setNumbersFromText(text);
  };

  const handleLoadFromUrl = async () => {
    if (!urlInput.trim()) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      const loadedNumbers = await loadFromUrl(urlInput);
      const text = loadedNumbers.join('\n');
      setInputText(text);
      setNumbersFromText(text);
      setUrlInput('');
      Alert.alert('Success', `Loaded ${loadedNumbers.length} numbers`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = () => {
    Alert.alert('Info', 'File upload not yet implemented. Use URL option instead.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nomor (1 per baris)</Text>
      
      <TextInput
        style={styles.textarea}
        placeholder="Masukkan nomor, satu per baris"
        value={inputText}
        onChangeText={handleTextChange}
        multiline
        numberOfLines={6}
      />

      <View style={styles.urlGroup}>
        <TouchableOpacity 
          style={[styles.uploadBtn, loading && { opacity: 0.5 }]}
          onPress={handleUploadFile}
          disabled={loading}
        >
          <Text style={styles.btnText}>📁 Upload</Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.urlInput}
          placeholder="Atau paste URL"
          value={urlInput}
          onChangeText={setUrlInput}
        />
        
        <TouchableOpacity 
          style={[styles.loadBtn, loading && { opacity: 0.5 }]}
          onPress={handleLoadFromUrl}
          disabled={loading}
        >
          <Text style={styles.btnText}>{loading ? '⏳' : '🔗'} Load</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.info}>Total: {numbers.length} nomor</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 12,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  urlGroup: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  uploadBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  urlInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
  },
  loadBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  info: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default NumbersInput;
