import React, { useRef, useEffect } from 'react';
import { Platform, View, StyleSheet } from 'react-native';

interface WebViewWrapperProps {
  url: string;
  onMessage?: (event: any) => void;
  injectedJavaScript?: string;
  style?: any;
  loading?: boolean;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  ref?: React.RefObject<any>;
}

const WebViewWrapper = React.forwardRef<any, WebViewWrapperProps>((props, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { 
    url, 
    onMessage, 
    injectedJavaScript, 
    style,
    onLoadStart,
    onLoadEnd
  } = props;

  // On web platform, use iframe
  if (Platform.OS === 'web') {
    return (
      <div style={{ ...style, overflow: 'hidden' }}>
        <iframe
          ref={iframeRef as any}
          src={url}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
          title="pcare-browser"
          onLoad={() => {
            onLoadEnd?.();
            // Inject script if provided
            if (injectedJavaScript && iframeRef.current?.contentWindow) {
              try {
                (iframeRef.current.contentWindow as any).eval(injectedJavaScript);
              } catch (e) {
                console.log('Script injection note:', e);
              }
            }
          }}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation allow-modals"
        />
      </div>
    );
  }

  // On native platform, use WebView
  const { WebView } = require('react-native-webview');
  
  return (
    <WebView
      ref={ref}
      source={{ uri: url }}
      style={style}
      injectedJavaScript={injectedJavaScript}
      onMessage={onMessage}
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
      startInLoadingState={true}
      scalesPageToFit={true}
      originWhitelist={['*']}
      mixedContentMode="always"
      javaScriptEnabled={true}
      domStorageEnabled={true}
      cacheEnabled={true}
      userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      allowsBackForwardNavigationGestures={true}
      applicationNameForUserAgent="PCareBot/1.0"
    />
  );
});

WebViewWrapper.displayName = 'WebViewWrapper';

export default WebViewWrapper;
