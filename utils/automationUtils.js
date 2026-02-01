// Utility function to simulate delays
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Helper to add timeout to async functions
export function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms: ${label}`)), ms))
  ]);
}

// Simulate automation logic that would run in WebView
// This will be injected into the WebView to automate PCARE
export const automationScript = `
  window.automationState = {
    running: false,
    paused: false,
    currentIndex: 0,
    currentDate: null,
    totalNumbers: 0,
  };

  window.sendProgress = function(status, done, total, currentNumber) {
    window.ReactNativeWebView?.postMessage(JSON.stringify({
      type: 'PROGRESS',
      status,
      done,
      total,
      currentNumber
    }));
  };

  window.startAutomation = async function(numbers, date, delay, startIdx) {
    window.automationState.running = true;
    window.automationState.paused = false;
    window.automationState.currentDate = date;
    window.automationState.totalNumbers = numbers.length;

    for (let i = startIdx; i < numbers.length; i++) {
      if (!window.automationState.running) break;
      if (window.automationState.paused) {
        await new Promise(r => {
          const checkInterval = setInterval(() => {
            if (!window.automationState.paused) {
              clearInterval(checkInterval);
              r();
            }
          }, 100);
        });
      }

      try {
        const currentNumber = numbers[i];
        window.sendProgress('Processing', i, numbers.length, currentNumber);

        // Find and fill input fields based on PCARE page structure
        // This is a placeholder - adapt based on actual PCARE form structure
        const inputs = document.querySelectorAll('input[type="text"], input[type="number"]');
        
        // Simulate form filling (customize for actual PCARE form)
        if (inputs.length > 0) {
          const numberInput = inputs[0];
          numberInput.focus();
          numberInput.value = currentNumber;
          numberInput.dispatchEvent(new Event('input', { bubbles: true }));
          numberInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Simulate submission button click
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.click();
        }

        // Wait for the specified delay
        await new Promise(r => setTimeout(r, delay));
      } catch (error) {
        window.sendProgress('Error', i, numbers.length, error.message);
        console.error('Automation error:', error);
      }
    }

    window.automationState.running = false;
    window.sendProgress('Completed', numbers.length, numbers.length, '');
  };

  window.pauseAutomation = function() {
    window.automationState.paused = true;
  };

  window.resumeAutomation = function() {
    window.automationState.paused = false;
  };

  window.stopAutomation = function() {
    window.automationState.running = false;
    window.automationState.paused = false;
  };
`;

// Format date for display
export const formatDate = (dateStr) => {
  return dateStr; // Already in yyyy-mm-dd format
};

// Calculate progress percentage
export const getProgressPercentage = (done, total) => {
  return total === 0 ? 0 : Math.round((done / total) * 100);
};
