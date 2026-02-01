# Bot Debugging & Usage Guide

## Quick Start

1. **Open app**: http://localhost:8082
2. **Login**: Click 🔐 Login → manually enter PCARE credentials
3. **Go to form**: Click 📝 Entry Form
4. **Show bot**: Click 🤖 Bot
5. **Add data**:
   - Enter a date in Tanggal (Date) field
   - Paste/enter numbers in Numbers field (one per line)
   - Set Delay (default 1200ms = 1.2 seconds)
6. **Start**: Click ▶ Start

---

## How Bot Works (Based on PCARE Form)

The bot is designed to automate filling the PCARE entry form:

1. **Finds "No. Pencarian" input** - The main number field
2. **Enters each number** - One at a time
3. **Clicks "Cari" button** - Searches for the number
4. **Waits** - Specified delay before next number
5. **Repeats** - Until all numbers are entered

---

## Expected Console Output

When bot is running, open DevTools (F12) → Console and look for `[BOT]` messages:

```
[BOT] Script injected
[BOT] START: numbers=3, date=2024-01-15, delay=1200
[BOT] [1/3]: 12345678901
[BOT] Entering number: 12345678901
[BOT] Found by label
[BOT] Clicked Cari
[BOT] ✓ Entry 1 complete
[BOT] [2/3]: 98765432109
...
[BOT] COMPLETED
```

---

## Auto-Save Feature ✓

All settings automatically save to device storage:
- ✅ Dates and goals
- ✅ Numbers list
- ✅ Delay setting
- ✅ Start index

**Restore on**: App restart (works offline)

---

## Troubleshooting

### Issue: No `[BOT]` messages in console

**Solution**:
1. Make sure you're on the PCARE form page
2. Open DevTools (F12)
3. Click Start
4. Look for ANY `[BOT]` text in console
5. If nothing appears, the script didn't inject

### Issue: `[BOT] ERROR: Could not find input field`

**This means** the "No. Pencarian" field wasn't found

**Solutions**:
1. **Inspect the page**:
   - Right-click the number input field
   - Select "Inspect Element"
   - Tell me the field's `name` or `id` attribute

2. **Common field names** the bot searches for:
   - Label text: "No. Pencarian"
   - Input name: `name="*pencarian*"` (case-insensitive)
   - Input id: `id="*pencarian*"`

### Issue: Cari button not found

**The bot will continue anyway** - it enters the number and waits

If critical:
1. Check the button's text (should say "Cari")
2. Right-click → Inspect
3. Tell me the button's class/id

### Issue: Bot fills wrong field or stops

**Most likely**: Form structure changed on PCARE page

**Solution**: 
1. Take a screenshot showing the form
2. Show me the field names by inspecting
3. I'll update bot selectors

---

## Manual Testing

To test bot without automation:

1. Open PCARE form
2. Manually find and click the "No. Pencarian" field
3. Enter a number
4. Click "Cari"
5. Confirm it works

Then tell me:
- Which field you clicked
- What happened when you clicked Cari

This helps me understand if bot logic is correct vs field naming issue.

---

## Performance Tips

- **Delay setting**: Higher = safer, Lower = faster
  - Too low (< 500ms): May miss loading/validation
  - Recommended: 1200-2000ms
  - Very safe: 3000ms+

- **Start Index**: Skip previously entered numbers
  - If bot crashed at #50, set Start Index to 50
  - Bot will continue from there

---

## Settings Persistence

### Saved Automatically
- Dates list
- Numbers list
- Delay milliseconds
- Start index
- Current date index

### Saved On Exit
- Progress counter
- Last status

### Cleared When
- User clears dates/numbers manually
- User resets with Clear button (if added)

---

## Advanced: Understanding the Bot Script

The bot runs JavaScript directly in the PCARE webpage:

```javascript
// 1. Search for input field
const input = label.closest('.form-group')?.querySelector('input');

// 2. Enter number
input.value = '12345678901';
input.dispatchEvent(new Event('input', { bubbles: true }));

// 3. Find and click "Cari" button
button.innerText.trim() === 'Cari' ? button.click() : skip;

// 4. Wait before next entry
await sleep(1200);
```

This matches the Chrome extension's `content.js` logic.

---

## Debug Checklist

Before reporting an issue:

- [ ] Confirmed you're logged into PCARE
- [ ] Confirmed you're on the entry form page
- [ ] Added at least 2-3 test numbers
- [ ] Set delay to 2000ms (slow to see what's happening)
- [ ] Opened DevTools console before clicking Start
- [ ] Took screenshot of form with field highlighted (inspect)
- [ ] Copied full console output with `[BOT]` messages

---

## Report Template

If bot isn't working:

**What you did**:
- [ ] Logged in to PCARE
- [ ] Went to entry form
- [ ] Entered X numbers
- [ ] Clicked Start

**What happened**:
- Console shows: [paste first 10 lines of [BOT] messages]
- Form action: [describe - did field get filled? did button click?]
- Error message: [if any]

**Screenshot**:
- [Attach screenshot showing form fields]
- [Right-click inspect the number field - copy the HTML tag]

---

## Known Limitations

1. **Single form only** - Bot fills one field at a time, then waits
2. **No modal handling** - If modal appears, bot may pause
3. **No validation** - Assumes PCARE form accepts numbers as-is
4. **Manual login** - Must log in first, can't automate credentials

---

## Next Steps

1. **First run**: Add 2 test numbers, click Start, watch console
2. **If it works**: Increase batch size, adjust delay
3. **If error**: Open DevTools, tell me the `[BOT]` message and field names

