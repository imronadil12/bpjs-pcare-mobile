# PCARE Chrome Extension to Android Conversion - Complete Guide

## 📋 Project Summary

Successfully converted the PCARE Chrome Extension into a fully-functional Android mobile app using Expo and React Native. The app maintains all core functionality while adapting it for mobile platforms.

### What Was Converted

**From Chrome Extension**:
- `manifest.json` → App configuration (app.json)
- `popup.html/popup.js` → React components + Context API
- `popup.css` → React Native StyleSheet
- `content.js` → WebView injection + automation script
- Chrome storage → AsyncStorage

**To Mobile App**:
- Tab-based navigation (Expo Router)
- Component-based UI (React Native)
- Context-based state management
- WebView integration for PCARE website access

---

## 📁 Project Structure

```
bpjs-pcare-mobile/
│
├── 📱 App Entry Points
│   ├── app/_layout.tsx                 # Root layout with AutomationProvider
│   └── app/(tabs)/
│       ├── _layout.tsx                 # Tab navigation setup
│       ├── index.tsx                   # Home screen
│       ├── pcare.tsx                   # MAIN: PCARE automation screen ⭐
│       └── explore.tsx                 # Explore section
│
├── 🎨 Components (Reusable UI)
│   ├── DatePicker.tsx                  # Date + goal input
│   ├── NumbersInput.tsx                # Number input + URL loader
│   ├── Settings.tsx                    # Delay & index config
│   ├── ProgressDisplay.tsx             # Progress visualization
│   ├── ControlButtons.tsx              # Start/Pause/Resume/Stop buttons
│   └── [other existing components]
│
├── 🧠 State Management
│   └── context/AutomationContext.tsx   # Global automation state + logic
│
├── 🔧 Utilities
│   └── utils/automationUtils.ts        # Automation script + helpers
│
├── 📦 Configuration
│   ├── package.json                    # Dependencies (all included)
│   ├── app.json                        # Expo/app config
│   ├── tsconfig.json                   # TypeScript config
│   └── eslint.config.js                # Linting rules
│
├── 📚 Documentation
│   ├── PCARE_README.md                 # Comprehensive documentation
│   ├── QUICKSTART.md                   # Quick start guide
│   └── CONVERSION_GUIDE.md             # This file
│
└── 🚀 Running the App
    └── npm scripts for Android/iOS/Web
```

---

## 🔄 Conversion Details

### 1. **Manifest & Configuration**

**Original** (Chrome):
```json
{
  "manifest_version": 3,
  "name": "PCARE Auto Input Helper",
  "version": "1.2.1",
  "permissions": ["storage", "activeTab", "scripting"],
  "host_permissions": ["https://pcarejkn.bpjs-kesehatan.go.id/*"]
}
```

**Converted** (Android/Expo):
```json
// app.json - Expo configuration
{
  "expo": {
    "name": "PCARE Helper",
    "slug": "pcare-helper",
    "version": "1.2.1",
    "platforms": ["ios", "android"],
    "plugins": [
      "react-native-webview",
      "@react-native-async-storage/async-storage"
    ]
  }
}
```

### 2. **UI Components**

**Original** (HTML/CSS):
```html
<!-- popup.html -->
<input id="datePickerInput" type="date">
<textarea id="numbers" rows="6"></textarea>
<button id="start">Start</button>
```

```css
/* popup.css */
.button { background: #2563eb; }
```

**Converted** (React Native):
```typescript
// components/DatePicker.tsx
<TextInput 
  style={styles.dateInput}
  placeholder="YYYY-MM-DD"
/>

// components/ControlButtons.tsx
<TouchableOpacity style={[styles.button, styles.startBtn]}>
  <Text style={styles.buttonText}>▶ Start</Text>
</TouchableOpacity>

// StyleSheet replaces CSS
const styles = StyleSheet.create({
  startBtn: { backgroundColor: '#10b981' }
});
```

### 3. **State Management**

**Original** (Chrome Storage + Global Variables):
```javascript
// popup.js
let dates = [];
let dateGoals = {};

chrome.storage.local.get(['tanggal', 'dateGoals'], data => {
  dates = data.tanggal || [];
});

// Manual state management
```

**Converted** (React Context + AsyncStorage):
```typescript
// context/AutomationContext.tsx
export const AutomationProvider = ({ children }) => {
  const [dates, setDates] = useState<string[]>([]);
  const [dateGoals, setDateGoals] = useState<Record<string, number>>({});

  // Auto-save to AsyncStorage
  useEffect(() => {
    saveState();
  }, [dates, dateGoals]);

  return (
    <AutomationContext.Provider value={{ dates, setDates, ... }}>
      {children}
    </AutomationContext.Provider>
  );
};
```

### 4. **Content Script to WebView Injection**

**Original** (Chrome Content Script):
```javascript
// content.js - Runs on PCARE website
function createProgressOverlay() { ... }
window.addEventListener('message', e => { ... });
```

