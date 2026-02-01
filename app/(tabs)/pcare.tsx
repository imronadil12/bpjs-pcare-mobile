import React, { useRef, useContext, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  Alert,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { AutomationContext } from '@/context/AutomationContext';
import WebViewWrapper from '@/components/WebViewWrapper';
import DatePicker from '@/components/DatePicker';
import NumbersInput from '@/components/NumbersInput';
import Settings from '@/components/Settings';
import ProgressDisplay from '@/components/ProgressDisplay';
import ControlButtons from '@/components/ControlButtons';
import { automationScript } from '@/utils/automationUtils';

export default function PCareScreen() {
  const webViewRef = useRef(null);
  const { updateProgress, setStatus, numbers, dates, delayMs, startIndex, dateIndex, isRunning } = useContext(AutomationContext);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('https://pcarejkn.bpjs-kesehatan.go.id/');
  const [showControls, setShowControls] = useState(false);

  const handleWebViewMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      
      if (message.type === 'PROGRESS') {
        updateProgress(message.done, message.total);
        setStatus(message.status);
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  const goToEntryPage = () => {
    setUrl('https://pcarejkn.bpjs-kesehatan.go.id/eclaim/EntriDaftarDokkel');
  };

  const goToLogin = () => {
    setUrl('https://pcarejkn.bpjs-kesehatan.go.id/');
  };

  return (
    <View style={styles.container}>
      {/* Browser Address Bar */}
      <View style={styles.addressBar}>
        <TextInput
          style={styles.addressInput}
          value={url}
          onChangeText={setUrl}
          placeholder="Enter URL"
          editable={!isRunning}
        />
        <TouchableOpacity 
          style={[styles.goButton, isRunning && { opacity: 0.5 }]}
          onPress={() => {
            if (webViewRef.current) {
              (webViewRef.current as any).reload?.();
            }
          }}
          disabled={isRunning}
        >
          <Text style={styles.goButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Navigation Buttons */}
      <View style={styles.navButtons}>
        <TouchableOpacity 
          style={[styles.navBtn, styles.loginBtn]}
          onPress={goToLogin}
        >
          <Text style={styles.navBtnText}>🔐 Login</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navBtn, styles.entryBtn]}
          onPress={goToEntryPage}
        >
          <Text style={styles.navBtnText}>📝 Entry Form</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navBtn, styles.toggleBtn]}
          onPress={() => setShowControls(!showControls)}
        >
          <Text style={styles.navBtnText}>{showControls ? '🤖 Hide' : '🤖 Bot'}</Text>
        </TouchableOpacity>
      </View>

      {/* WebView - Main Content */}
      <View style={styles.webviewContainer}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
        <WebViewWrapper
          ref={webViewRef}
          url={url}
          style={styles.webview}
          injectedJavaScript={automationScript}
          onMessage={handleWebViewMessage}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </View>

      {/* Bot Controls - Collapsible */}
      {showControls && (
        <ScrollView style={styles.controlsPanel}>
          <View style={styles.controlsHeader}>
            <Text style={styles.controlsTitle}>🤖 Bot Controls</Text>
            <TouchableOpacity onPress={() => setShowControls(false)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.controlSection}>
            <Text style={styles.sectionLabel}>📅 Tanggal (Date)</Text>
            <DatePicker />
          </View>

          <View style={styles.controlSection}>
            <Text style={styles.sectionLabel}>📝 Numbers to Enter</Text>
            <NumbersInput />
          </View>

          <View style={styles.controlSection}>
            <Text style={styles.sectionLabel}>⚙️ Settings</Text>
            <Settings />
          </View>

          <View style={styles.controlSection}>
            <Text style={styles.sectionLabel}>📊 Progress</Text>
            <ProgressDisplay />
          </View>

          <View style={styles.controlSection}>
            <ControlButtons webViewRef={webViewRef} />
          </View>

          <Text style={styles.instructions}>
            1️⃣ Login manually using the browser above{'\n'}
            2️⃣ Navigate to Entry Form{'\n'}
            3️⃣ Add dates and goals{'\n'}
            4️⃣ Add numbers to enter{'\n'}
            5️⃣ Click Start to begin automation
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addressBar: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  addressInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    backgroundColor: '#fff',
  },
  goButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f4f8',
  },
  goButtonText: {
    fontSize: 18,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  navBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  loginBtn: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  entryBtn: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  toggleBtn: {
    borderColor: '#8b5cf6',
    backgroundColor: '#faf5ff',
  },
  navBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  controlsPanel: {
    maxHeight: 400,
    backgroundColor: '#f9fafb',
    borderTopWidth: 2,
    borderTopColor: '#8b5cf6',
    paddingBottom: 20,
  },
  controlsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  controlsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  closeBtn: {
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
  },
  controlSection: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',
  },
  instructions: {
    fontSize: 12,
    lineHeight: 20,
    color: '#666',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#e8f4f8',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 4,
  },
});
