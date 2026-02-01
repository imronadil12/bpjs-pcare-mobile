// Utility function to simulate delays
export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

// Helper to add timeout to async functions
export function withTimeout(promise: Promise<any>, ms: number, label: string) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms: ${label}`)), ms))
  ]);
}

// Simulate automation logic that would run in WebView
// Based on actual PCARE Chrome extension structure
export const automationScript = `
  console.log('[BOT] Script injected');
  
  window.automationState = {
    running: false,
    paused: false,
    currentIndex: 0,
    currentNumber: null,
    totalNumbers: 0,
  };

  window.sendProgress = function(status, done, total, currentNumber) {
    try {
      window.ReactNativeWebView?.postMessage(JSON.stringify({
        type: 'PROGRESS',
        status,
        done,
        total,
        currentNumber
      }));
    } catch (e) {
      console.log('[BOT] Progress error:', e);
    }
  };

  window.sleep = function(ms) {
    return new Promise(r => setTimeout(r, ms));
  };

  window.setDateField = function(dateISO) {
    console.log('[BOT] Setting date field to:', dateISO);
    
    // Try to find date input by ID
    const dateInputById = document.querySelector('#txttanggal');
    if (dateInputById) {
      dateInputById.value = dateISO;
      dateInputById.dispatchEvent(new Event('input', { bubbles: true }));
      dateInputById.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('[BOT] ✓ Date set via ID');
      return true;
    }
    
    // Try to find by name
    const dateInputByName = document.querySelector('input[name="tanggal"]');
    if (dateInputByName) {
      dateInputByName.value = dateISO;
      dateInputByName.dispatchEvent(new Event('input', { bubbles: true }));
      dateInputByName.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('[BOT] ✓ Date set via name');
      return true;
    }
    
    // Try to find by label
    const labels = document.querySelectorAll('label');
    for (let label of labels) {
      if (label.innerText && (label.innerText.includes('Tanggal') || label.innerText.includes('tanggal'))) {
        const dateInput = label.closest('.form-group')?.querySelector('input[type="date"]') ||
                         label.parentElement?.querySelector('input[type="date"]');
        if (dateInput) {
          dateInput.value = dateISO;
          dateInput.dispatchEvent(new Event('input', { bubbles: true }));
          dateInput.dispatchEvent(new Event('change', { bubbles: true }));
          console.log('[BOT] ✓ Date set via label');
          return true;
        }
      }
    }
    
    console.log('[BOT] Date field not found');
    return false;
  };

  window.inputNoPencarian = async function(nomor) {
    console.log('[BOT] Entering number:', nomor);
    
    // Strategy 1: Find by label "No. Pencarian"
    const labels = document.querySelectorAll('label');
    for (let label of labels) {
      if (label.innerText && label.innerText.includes('Pencarian')) {
        const input = label.closest('.form-group')?.querySelector('input') || 
                     label.parentElement?.querySelector('input');
        if (input) {
          console.log('[BOT] Found by label');
          input.value = '';
          input.focus();
          input.value = nomor;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
      }
    }
    
    // Strategy 2: Try common input selectors
    const selectors = [
      'input[name*="pencarian" i]',
      'input[name*="nomor" i]',
      'input[id*="pencarian" i]',
      'input[type="text"]:not([readonly])',
    ];
    
    for (let selector of selectors) {
      const inputs = document.querySelectorAll(selector);
      for (let input of inputs) {
        if (input.offsetParent !== null && !input.disabled && input.type !== 'date') {
          const name = (input.name || '').toLowerCase();
          const id = (input.id || '').toLowerCase();
          if (name.includes('tanggal') || id.includes('tanggal')) continue;
          
          console.log('[BOT] Found by selector:', selector);
          input.value = nomor;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
      }
    }
    
    console.log('[BOT] ERROR: Could not find input field');
    return false;
  };

  window.clickCari = function() {
    console.log('[BOT] Looking for Cari button');
    const buttons = document.querySelectorAll('button, input[type="button"]');
    for (let btn of buttons) {
      if (btn.innerText && btn.innerText.trim() === 'Cari') {
        console.log('[BOT] Clicked Cari');
        btn.click();
        return true;
      }
    }
    console.log('[BOT] Cari button not found');
    return false;
  };

  window.startAutomation = async function(numbers, date, delay, startIdx) {
    console.log('[BOT] START: numbers=' + numbers.length + ', date=' + date + ', delay=' + delay);
    
    window.automationState.running = true;
    window.automationState.paused = false;
    window.automationState.totalNumbers = numbers.length;

    // Set date field once at the beginning
    if (date) {
      console.log('[BOT] Setting date to:', date);
      window.setDateField(date);
      await window.sleep(300);
    }

    for (let i = startIdx; i < numbers.length; i++) {
      if (!window.automationState.running) {
        console.log('[BOT] STOPPED');
        break;
      }
      
      if (window.automationState.paused) {
        console.log('[BOT] PAUSED');
        await new Promise(r => {
          const chk = setInterval(() => {
            if (!window.automationState.paused) {
              clearInterval(chk);
              r(null);
            }
          }, 100);
        });
      }

      const num = numbers[i];
      console.log('[BOT] [' + (i + 1) + '/' + numbers.length + ']: ' + num);
      window.sendProgress('Processing', i + 1, numbers.length, num);

      try {
        // Clear any popups
        document.querySelectorAll('.bootbox.modal, .modal-backdrop').forEach(e => e.remove());
        
        // Input the number
        const inputted = await window.inputNoPencarian(num);
        if (!inputted) {
          console.log('[BOT] Failed to input');
          window.sendProgress('Error', i + 1, numbers.length, 'Failed to input');
          await window.sleep(delay);
          continue;
        }
        
        await window.sleep(300);
        
        // Click Cari button
        const cariClicked = window.clickCari();
        if (!cariClicked) {
          console.log('[BOT] Cari button not found');
        }
        
        await window.sleep(delay);
        console.log('[BOT] ✓ Entry ' + (i + 1) + ' complete');
        window.sendProgress('Filled', i + 1, numbers.length, num);
      } catch (error) {
        console.error('[BOT] Error:', error);
        window.sendProgress('Error', i + 1, numbers.length, String(error));
        await window.sleep(delay);
      }
    }

    window.automationState.running = false;
    console.log('[BOT] COMPLETED');
    window.sendProgress('Completed', numbers.length, numbers.length, 'Done');
  };

  window.pauseAutomation = function() {
    window.automationState.paused = true;
  };

  window.resumeAutomation = function() {
    window.automationState.paused = false;
  };

  window.stopAutomation = function() {
    window.automationState.running = false;
  };
`;

// Parse numbers from text (one per line)
export const parseNumbers = (text: string): string[] => {
  return text
    .split('\n')
    .map(n => n.trim())
    .filter(n => n.length > 0);
};

// Load URL and extract numbers (for URL input feature)
export const loadFromUrl = async (url: string): Promise<string[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    return parseNumbers(text);
  } catch (error: any) {
    throw new Error(`Failed to load from URL: ${error.message}`);
  }
};

// Calculate progress percentage
export const getProgressPercentage = (done: number, total: number): number => {
  return total === 0 ? 0 : Math.round((done / total) * 100);
};