**Converted** (WebView + JavaScript Injection):
```typescript
// utils/automationUtils.ts
export const automationScript = `
  window.automationState = { running: false, ... };
  
  window.startAutomation = async function(numbers, date, delay) {
    // Same automation logic adapted for WebView
  };
`;

// app/(tabs)/pcare.tsx
<WebView
  injectedJavaScript={automationScript}
  onMessage={handleWebViewMessage}
/>
```

### 5. **Storage System**

**Original** (Chrome Storage):
```javascript
chrome.storage.local.set({ tanggal, numbers, delayMs });
chrome.storage.local.get(['tanggal'], data => { ... });
```

**Converted** (AsyncStorage):
```typescript
// Automatic in AutomationContext
const loadState = async () => {
  const data = await AsyncStorage.multiGet([
    'tanggal', 'dateGoals', 'numbers', 'delayMs'
  ]);
};

const saveState = async () => {
  await AsyncStorage.multiSet([
    ['tanggal', JSON.stringify(dates)],
    ['dateGoals', JSON.stringify(dateGoals)]
  ]);
};
```

---

## 🎯 Key Features Implemented

### ✅ Completed Features

- [x] Date management (add/remove dates with goals)
- [x] Number input (manual text or URL loading)
- [x] Delay configuration
- [x] Start/Pause/Resume/Stop controls
- [x] Progress tracking with visual bar
- [x] WebView integration with PCARE site
- [x] State persistence (AsyncStorage)
- [x] Multi-date support
- [x] Progress percentage calculation
- [x] Status display (Idle, Running, Paused, Error, Completed)
- [x] Real-time progress updates

### 🚀 Future Enhancements

- [ ] File upload from device storage
- [ ] CSV data import with validation
- [ ] Automation scheduling (background tasks)
- [ ] Advanced error recovery
- [ ] Detailed logs and error history
- [ ] Screenshot capture capability
- [ ] Push notifications on completion
- [ ] Dark mode support
- [ ] Multi-language localization
- [ ] Cloud sync (Firebase)
- [ ] Biometric authentication

---

## 🔌 Component API Reference

### AutomationContext

```typescript
interface AutomationContextType {
  // Data State
  dates: string[];
  dateGoals: Record<string, number>;
  numbers: string[];
  delayMs: number;
  startIndex: number;
  
  // UI State
  status: string;
  progress: { done: number; total: number };
  dateIndex: number;
  isRunning: boolean;
  isPaused: boolean;
  
  // Date Operations
  addDate(date: string, goal: number | string): void;
  removeDate(index: number): void;
  
  // Number Operations
  setNumbers(numbers: string[]): void;
  setNumbersFromText(text: string): void;
  
  // Automation Control
  startAutomation(): void;
  pauseAutomation(): void;
  resumeAutomation(): void;
  stopAutomation(): void;
  nextDate(): void;
  
  // Progress Tracking
  updateProgress(done: number, total: number): void;
  setStatus(status: string): void;
}
```

### Components

**DatePicker.tsx**
- Manages date and goal input
- Displays list of added dates
- Handles add/remove operations

**NumbersInput.tsx**
- Text input for numbers (one per line)
- URL loading for remote data
- File upload placeholder
- Number count display

**Settings.tsx**
- Delay configuration (ms)
- Start index setting
- Configuration validation

**ProgressDisplay.tsx**
- Status indicator
- Current date display
- Progress counter (done/total)
- Visual progress bar with percentage
- Status color coding

**ControlButtons.tsx**
- Start, Pause, Resume, Stop buttons
- Next Date navigation
- Button state management (enabled/disabled)
- WebView script injection

---

## 🚀 Running the App

### Prerequisites
```bash
# Node.js v18+
node --version

# npm package manager
npm --version

# Expo CLI
npm install -g expo-cli
```

### Installation
```bash
cd /Users/graphicdesigner/Documents/PCARE/pcare-Android/bpjs-pcare-mobile
npm install
```

### Running

**Development Mode**:
```bash
# Start Expo server
expo start

# Press 'a' for Android
# Press 'i' for iOS
# Press 'w' for Web
```

**Direct to Android**:
```bash
npm run android
```

**Direct to iOS**:
```bash
npm run ios
```

**Web Version**:
```bash
npm run web
```

---

## 🔧 Customization Guide

### Changing Delay
```typescript
// In app/(tabs)/pcare.tsx
<TextInput
  value={delayMs.toString()}
  onChangeText={(text) => setDelayMs(parseInt(text, 10) || 1200)}
/>
```

### Updating PCARE Form Selectors
```typescript
// In utils/automationUtils.ts - Update these:
const inputs = document.querySelectorAll('input[type="text"]');
// Change selectors to match your PCARE version
```

### Modifying Colors
```typescript
// In each component's StyleSheet:
const styles = StyleSheet.create({
  startBtn: {
    backgroundColor: '#10b981',  // Change this color
  }
});
```

### Adding New Settings
```typescript
// 1. Add to AutomationContext.tsx
const [newSetting, setNewSetting] = useState(defaultValue);

// 2. Create component for it
// components/NewSettingComponent.tsx

// 3. Import in app/(tabs)/pcare.tsx
<NewSettingComponent />
```

