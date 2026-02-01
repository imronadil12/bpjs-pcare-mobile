# PCARE Android App - Quick Start Guide

## 🚀 Getting Started

### 1. First Time Setup

```bash
# Navigate to project directory
cd /Users/graphicdesigner/Documents/PCARE/pcare-Android/bpjs-pcare-mobile

# Install dependencies (already done, but ensure all packages are installed)
npm install

# Verify installation
npm ls react-native-webview @react-native-async-storage/async-storage
```

### 2. Start Development Server

```bash
# Start the Expo development server
npm start

# Or use expo directly
expo start

# Press 'a' to open Android emulator
# Press 'i' to open iOS simulator
# Press 'w' to open web browser
```

### 3. Building for Android

#### Option A: Development APK
```bash
# Generate development build
eas build --platform android --profile preview
```

#### Option B: Production APK
```bash
# Generate production build for release
eas build --platform android --profile production
```

#### Option C: Local Build (Fastest)
```bash
# Build and run on connected device/emulator
npm run android
```

## 📱 App Navigation

The app has a bottom tab navigation:

1. **Home Tab** (🏠)
   - Application info and overview
   
2. **PCARE Tab** (🤖) - Main Feature
   - Date management
   - Number input
   - Settings
   - Progress tracking
   - Control buttons
   - WebView for PCARE website

3. **Explore Tab** (✈️)
   - Additional exploration features

## ⚙️ File Structure Overview

```
bpjs-pcare-mobile/
├── app/                          # Expo Router screens
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab layout
│   │   ├── index.tsx            # Home screen
│   │   ├── pcare.tsx            # PCARE automation screen (MAIN)
│   │   └── explore.tsx          # Explore screen
│   └── _layout.tsx              # Root layout with context provider
│
├── components/                   # Reusable React components
│   ├── DatePicker.tsx           # Date selection component
│   ├── NumbersInput.tsx         # Number input with URL loading
│   ├── Settings.tsx             # Delay & index settings
│   ├── ProgressDisplay.tsx      # Progress visualization
│   └── ControlButtons.tsx       # Automation control buttons
│
├── context/                      # React Context for state management
│   └── AutomationContext.tsx    # Global automation state
│
├── utils/                        # Utility functions
│   └── automationUtils.ts       # Automation logic & helpers
│
├── package.json                 # Dependencies
├── app.json                      # Expo config
├── tsconfig.json               # TypeScript config
└── PCARE_README.md             # Detailed documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file if needed:
```bash
PCARE_URL=https://pcarejkn.bpjs-kesehatan.go.id/
```

### App Manifest (app.json)

Already configured with:
- App name: "PCARE Helper"
- Version: 1.2.1
- Platforms: Android & iOS
- Plugins: WebView & AsyncStorage

## 🎯 Main Features Usage

### Adding Dates

1. Go to **PCARE** tab
2. Enter date in format: `YYYY-MM-DD`
3. Enter target goal (number)
4. Click **Add**
5. See date appear in the list below

### Adding Numbers

1. **Option A**: Paste directly
   - Paste numbers one per line in the text area
   
2. **Option B**: Load from URL
   - Paste URL to a text file
   - Click **Load** button
   - Numbers load automatically

### Configuring Automation

1. Set **Delay (ms)**: 1200-2000 recommended
2. Set **Start Index**: 0 for new batch, or number to resume
3. Ensure at least one date and number is added

### Running Automation

1. Click **▶ Start** - Begin automation
2. Click **⏸ Pause** - Temporarily pause
3. Click **▶️ Resume** - Resume from pause
4. Click **⏹ Stop** - Stop completely
5. Click **→ Next Date** - Move to next date

### Monitoring Progress

- **Status**: Shows current state (Running, Paused, Idle, etc.)
- **Date**: Current date being processed
- **Progress**: Done / Total count
- **Progress Bar**: Visual percentage indicator

## 🐛 Troubleshooting

### WebView Not Loading PCARE Website

**Solution**:
```bash
# Check internet connection
# Clear app cache:
adb shell pm clear com.pcare.helper

