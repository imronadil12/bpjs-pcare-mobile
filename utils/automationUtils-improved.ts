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

// Improved automation script with better debugging
export const automationScript = `
  console.log('[BOT] Script injected into page');
  
  window.automationState = {
    running: false,
    paused: false,
    currentIndex: 0,
    currentNumber: null,
    totalNumbers: 0,
  };

  window.sendProgress = function(status, done, total, currentNumber) {
    const msg = JSON.stringify({
      type: 'PROGRESS',
      status,
      done,
      total,
      currentNumber
    });
    console.log('[BOT] Sending progress:', msg);
    window.ReactNativeWebView?.postMessage(msg);
  };

  // Find the first non-date text input (for entering numbers)
  window.findMainInputField = function() {
    console.log('[BOT] Searching for input field to fill numbers...');
    
    // Strategy: Look for any visible, enabled text input that is NOT a date field
    const allInputs = document.querySelectorAll('input');
    console.log('[BOT] Found ' + allInputs.length + ' input fields total');
    
    for (let i = 0; i < allInputs.length; i++) {
      const input = allInputs[i];
      
      // Log all inputs for debugging
      const isVisible = input.offsetParent !== null;
      const isDate = input.type === 'date';
      const isReadonly = input.readOnly;
      const isDisabled = input.disabled;
      
      console.log('[BOT] Input[' + i + ']:', {
        name: input.name,
        id: input.id,
        type: input.type,
        visible: isVisible,
        disabled: isDisabled,
        readonly: isReadonly
      });
      
      // Skip if not visible, disabled, or readonly
      if (!isVisible || isDisabled || isReadonly) {
        continue;
      }
      
      // Skip date fields
      if (isDate) {
        continue;
      }
      
      // Skip if name/id contains 'tanggal'
      const name = (input.name || '').toLowerCase();
      const id = (input.id || '').toLowerCase();
      if (name.includes('tanggal') || id.includes('tanggal')) {
        continue;
      }
      
      // This is a good candidate!
      console.log('[BOT] ✓ SELECTED Input[' + i + ']:', {
        name: input.name,
        id: input.id,
        type: input.type
      });
      return input;
    }
    
    console.log('[BOT] ✗ NO INPUT FIELD FOUND!');
    return null;
  };

  window.startAutomation = async function(numbers, date, delay, startIdx) {
    console.log('[BOT] ==========================================');
    console.log('[BOT] AUTOMATION STARTED');
    console.log('[BOT] Numbers count: ' + numbers.length);
    console.log('[BOT] Date: ' + date);
    console.log('[BOT] Delay: ' + delay + 'ms');
    console.log('[BOT] Start index: ' + startIdx);
    console.log('[BOT] ==========================================');
    
    window.automationState.running = true;
    window.automationState.paused = false;
    window.automationState.totalNumbers = numbers.length;

    for (let i = startIdx; i < numbers.length; i++) {
      if (!window.automationState.running) {
        console.log('[BOT] STOPPED by user');
        window.sendProgress('Stopped', i, numbers.length, '');
        break;
      }
      
      if (window.automationState.paused) {
        console.log('[BOT] PAUSED at entry ' + (i + 1));
        await new Promise(r => {
          const checkInterval = setInterval(() => {
            if (!window.automationState.paused) {
              clearInterval(checkInterval);
              r(null);
            }
          }, 100);
        });
        console.log('[BOT] RESUMED');
      }

      const currentNumber = numbers[i];
      window.automationState.currentNumber = currentNumber;
      window.automationState.currentIndex = i;
      
      console.log('[BOT] [' + (i + 1) + '/' + numbers.length + '] Processing: ' + currentNumber);
      window.sendProgress('Processing', i + 1, numbers.length, currentNumber);

      try {
        const inputField = window.findMainInputField();
        
        if (inputField) {
          console.log('[BOT] Clearing field...');
          inputField.value = '';
          
          console.log('[BOT] Setting value to: ' + currentNumber);
          inputField.value = currentNumber;
          
          // Trigger change detection
          inputField.dispatchEvent(new Event('input', { bubbles: true }));
          inputField.dispatchEvent(new Event('change', { bubbles: true }));
          inputField.dispatchEvent(new Event('blur', { bubbles: true }));
          
          console.log('[BOT] ✓ FILLED with: ' + currentNumber);
          window.sendProgress('Filled', i + 1, numbers.length, currentNumber);
        } else {
          console.log('[BOT] ✗ CANNOT FILL - Input field not found!');
          window.sendProgress('Error', i + 1, numbers.length, 'Input field not found');
        }

        // Wait before next entry
        await new Promise(r => setTimeout(r, delay));
      } catch (error) {
        console.error('[BOT] ERROR:', error);
        window.sendProgress('Error', i + 1, numbers.length, String(error));
      }
    }

    window.automationState.running = false;
    console.log('[BOT] COMPLETED');
    window.sendProgress('Completed', numbers.length, numbers.length, 'Done');
  };

  window.pauseAutomation = function() {
    console.log('[BOT] PAUSED');
    window.automationState.paused = true;
  };

  window.resumeAutomation = function() {
    console.log('[BOT] RESUMED');
    window.automationState.paused = false;
  };

  window.stopAutomation = function() {
    console.log('[BOT] STOPPED');
    window.automationState.running = false;
    window.automationState.paused = false;
  };
`;
