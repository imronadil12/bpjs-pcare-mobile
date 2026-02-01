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

// Format ISO date to DD-MM-YYYY format (matching extension approach)
function formatISODateForDisplay(isoDateStr: string): string {
  try {
    const date = new Date(isoDateStr);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return isoDateStr;
  }
}

// Advanced automation script with extension-like features
export const automationScript = `
  console.log('[BOT] Script injected - Advanced Bot v2');
  
  // Performance optimization: Cache DOM queries
  const selectorCache = {};
  
  // Advanced automation state management
  window.automationState = {
    running: false,
    paused: false,
    currentIndex: 0,
    currentDate: null,
    currentNumber: null,
    totalNumbers: 0,
    errorCount: 0,
    successCount: 0,
    maxRetries: 3,
  };

  // Cached query selector for performance
  window.cachedQuery = function(selector, forceRefresh = false) {
    if (!forceRefresh && selectorCache[selector]) {
      return selectorCache[selector];
    }
    const result = document.querySelector(selector);
    selectorCache[selector] = result;
    return result;
  };

  // Send progress with detailed info matching extension
  window.sendProgress = function(status, done, total, currentNumber, currentDate) {
    try {
      window.ReactNativeWebView?.postMessage(JSON.stringify({
        type: 'PROGRESS',
        status,
        done,
        total,
        currentNumber,
        currentDate,
        timestamp: Date.now(),
        errorCount: window.automationState.errorCount,
        successCount: window.automationState.successCount
      }));
    } catch (e) {
      console.error('[BOT] Progress error:', e);
    }
  };

  window.sleep = function(ms) {
    return new Promise(r => setTimeout(r, ms));
  };

  // Format ISO date to DD-MM-YYYY (matching extension)
  window.formatISODateForDisplay = function(isoDateStr) {
    try {
      const date = new Date(isoDateStr);
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();
      return day + '-' + month + '-' + year;
    } catch (e) {
      console.warn('[BOT] Date format error:', e);
      return isoDateStr;
    }
  };

  window.setDateField = function(dateISO) {
    console.log('[BOT] Setting date field to:', dateISO);
    
    // Convert YYYY-MM-DD to DD-MM-YYYY format (robust Date parsing)
    const dateFormatted = window.formatISODateForDisplay(dateISO);
    
    // Try cached ID first
    const dateInputById = window.cachedQuery('#txttanggal', true);
    if (dateInputById) {
      dateInputById.value = '';
      dateInputById.focus();
      dateInputById.value = dateFormatted;
      dateInputById.dispatchEvent(new Event('input', { bubbles: true }));
      dateInputById.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('[BOT] Date set via ID:', dateFormatted);
      return true;
    }
    
    // Try by name
    const dateInputByName = window.cachedQuery('input[name="tanggal"]', true);
    if (dateInputByName) {
      dateInputByName.value = '';
      dateInputByName.focus();
      dateInputByName.value = dateFormatted;
      dateInputByName.dispatchEvent(new Event('input', { bubbles: true }));
      dateInputByName.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('[BOT] Date set via name:', dateFormatted);
      return true;
    }
    
    console.error('[BOT] Date field not found');
    return false;
  };
  // Clear popups and modals
  window.clearPopups = function() {
    document.querySelectorAll('.bootbox.modal, .modal-backdrop').forEach(e => e.remove());
    document.body.classList.remove('modal-open');
    console.log('[BOT] ✓ Cleared popups');
  };

  // Handle Update NIK modal
  window.handleUpdateNIKModal = async function() {
    await window.sleep(400);
    const modal = document.querySelector('#updateNIK_modal');
    if (!modal) return;
    
    const cancelBtn = modal.querySelector('#batalNIKSubmit_btn');
    if (cancelBtn) {
      cancelBtn.click();
      console.log('[BOT] ✓ Closed NIK modal');
    }
    await window.sleep(300);
  };

  // Select form options (matching extension)
  window.selectOptions = async function() {
    // Click Kunjungan Sehat
    try {
      window.clickRadio('Kunjungan Sehat');
      console.log('[BOT] Selected Kunjungan Sehat');
    } catch (e) {
      console.warn('[BOT] Kunjungan Sehat not found:', e);
    }

    // Click Rawat Jalan
    try {
      window.clickRadio('Rawat Jalan');
      console.log('[BOT] Selected Rawat Jalan');
    } catch (e) {
      console.warn('[BOT] Rawat Jalan not found:', e);
    }

    // Set Poli to 021
    try {
      const poli = document.querySelector('#poli');
      if (poli) {
        poli.value = '021';
        poli.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('[BOT] Set poli to 021');
      }
    } catch (e) {
      console.warn('[BOT] Poli field not found:', e);
    }

    // Click Save button
    try {
      const saveBtn = document.querySelector('#btnSimpanPendaftaran');
      if (saveBtn) {
        saveBtn.click();
        console.log('[BOT] Clicked Save button');
      }
    } catch (e) {
      console.error('[BOT] Error clicking save:', e);
    }
  };

  window.clickRadio = function(text) {
    const label = [...document.querySelectorAll('label')]
      .find(l => l.innerText && l.innerText.includes(text));
    
    if (!label) {
      console.warn('[BOT] Label "' + text + '" not found');
      return;
    }
    
    const radio = label.querySelector('input');
    if (!radio) {
      console.warn('[BOT] Radio input for "' + text + '" not found');
      return;
    }
    
    radio.click();
    console.log('[BOT] Clicked radio:', text);
  };

  window.inputNoPencarian = async function(nomor) {
    // Strategy 1: Find by label "No. Pencarian" (matches extension exactly)
    const label = [...document.querySelectorAll('label')]
      .find(l => l.innerText && l.innerText.includes('No. Pencarian'));
    
    if (label) {
      const input = label.closest('.form-group')?.querySelector('input') || 
                   label.parentElement?.querySelector('input');
      if (input) {
        input.value = '';
        input.focus();
        input.value = nomor;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('[BOT] Number entered via label:', nomor);
        return true;
      }
    }
    
    // Strategy 2: Try fallback selectors
    const selectors = ['input[name="txtnomor"]', 'input[name="nomor"]', '#txtnomor'];
    for (let selector of selectors) {
      const input = document.querySelector(selector);
      if (input && input.offsetParent !== null && !input.disabled) {
        input.value = '';
        input.focus();
        input.value = nomor;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('[BOT] Number entered via selector:', selector);
        return true;
      }
    }
    
    console.error('[BOT] No. Pencarian input not found');
    throw 'No. Pencarian not found';
  };

  window.clickCari = function() {
    // Find button by exact text match (matching extension)
    const button = [...document.querySelectorAll('button')]
      .find(b => b.innerText && b.innerText.trim() === 'Cari');
    
    if (!button) {
      console.error('[BOT] Cari button not found');
      throw 'Cari button not found';
    }
    
    button.click();
    console.log('[BOT] Clicked Cari button');
    return true;
  };

  // Fetch next number from API
  window.fetchNextNumber = async function() {
    try {
      const response = await fetch('https://v0-pcare.vercel.app/api/next-number');
      if (!response.ok) throw new Error('API error: ' + response.status);
      const data = await response.json();
      return data.numbers;
    } catch (error) {
      console.error('[BOT] Failed to fetch number from API:', error);
      throw error;
    }
  };

  window.startAutomation = async function(numbers, dates, delay, startIdx = 0, dateIndex = 0, dateGoals = {}, previouslyProcessed = []) {
    console.log('[BOT] START: Using API for numbers, dates=' + dates.length + ', delay=' + delay);
    
    window.automationState.running = true;
    window.automationState.paused = false;

    // Ensure dates is an array
    const datesToProcess = Array.isArray(dates) ? dates : [dates];
    if (!datesToProcess.length) {
      console.error('[BOT] No dates provided');
      return;
    }

    // Process each date
    for (let dateIdx = dateIndex; dateIdx < datesToProcess.length; dateIdx++) {
      if (!window.automationState.running) {
        console.log('[BOT] STOPPED');
        break;
      }

      const currentDate = datesToProcess[dateIdx];
      const goal = dateGoals[currentDate] || 10;
      let processedCount = 0;

      console.log('[BOT] Processing date:', currentDate, '| Goal:', goal);
      window.automationState.currentDate = currentDate;
      window.sendProgress('Setting date', 0, goal, '-', currentDate);

      // Set date field
      window.setDateField(currentDate);
      await window.sleep(delay);

      // Process numbers for this date - fetch from API
      for (let i = 0; i < goal; i++) {
        // Check for pause
        if (window.automationState.paused) {
          console.log('[BOT] PAUSED');
          window.sendProgress('Paused', processedCount, goal, '-', currentDate);
          window.automationState.running = false;
          return;
        }

        if (!window.automationState.running) {
          console.log('[BOT] STOPPED');
          return;
        }

        try {
          // Fetch number from API
          const nomor = await window.fetchNextNumber();
          console.log('[BOT] [' + (processedCount + 1) + '/' + goal + '] Fetched from API:', nomor);
          window.automationState.currentNumber = nomor;
          window.sendProgress('Processing', processedCount, goal, nomor, currentDate);

          // Clear popups
          window.clearPopups();
          await window.sleep(200);

          // Input number
          const inputted = await window.inputNoPencarian(nomor);
          if (!inputted) {
            throw 'Failed to input number';
          }
          await window.sleep(delay);

          // Click Cari
          const found = window.clickCari();
          if (!found) {
            throw 'Cari button not found';
          }
          await window.sleep(delay);

          // Handle modals
          await window.handleUpdateNIKModal();
          await window.sleep(200);

          // Select form options
          await window.selectOptions();
          await window.sleep(delay * 2);

          // Success
          window.automationState.successCount++;
          processedCount++;
          
          console.log('[BOT] Success:', nomor);
          window.sendProgress('Success', processedCount, goal, nomor, currentDate);

        } catch (error) {
          window.automationState.errorCount++;
          console.error('[BOT] Error:', error);
          window.sendProgress('Error', processedCount, goal, '-', currentDate);
          await window.sleep(delay);
        }
      }

      // Check if more dates to process
      if (dateIdx + 1 < datesToProcess.length) {
        console.log('[BOT] Completed date ' + currentDate + '. Moving to next date...');
        window.sendProgress('Next date', goal, goal, '-', currentDate);
        await window.sleep(1000);
      }
    }

    // All dates processed
    console.log('[BOT] AUTOMATION COMPLETE');
    console.log('[BOT] Summary: ' + window.automationState.successCount + ' success, ' + window.automationState.errorCount + ' errors');
    window.sendProgress('Completed', window.automationState.successCount, window.automationState.successCount, '-', 'Done');
    window.automationState.running = false;
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

// Calculate progress percentage
export const getProgressPercentage = (done: number, total: number): number => {
  return total === 0 ? 0 : Math.round((done / total) * 100);
};
