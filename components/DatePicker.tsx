import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { AutomationContext } from '@/context/AutomationContext';

// Convert dd-mm-yyyy to yyyy-mm-dd
const convertToISO = (ddmmyyyy: string): string | null => {
  const match = ddmmyyyy.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  
  // Validate date
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
};

// Convert yyyy-mm-dd to dd-mm-yyyy
const convertToDisplayFormat = (yyyymmdd: string): string => {
  const match = yyyymmdd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return yyyymmdd;
  const [, year, month, day] = match;
  return `${day}-${month}-${year}`;
};

const DatePicker = () => {
  const context = useContext(AutomationContext);
  
  if (!context) {
    return null;
  }

  const { dates, dateGoals, addDate, removeDate } = context;
  const [selectedDate, setSelectedDate] = useState('');
  const [goal, setGoal] = useState('');

  const handleAddDate = () => {
    if (!selectedDate || !goal) {
      Alert.alert('Error', 'Please fill in both date and goal');
      return;
    }
    
    const isoDate = convertToISO(selectedDate);
    if (!isoDate) {
      Alert.alert('Error', 'Date format must be DD-MM-YYYY (e.g., 15-01-2024)');
      return;
    }
    
    addDate(isoDate, goal);
    setSelectedDate('');
    setGoal('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tanggal</Text>
      
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.dateInput}
          placeholder="DD-MM-YYYY"
          value={selectedDate}
          onChangeText={setSelectedDate}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.goalInput}
          placeholder="Goal"
          value={goal}
          onChangeText={setGoal}
          keyboardType="number-pad"
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAddDate}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.tagsContainer}>
        {dates.map((date: string, idx: number) => (
          <View key={idx} style={styles.dateTag}>
            <Text style={styles.dateTagText}>
              {convertToDisplayFormat(date)} (Goal: {dateGoals[date] || '-'})
            </Text>
            <TouchableOpacity onPress={() => removeDate(idx)}>
              <Text style={styles.removeBtn}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
  inputGroup: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  dateInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
  },
  goalInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
  },
  addBtn: {
    flex: 0.8,
    backgroundColor: '#2563eb',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  tagsContainer: {
    maxHeight: 120,
  },
  dateTag: {
    backgroundColor: '#e0e7ff',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTagText: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  removeBtn: {
    fontSize: 18,
    color: '#dc2626',
    fontWeight: 'bold',
  },
});

export default DatePicker;
