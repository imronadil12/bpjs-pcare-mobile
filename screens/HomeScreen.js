import React, { useRef, useContext } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { AutomationContext } from '../context/AutomationContext';
import DatePicker from '../components/DatePicker';
import NumbersInput from '../components/NumbersInput';
import Settings from '../components/Settings';
import ProgressDisplay from '../components/ProgressDisplay';
import ControlButtons from '../components/ControlButtons';
import { automationScript } from '../utils/automationUtils';

const HomeScreen = () => {
  const webViewRef = useRef(null);
  const { updateProgress, setStatus } = useContext(AutomationContext);
  const [webViewHeight, setWebViewHeight] = React.useState(300);

  const handleWebViewMessage = (event) => {
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

  const injectedJavaScript = automationScript;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>🤖 PCARE Helper</Text>
          <Text style={styles.subtitle}>Auto Input Assistant v1.2.1</Text>
        </View>

        <View style={styles.section}>
          <DatePicker />
        </View>

        <View style={styles.section}>
          <NumbersInput />
        </View>

        <View style={styles.section}>
          <Settings />
        </View>

        <View style={styles.section}>
          <ProgressDisplay />
        </View>

        <View style={styles.section}>
          <ControlButtons webViewRef={webViewRef} />
        </View>

        <View style={styles.webviewSection}>
          <Text style={styles.webviewLabel}>PCARE Access</Text>
          <View style={styles.webviewContainer}>
            <WebView
              ref={webViewRef}
              source={{ uri: 'https://pcarejkn.bpjs-kesehatan.go.id/' }}
              style={[styles.webview, { height: webViewHeight }]}
              injectedJavaScript={injectedJavaScript}
              onMessage={handleWebViewMessage}
              startInLoadingState={true}
              scalesPageToFit={true}
              originWhitelist={['*']}
              mixedContentMode="always"
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>
          <Text style={styles.info}>
            The form will be automatically filled based on your settings. Use the controls above to manage automation.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    marginBottom: 16,
  },
  webviewSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  webviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  webviewContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  webview: {
    width: Dimensions.get('window').width - 32,
    minHeight: 400,
  },
  info: {
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 16,
    paddingHorizontal: 8,
  },
});

export default HomeScreen;
