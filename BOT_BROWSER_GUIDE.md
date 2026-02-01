# PCARE Bot Browser - Quick Setup Guide

## 🎯 How to Use

### 1. **Start the App**
The app should already be running. If not:
```bash
cd /Users/graphicdesigner/Documents/PCARE/pcare-Android/bpjs-pcare-mobile
npx expo start --web
```
Press `w` to open in browser.

---

## 📱 App Interface

The app is now a **simple browser with bot controls**:

### **Top Section (Browser)**
- **Address Bar**: Shows current URL, edit to navigate
- **Quick Buttons**:
  - 🔐 **Login** - Go to login page
  - 📝 **Entry Form** - Go directly to entry page
  - 🤖 **Bot** - Show/hide bot controls

### **Middle Section (WebView)**
- Full PCARE website browser
- Login manually here
- Navigate normally

### **Bottom Section (Bot Controls - Collapsible)**
- Numbers to enter (one per line or from URL)
- Delay settings (milliseconds between entries)
- Progress tracking
- Control buttons (Start, Pause, Resume, Stop)

---

## 🚀 How to Use the Bot

### **Step 1: Login**
1. Click 🔐 **Login** button
2. Login manually to PCARE website
3. Browser will show PCARE login page

### **Step 2: Go to Entry Form**
1. After login, click 📝 **Entry Form** button
2. Or manually navigate to: `https://pcarejkn.bpjs-kesehatan.go.id/eclaim/EntriDaftarDokkel`

### **Step 3: Open Bot Controls**
1. Click 🤖 **Bot** button to show controls

### **Step 4: Add Numbers**
- Paste numbers in the text area (one per line)
- Or paste a URL to load numbers from a file

### **Step 5: Configure**
- Set **Delay** (1200-2000ms recommended)
- Set **Start Index** (0 to start from beginning)

### **Step 6: Start Automation**
- Click ▶ **Start** button
- Bot will fill each number in the form
- Watch progress at the bottom
- Use Pause/Resume as needed
- Click Stop to cancel

---

## 🔧 What the Bot Does

The bot automatically:
1. ✅ Fills the main number input field
2. ✅ Triggers input events (in case page has listeners)
3. ✅ Waits for the configured delay
4. ✅ Repeats for each number

**Note**: The bot fills the form but does NOT auto-click submit. You may need to:
- Manually click submit for each entry, OR
- Configure the bot to auto-click (edit automationUtils.ts)

---

## 📝 Input Fields the Bot Searches For

The bot looks for these field names in order:
1. `noAsuransi` - Insurance number
2. `nomor` - General number
3. `no_peserta` - Participant number
4. Fields with "nomor" in ID
5. Fields with "noAsuransi" in ID
6. First text input on page

---

## ⚙️ Customization

### **To Enable Auto-Click on Submit Button:**
Edit `utils/automationUtils.ts` and uncomment this section:
```javascript
// Uncomment these lines to auto-click submit:
for (let sel of submitSelectors) {
  const btn = document.querySelector(sel);
  if (btn && btn.offsetParent !== null) {
    btn.click();
    break;
  }
}
```

### **To Change Input Field Selectors:**
Edit `utils/automationUtils.ts` and modify:
```javascript
const selectors = [
  'input[name="noAsuransi"]',      // Change these
  'input[name="nomor"]',           // based on actual
  'input[name="no_peserta"]',      // form fields
  // ... etc
];
```

### **To Adjust Delay:**
In the app, use the "Delay (ms)" input field
- 300-500ms: Very fast (risky, may cause errors)
- 1000-2000ms: Safe and reliable (recommended)
- 3000+ms: Very slow but safest

---

## 🐛 Troubleshooting

### **Bot not filling form**
1. Check if you're on the correct entry page
2. Inspect element (right-click → Inspect) to find correct input field names
3. Update selectors in `utils/automationUtils.ts`
4. Restart app

### **Form not submitting after filling**
1. Check if auto-click is enabled
2. Or manually click submit button for each entry
3. Or adjust the automation script

### **Numbers not appearing**
1. Check the input field name/selector
2. Open browser console (press `j` in Expo)
3. Check for JavaScript errors
4. Verify the page has loaded completely

### **App slow or freezing**
1. Increase delay time
2. Reduce number of items to process
3. Restart the app: Press `r` in Expo terminal

---

## 💡 Tips

- **Test first**: Add 1-2 numbers and test before adding many
- **Monitor**: Watch the progress bar to ensure automation is working
- **Save work**: Data is auto-saved, so you can pause and resume later
- **Manual control**: You still have full browser access to manually do things
- **Debug**: Press `j` in Expo to open browser debugger for troubleshooting

---

## 📞 Keyboard Shortcuts (in Expo terminal)

While the app is running:
- `w` - Reload web view
- `r` - Reload app
- `j` - Open debugger
- `m` - Show menu
- `Ctrl+C` - Stop server

---

## 🎯 Example Usage

```
1. Start: npm run web (or already running)
2. Browser loads PCARE login page
3. You login manually
4. Click "Entry Form" to go to entry page
5. Click "Bot" to show controls
6. Paste numbers: 123, 456, 789, etc.
7. Set Delay: 1500 ms
8. Click Start
9. Bot fills each number automatically
10. Manually click submit for each (or enable auto-click)
11. Repeat or Stop as needed
```

---

## 🌐 Direct URLs

- **Login**: https://pcarejkn.bpjs-kesehatan.go.id/
- **Entry Form**: https://pcarejkn.bpjs-kesehatan.go.id/eclaim/EntriDaftarDokkel
- **Main Site**: https://pcarejkn.bpjs-kesehatan.go.id/

You can paste these directly into the address bar.

---

## ✅ Features

- ✅ Full browser access to PCARE
- ✅ Manual login required (you maintain control)
- ✅ Bot automation for form filling
- ✅ Progress tracking
- ✅ Pause/Resume capability
- ✅ Configurable delay
- ✅ Data persistence
- ✅ Works on Web, Android, iOS

---

**Ready to use! Open the app and start automating!** 🚀