---

## 📊 Data Flow Diagram

```
User Input (UI)
    ↓
React Components
    ↓
AutomationContext (State)
    ↓
AsyncStorage (Persistence)
    ↓
WebView JavaScript (Automation)
    ↓
PCARE Website (Forms)
    ↓
Server Response
    ↓
WebView Message Handler
    ↓
Progress Update
    ↓
UI Re-render
```

---

## 🛠️ Development Workflow

### 1. **Local Development**
```bash
expo start --tunnel
```

### 2. **Testing on Device**
```bash
# Scan QR code with Expo Go app
# Or direct Android build
npm run android
```

### 3. **Debugging**
```bash
# React Native Debugger
npm install -g react-native-debugger
react-native-debugger

# Or Chrome DevTools
# Press 'j' in Expo CLI
```

### 4. **Building for Release**
```bash
# Configure EAS
eas build:configure

# Build APK
eas build --platform android --release
```

---

## 🔐 Security Considerations

### Data Storage
- ✅ AsyncStorage for local data (device-only)
- ❌ Not encrypted by default
- 🔒 Consider encryption for sensitive data:
  ```typescript
  import EncryptedStorage from 'react-native-encrypted-storage';
  ```

### WebView Security
- ✅ Only allows PCARE domain
- ✅ JavaScript enabled for automation only
- ⚠️ Verify URLs before loading

### Permissions
- ✅ Internet access (for PCARE)
- ✅ Storage access (for AsyncStorage)
- ⚠️ No camera, location, or contacts access

---

## 📈 Performance Optimization

### Current Optimizations
- ✅ Component memoization
- ✅ Batched AsyncStorage operations
- ✅ Efficient re-renders with Context
- ✅ WebView lazy loading

### Further Optimization Options
```typescript
// Use React.memo for expensive components
export default React.memo(DatePicker);

// Debounce input changes
const debouncedChange = useCallback(
  debounce((text) => setNumbersFromText(text), 300),
  []
);
```

---

## 🚨 Troubleshooting

### Issue: WebView Not Loading
```bash
# Solution: Clear cache
expo start --reset-cache
npm run android -- --reset-cache
```

### Issue: State Not Persisting
```typescript
// Debug AsyncStorage
AsyncStorage.getAllKeys((err, keys) => {
  AsyncStorage.multiGet(keys, (err, stores) => {
    console.log('Stored data:', stores);
  });
});
```

### Issue: Automation Not Working
1. Check PCARE page structure (selectors may have changed)
2. Update form selectors in `automationUtils.ts`
3. Verify network connection
4. Check WebView console for errors

---

## 📱 Platform Support

| Feature | Android | iOS | Web |
|---------|---------|-----|-----|
| Date Management | ✅ | ✅ | ✅ |
| Number Input | ✅ | ✅ | ✅ |
| WebView | ✅ | ✅ | ⚠️ |
| AsyncStorage | ✅ | ✅ | ✅ |
| Automation | ✅ | ✅ | ✅ |
| Notifications | 🚧 | 🚧 | ❌ |

---

## 📚 Learning Resources

### React Native & Expo
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Router Guide](https://docs.expo.dev/routing/introduction/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### State Management
- [React Context API](https://react.dev/reference/react/useContext)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

### WebView
- [react-native-webview](https://github.com/react-native-webview/react-native-webview)

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.2.1 | Feb 2026 | Initial mobile conversion from Chrome extension |
| 1.2.0 | Jan 2026 | Chrome extension enhanced version |
| 1.0.0 | - | Original Chrome extension |

---

## 🤝 Contributing

To improve this app:

1. Fork the project
2. Create feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Submit pull request

---

## 📞 Support

For issues:
1. Check [QUICKSTART.md](./QUICKSTART.md)
2. Review [PCARE_README.md](./PCARE_README.md)
3. Check Expo documentation
4. Test on web version first: `npm run web`

---

## ✅ Conversion Checklist

- [x] Created React Native project with Expo
- [x] Set up TypeScript support
- [x] Created all required components
- [x] Implemented state management with Context
- [x] Migrated storage to AsyncStorage
- [x] Implemented WebView integration
- [x] Created automation script injection
- [x] Added progress tracking
- [x] Implemented control buttons
- [x] Created responsive UI
- [x] Added comprehensive documentation
- [x] Tested component structure
- [x] Verified dependencies installation

---

## 🎉 You're Ready!

The PCARE Chrome Extension has been successfully converted to an Android mobile app using Expo and React Native. All core functionality has been preserved and adapted for mobile platforms.

**Next Steps**:
1. Read [QUICKSTART.md](./QUICKSTART.md) for quick start
2. Run `npm start` to begin development
3. Test on Android emulator
4. Customize as needed
5. Build for production when ready

Happy coding! 🚀

---

**Created**: February 2026  
**Project**: PCARE Helper Mobile  
**Platform**: Android (via Expo)  
**Version**: 1.2.1  
