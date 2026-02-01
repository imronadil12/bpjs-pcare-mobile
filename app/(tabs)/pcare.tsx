import React, { useRef, useContext, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { AutomationContext } from '@/context/AutomationContext';
import WebViewWrapper from '@/components/WebViewWrapper';
import DatePicker from '@/components/DatePicker';
import NumbersInput from '@/components/NumbersInput';
import Settings from '@/components/Settings';
import ProgressDisplay from '@/components/ProgressDisplay';
import ControlButtons from '@/components/ControlButtons';
import { automationScript } from '@/utils/automationUtils';

export default function PCareScreen() {
  const webViewRef = useRef<WebView>(null);
  const context = useContext(AutomationContext);
  const [loading, setLoading] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const PCARE_URL = 'https://pcarejkn.bpjs-kesehatan.go.id/';
  const { width, height } = useWindowDimensions();
  const isTablet = width > 768;
  
  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { updateProgress, setStatus, numbers, dates, delayMs, startIndex, dateIndex, isRunning, isLoading } = context;
  const isSplitView = isTablet && showControls;

  // Show loading while settings are being restored
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingLabel}>Loading settings...</Text>
      </View>
    );
  }

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
    if (webViewRef.current) {
      (webViewRef.current as any).injectJavaScript?.(`window.location.href = '${PCARE_URL}eclaim/EntriDaftarDokkel';`);
    }
  };

  const goToLogin = () => {
    if (webViewRef.current) {
      (webViewRef.current as any).injectJavaScript?.(`window.location.href = '${PCARE_URL}';`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Quick Navigation Buttons */}
      <View style={[styles.navButtons, isTablet && styles.navButtonsTablet]}>
        <TouchableOpacity 
          style={[styles.navBtn, styles.loginBtn, isTablet && styles.navBtnTablet]}
          onPress={goToLogin}
        >
          <Text style={[styles.navBtnText, isTablet && styles.navBtnTextTablet]}>🔐 Login</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navBtn, styles.entryBtn, isTablet && styles.navBtnTablet]}
          onPress={goToEntryPage}
        >
          <Text style={[styles.navBtnText, isTablet && styles.navBtnTextTablet]}>📝 Entry Form</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navBtn, styles.toggleBtn, isTablet && styles.navBtnTablet]}
          onPress={() => setShowControls(!showControls)}
        >
          <Text style={[styles.navBtnText, isTablet && styles.navBtnTextTablet]}>{showControls ? '🤖 Hide' : '🤖 Bot'}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={[styles.mainContent, isSplitView && styles.splitView]}>
        {/* WebView - Main Content */}
        <View style={[styles.webviewContainer, isSplitView && styles.webviewSplit]}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
          <WebViewWrapper
            ref={webViewRef}
            url={PCARE_URL}
            style={styles.webview}
            injectedJavaScript={automationScript}
            onMessage={handleWebViewMessage}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
        </View>

        {/* Bot Controls - Collapsible or Side Panel */}
        {showControls && (
          <ScrollView style={[styles.controlsPanel, isSplitView && styles.controlsPanelTablet]}>
            <View style={styles.controlsHeader}>
              <Text style={styles.controlsTitle}>🤖 Bot Controls</Text>
              {!isSplitView && (
                <TouchableOpacity onPress={() => setShowControls(false)}>
                  <Text style={styles.closeBtn}>✕</Text>
                </TouchableOpacity>
              )}
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

            {!isSplitView && (
              <Text style={styles.instructions}>
                1️⃣ Login manually using the browser above{'\n'}
                2️⃣ Navigate to Entry Form{'\n'}
                3️⃣ Add dates and goals{'\n'}
                4️⃣ Add numbers to enter{'\n'}
                5️⃣ Click Start to begin automation
              </Text>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingLabel: {
    marginTop: 12,
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
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
  navButtonsTablet: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
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
  navBtnTablet: {
    paddingVertical: 12,
    paddingHorizontal: 16,
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
  navBtnTextTablet: {
    fontSize: 13,
  },
  mainContent: {
    flex: 1,
  },
  splitView: {
    flexDirection: 'row',
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  webviewSplit: {
    flex: 1.5,
    borderRightWidth: 1,
    borderRightColor: '#eee',
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
  controlsPanelTablet: {
    maxHeight: 'none' as any,
    flex: 1,
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderLeftColor: '#8b5cf6',
    paddingBottom: 0,
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
