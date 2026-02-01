import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AutomationContext } from '../context/AutomationContext';

const ControlButtons = ({ webViewRef }) => {
  const { 
    startAutomation, 
    pauseAutomation, 
    resumeAutomation, 
    stopAutomation, 
    nextDate,
    isRunning,
    isPaused,
    numbers,
    dates,
    delayMs,
    startIndex,
    dateIndex
  } = useContext(AutomationContext);

  const handleStart = () => {
    startAutomation();
    if (webViewRef?.current) {
      const script = `
        window.startAutomation(
          ${JSON.stringify(numbers)}, 
          '${dates[dateIndex] || dates[0]}', 
          ${delayMs}, 
          ${startIndex}
        );
      `;
      webViewRef.current.injectJavaScript(script);
    }
  };

  const handlePause = () => {
    pauseAutomation();
    if (webViewRef?.current) {
      webViewRef.current.injectJavaScript('window.pauseAutomation();');
    }
  };

  const handleResume = () => {
    resumeAutomation();
    if (webViewRef?.current) {
      webViewRef.current.injectJavaScript('window.resumeAutomation();');
    }
  };

  const handleStop = () => {
    stopAutomation();
    if (webViewRef?.current) {
      webViewRef.current.injectJavaScript('window.stopAutomation();');
    }
  };

  const handleNextDate = () => {
    nextDate();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, styles.startBtn, isRunning && styles.disabled]}
        onPress={handleStart}
        disabled={isRunning}
      >
        <Text style={styles.buttonText}>▶ Start</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.pauseBtn, (!isRunning || isPaused) && styles.disabled]}
        onPress={handlePause}
        disabled={!isRunning || isPaused}
      >
        <Text style={styles.buttonText}>⏸ Pause</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.resumeBtn, (!isRunning || !isPaused) && styles.disabled]}
        onPress={handleResume}
        disabled={!isRunning || !isPaused}
      >
        <Text style={styles.buttonText}>▶️ Resume</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.stopBtn]}
        onPress={handleStop}
      >
        <Text style={styles.buttonText}>⏹ Stop</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.nextBtn, !isRunning && styles.disabled]}
        onPress={handleNextDate}
        disabled={!isRunning}
      >
        <Text style={styles.buttonText}>→ Next Date</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  button: {
    flex: 1,
    minWidth: 100,
    paddingVertical: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  startBtn: {
    backgroundColor: '#10b981',
  },
  pauseBtn: {
    backgroundColor: '#f59e0b',
  },
  resumeBtn: {
    backgroundColor: '#8b5cf6',
  },
  stopBtn: {
    backgroundColor: '#dc2626',
  },
  nextBtn: {
    backgroundColor: '#06b6d4',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default ControlButtons;
