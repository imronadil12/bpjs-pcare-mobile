# PCARE Helper Mobile App

This is a React Native/Expo mobile application that converts the PCARE Chrome extension into an Android app for automating BPJS PCARE input.

## Overview

The PCARE Helper app automates data entry on the BPJS PCARE website (https://pcarejkn.bpjs-kesehatan.go.id/) with features including:

- ✅ Date management with custom goals
- ✅ Bulk number input (one per line or from URL)
- ✅ Configurable delay between submissions
- ✅ Start/Pause/Resume/Stop controls
- ✅ Real-time progress tracking
- ✅ Persistent state storage using AsyncStorage
- ✅ Integrated WebView for PCARE access
- ✅ Multi-date automation support

## Features

### 1. Date Management
- Add dates with goals (target count per date)
- View all added dates with their respective goals
- Remove dates as needed
- Automatic date tracking

### 2. Number Input
- Paste numbers directly (one per line)
- Load numbers from a URL
- Real-time count display
- File upload support (future enhancement)

### 3. Automation Settings
- Configurable delay between submissions (milliseconds)
- Set start index to resume from specific position
- Flexible delay adjustment for optimal performance

### 4. Progress Tracking
- Real-time status display (Idle, Running, Paused, Completed, Error)
- Progress bar with percentage
- Current date indicator
- Done/Total counter

### 5. Control Panel
- **Start**: Begin automation with current settings
- **Pause**: Temporarily stop automation
- **Resume**: Continue paused automation
- **Stop**: Completely stop automation and reset
- **Next Date**: Move to next date in the queue

### 6. WebView Integration
- Direct access to PCARE website within the app
- Automated form filling via injected JavaScript
- Seamless integration with automation controls

## Project Structure

```
bpjs-pcare-mobile/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation setup
│   │   ├── index.tsx            # Home screen
│   │   ├── pcare.tsx            # PCARE main screen
│   │   └── explore.tsx          # Explore screen
│   ├── _layout.tsx              # Root layout with AutomationProvider
│   └── modal.tsx                # Modal screen
├── components/
│   ├── DatePicker.tsx           # Date input component
│   ├── NumbersInput.tsx         # Numbers input component
│   ├── Settings.tsx             # Delay & index settings
│   ├── ProgressDisplay.tsx      # Progress visualization
│   └── ControlButtons.tsx       # Control panel buttons
├── context/
│   └── AutomationContext.tsx    # Global state management
├── utils/
│   └── automationUtils.ts       # Automation logic & helpers
└── package.json
```

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **WebView**: react-native-webview
- **HTTP Requests**: Fetch API

## Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Additional packages** (already included):
   ```bash
   npm install react-native-webview @react-native-async-storage/async-storage date-fns
   ```

## Usage

### Running the App

#### Android (Emulator or Device)
```bash
npm run android
```

#### iOS (macOS only)
```bash
npm run ios
```

#### Web (Browser)
```bash
npm run web
```

#### Development Server
```bash
npx expo start
```

Then press:
- `a` for Android
- `i` for iOS
- `w` for Web

### Using the App

1. **Add Dates**:
   - Go to PCARE tab
   - Enter date (YYYY-MM-DD format)
   - Enter goal (target count)
   - Click "Add"

2. **Add Numbers**:
   - Enter numbers in the text area (one per line)
   - Or paste a URL to load from external source
   - Click "Load" to fetch from URL

3. **Configure Settings**:
   - Set Delay (milliseconds between submissions)
   - Set Start Index (if resuming from a specific position)

4. **Start Automation**:
   - Click "Start" to begin
   - Monitor progress in the Progress Display
   - Use Pause/Resume to control flow
   - Click "Next Date" to move to the next date
   - Click "Stop" to end automation

## State Persistence

All data is automatically saved to AsyncStorage:
- Dates and goals
- Numbers list
- Delay setting
- Start index
- Progress information
- Current date index

Data persists across app sessions.

## WebView Automation

The app injects JavaScript into the PCARE WebView to automate:
- Form field detection and filling
- Button clicks
- Delay management
- Progress reporting back to React Native

The injected script includes:
- `window.startAutomation()` - Start automation
- `window.pauseAutomation()` - Pause automation
- `window.resumeAutomation()` - Resume automation
- `window.stopAutomation()` - Stop automation
- `window.sendProgress()` - Report progress

## Customization

### Modifying PCARE Form Selectors

Edit `utils/automationUtils.ts` to customize form field selectors:

```typescript
const inputs = document.querySelectorAll('input[type="text"], input[type="number"]');
// Customize these selectors for your PCARE form version
```

### Styling

All styles are defined with React Native StyleSheet in each component:
- `components/DatePicker.tsx`
- `components/NumbersInput.tsx`
- `components/Settings.tsx`
- `components/ProgressDisplay.tsx`
- `components/ControlButtons.tsx`

### Delay Adjustment

Fine-tune the delay for optimal automation speed based on:
- Network speed
- Server response time
- Form processing time

Recommended: 1000-2000ms

## Troubleshooting

### WebView not loading
- Check internet connection
- Verify PCARE URL is accessible
- Check for mixed content (http/https) issues

### Automation not filling form
- Verify form selectors in `automationUtils.ts`
- Check WebView console for JavaScript errors
- Ensure PCARE page structure matches expected selectors

### Progress not updating
- Check AsyncStorage permissions
- Verify WebView message handling
- Check browser console for errors

## Performance Tips

1. **Reduce Delay**: For faster automation (minimum 300ms recommended)
2. **Batch Process**: Split large number lists into multiple dates
3. **Network**: Use stable connection for consistent results
4. **Battery**: Set appropriate delays to avoid rapid submissions

## Future Enhancements

- [ ] File upload from device storage
- [ ] CSV import with data validation
- [ ] Automation scheduling
- [ ] Error recovery and retry logic
- [ ] Detailed logs and error history
- [ ] PCARE page screenshot capture
- [ ] Notification alerts on completion
- [ ] Dark mode support
- [ ] Multi-language support

## API Documentation

### AutomationContext

```typescript
interface AutomationContextType {
  // State
  dates: string[];
  dateGoals: Record<string, number>;
  numbers: string[];
  delayMs: number;
  startIndex: number;
  status: string;
  progress: { done: number; total: number };
  dateIndex: number;
  isRunning: boolean;
  isPaused: boolean;

  // Setters
  setDates(dates: string[]): void;
  setDateGoals(goals: Record<string, number>): void;
  setNumbers(numbers: string[]): void;
  setDelayMs(delay: number): void;
  setStartIndex(index: number): void;
  setStatus(status: string): void;
  updateProgress(done: number, total: number): void;
  setDateIndex(index: number): void;

  // Actions
  addDate(date: string, goal: number | string): void;
  removeDate(index: number): void;
  startAutomation(): void;
  pauseAutomation(): void;
  resumeAutomation(): void;
  stopAutomation(): void;
  nextDate(): void;
}
```

### Utility Functions

```typescript
// Automation utilities
export const sleep(ms: number): Promise<void>;
export const withTimeout(promise: Promise<any>, ms: number, label: string): Promise<any>;
export const automationScript: string;
export const parseNumbers(text: string): string[];
export const loadFromUrl(url: string): Promise<string[]>;
export const formatDate(dateStr: string): string;
export const getProgressPercentage(done: number, total: number): number;
```

## License

This project is converted from the PCARE Chrome Extension for mobile use.

## Support

For issues or questions, check:
1. PCARE website: https://pcarejkn.bpjs-kesehatan.go.id/
2. Expo documentation: https://docs.expo.dev/
3. React Native docs: https://reactnative.dev/

## Contributing

Feel free to fork and contribute improvements!

---

**Version**: 1.2.1
**Last Updated**: February 2026
**Platform**: Android (via Expo)
