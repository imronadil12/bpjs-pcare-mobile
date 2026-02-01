import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { AutomationContext } from '@/context/AutomationContext';

interface ControlButtonsProps {
  webViewRef: React.RefObject<WebView | null>;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ webViewRef }) => {
  const context = useContext(AutomationContext);
  
  if (!context) {
    return null;
  }

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
    dateGoals,
    delayMs,
    startIndex,
    dateIndex
  } = context;

  const handleStart = () => {
    if (!numbers || numbers.length === 0) {
      alert('Please add numbers first');
      return;
    }
    if (!dates || dates.length === 0) {
      alert('Please add dates first');
      return;
    }

    startAutomation();

    if (webViewRef?.current) {
      const script = `
        (function() {
          console.log('[BOT] Starting automation with ' + ${JSON.stringify(numbers)}.length + ' numbers on ' + ${JSON.stringify(dates)}.length + ' dates');
          if (typeof window.startAutomation !== 'function') {
            console.error('[BOT] ERROR: startAutomation function not found!');
            return;
          }
          setTimeout(() => {
            window.startAutomation(
              ${JSON.stringify(numbers)},
              ${JSON.stringify(dates)},
              ${delayMs},
              ${startIndex},
              ${dateIndex},
              ${JSON.stringify(dateGoals)}
            );
          }, 100);
        })();
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