# Reinstall app:
npm run android
```

### Automation Not Filling Form

**Check**:
1. Is PCARE website fully loaded in WebView?
2. Are the form field selectors correct?
3. Check browser console for JavaScript errors

**Fix**:
- Edit `utils/automationUtils.ts`
- Update form field selectors to match current PCARE version
- Re-inject the script

### App Crashes on Startup

**Solution**:
```bash
# Clear cache and reinstall
npm run android -- --reset-cache
# Or
expo start --reset-cache
```

### AsyncStorage Not Persisting

**Check**:
- App permissions for storage
- Device storage space availability

**Fix**:
```bash
adb shell pm grant com.pcare.helper android.permission.READ_EXTERNAL_STORAGE
adb shell pm grant com.pcare.helper android.permission.WRITE_EXTERNAL_STORAGE
```

## 📊 Development Tools

### Debug WebView
```javascript
// Access WebView console in your Expo app
// Press 'w' for web version and check browser console
```

### Check State Management
```javascript
// View Context state in React DevTools
// Use Expo CLI to inspect component tree
```

### Monitor Network
```bash
# Use Expo Network logging
expo start --tunnel
```

## 📦 Building for Production

### Step 1: Update Version
```json
// In app.json and package.json
{
  "version": "1.2.1"
}
```

### Step 2: Build APK
```bash
# Setup EAS if not done
eas build:configure

# Build for production
eas build --platform android --profile production
```

### Step 3: Generate for Google Play
```bash
# Build for Google Play Store
eas build --platform android --release
```

## 📚 API Reference

### Automation Context

```typescript
// Access from any component
const context = useContext(AutomationContext);

// Available methods
context.addDate(date, goal)           // Add new date
context.removeDate(index)             // Remove date by index
context.setNumbers(numbers)           // Set numbers array
context.startAutomation()             // Start automation
context.pauseAutomation()             // Pause automation
context.resumeAutomation()            // Resume automation
context.stopAutomation()              // Stop automation
context.nextDate()                    // Move to next date
```

### Utility Functions

```typescript
import { 
  parseNumbers, 
  loadFromUrl, 
  getProgressPercentage,
  automationScript 
} from '@/utils/automationUtils';

parseNumbers(text)                    // Parse text to number array
await loadFromUrl(url)                // Load numbers from URL
getProgressPercentage(done, total)   // Calculate percentage
// automationScript is injected into WebView
```

## 🔐 Security Considerations

1. **No Data Encryption**: Currently stores data in plain AsyncStorage
   - For sensitive data, implement encryption
   
2. **WebView Security**:
   - Only allows PCARE domain by default
   - Verify URLs before loading

3. **Local Storage**:
   - Data stored locally on device
   - Not synced to cloud

## 🚦 Performance Optimization

### Reduce Automation Delay
```typescript
// Faster automation (use 300-500ms minimum)
setDelayMs(500);
```

### Optimize Rendering
- Components are already optimized with React.memo
- Avoid unnecessary re-renders with proper Context usage

### Memory Management
- WebView automatically manages memory
- AsyncStorage operations are batched

## 📞 Support Resources

1. **Expo Documentation**: https://docs.expo.dev/
2. **React Native**: https://reactnative.dev/
3. **PCARE Website**: https://pcarejkn.bpjs-kesehatan.go.id/
4. **React Context API**: https://react.dev/reference/react/useContext

## ✅ Checklist for First Run

- [ ] Node.js installed (v18+)
- [ ] Project dependencies installed (`npm install`)
- [ ] Expo CLI available (`expo start`)
- [ ] Android emulator or device ready
- [ ] PCARE website accessible
- [ ] Date format understood (YYYY-MM-DD)
- [ ] Number input format understood (one per line)
- [ ] Delay setting adjusted (1200-2000ms recommended)

## 🎓 Next Steps

1. **Test** the app on Android emulator/device
2. **Add** sample dates and numbers
3. **Monitor** automation with progress display
4. **Adjust** delay based on network speed
5. **Customize** form selectors if needed
6. **Build** APK for distribution

---

**Happy Automating! 🤖**

For detailed documentation, see `PCARE_README.md`
