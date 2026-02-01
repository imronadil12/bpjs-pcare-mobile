import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AutomationContext } from '../context/AutomationContext';

const DatePicker = () => {
  const { dates, dateGoals, addDate, removeDate } = useContext(AutomationContext);
  const [selectedDate, setSelectedDate] = useState('');
  const [goal, setGoal] = useState('');

  const handleAddDate = () => {
    if (selectedDate && goal) {
      addDate(selectedDate, goal);
      setSelectedDate('');
      setGoal('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tanggal</Text>
      
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.dateInput}
          placeholder="YYYY-MM-DD"
          value={selectedDate}
          onChangeText={setSelectedDate}
        />
        <TextInput
          style={styles.goalInput}
          placeholder="Goal"
          value={goal}
          onChangeText={setGoal}
          keyboardType="number-pad"
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAddDate}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.tagsContainer}>
        {dates.map((date, idx) => (
          <View key={idx} style={styles.dateTag}>
            <Text style={styles.dateTagText}>
              {date} (Goal: {dateGoals[date] || '-'})
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
