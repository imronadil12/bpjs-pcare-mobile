import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AutomationContext } from '@/context/AutomationContext';
import { getProgressPercentage } from '@/utils/automationUtils';

const ProgressDisplay = () => {
  const { status, progress, dates, dateIndex } = useContext(AutomationContext);
  const currentDate = dates[dateIndex] || '-';
  const progressPercentage = getProgressPercentage(progress.done, progress.total);

  const getStatusColor = (status: string) => {
    if (status.includes('Running')) return styles.statusRunning;
    if (status.includes('Paused')) return styles.statusPaused;
    if (status.includes('Error')) return styles.statusError;
    if (status.includes('Completed')) return styles.statusCompleted;
    return styles.statusIdle;
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusItem}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, getStatusColor(status)]}>{status}</Text>
      </View>

      <View style={styles.statusItem}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{currentDate}</Text>
      </View>

      <View style={styles.statusItem}>
        <Text style={styles.label}>Progress:</Text>
        <Text style={styles.value}>{progress.done} / {progress.total}</Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${progressPercentage}%` }
          ]}
        >
          <Text style={styles.progressText}>{progressPercentage}%</Text>
        </View>
      </View>

      <Text style={styles.percentage}>{progressPercentage}% Complete</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2563eb',
  },
  statusIdle: {
    color: '#6b7280',
  },
  statusRunning: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  statusPaused: {
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  statusError: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  statusCompleted: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 24,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  percentage: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
});

export default ProgressDisplay;
