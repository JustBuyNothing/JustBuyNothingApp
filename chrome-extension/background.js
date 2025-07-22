// Background script for iBuyNothing Guard
chrome.runtime.onInstalled.addListener(() => {
  console.log('iBuyNothing Guard installed');
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkoutDetected') {
    console.log('Checkout detected on:', sender.tab?.url);
    // Store checkout event
    chrome.storage.local.set({
      lastCheckoutAttempt: {
        url: sender.tab?.url,
        timestamp: Date.now(),
        cartTotal: request.cartTotal || 'unknown'
      }
    });
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Open BuyNothing site in new tab
  chrome.tabs.create({ url: 'https://buynothing.replit.app' });
});