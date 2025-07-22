// Content script for iBuyNothing Guard
console.log('iBuyNothing Guard loaded');

// Check if we're on a checkout page
function isCheckoutPage() {
  const url = window.location.href;
  return url.includes('gp/buy/spc') || 
         url.includes('checkout/spc') || 
         url.includes('gp/cart/view.html') ||
         url.includes('test-extension') || // For testing on BuyNothing test page
         document.querySelector('#sc-buy-box-ptc-button') ||
         document.querySelector('[name="placeYourOrder1"]') ||
         document.querySelector('#buyNowButton');
}

// Get user's name from Amazon
function getUserName() {
  // Try various selectors to find the user's name
  const selectors = [
    '#nav-link-accountList-nav-line-1',
    '#nav-link-accountList .nav-line-1',
    '[data-nav-role="signin"] .nav-line-1',
    '#nav-link-accountList span:first-child',
    '.nav-line-1',
    '[data-csa-c-content-id="nav_ya_signin"] .nav-line-1'
  ];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent) {
      let name = element.textContent.trim();
      
      // Clean up the name - remove "Hello, " prefix and other common prefixes
      name = name.replace(/^(Hello,?\s*|Hi,?\s*)/i, '');
      
      // If it's a valid name (not "Sign in" or similar), return it
      if (name && 
          !name.toLowerCase().includes('sign in') && 
          !name.toLowerCase().includes('account') &&
          !name.toLowerCase().includes('list') &&
          name.length > 1 && 
          name.length < 50) {
        return name;
      }
    }
  }
  
  return null; // Return null if no name found
}

// Get cart total amount
function getCartTotal() {
  const selectors = [
    // Cart page selectors
    '#sc-subtotal-amount-activecart .a-price-whole',
    '#sc-subtotal-amount-activecart .a-price-part',
    '#sc-subtotal-amount-activecart .a-price',
    '#sc-subtotal-amount-activecart .a-price-symbol',
    '#sc-subtotal-amount-activecart',
    
    // Checkout page selectors
    '.grand-total-price .a-price-whole',
    '.grand-total-price .a-price',
    '#orderTotal .a-price-whole',
    '#orderTotal .a-price',
    '.a-price-whole',
    '.pmts-summary-preview-single-item-amount',
    '.pmts-instrument-display-amount',
    
    // Order summary selectors
    '#subtotals-marketplace-table .a-price',
    '#subtotals-marketplace-table .a-price-whole',
    '.a-price-range .a-price-whole',
    
    // Buy box selectors
    '.a-price.a-text-price.a-size-medium.a-color-price .a-price-whole',
    '.a-price .a-price-whole',
    
    // General fallbacks
    '[data-testid="order-summary-total"] .a-price',
    '.a-price'
  ];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      let text = element.textContent.trim();
      
      // Clean up the text and look for price patterns
      const priceMatch = text.match(/\$[\d,]+\.?\d*/);
      if (priceMatch) {
        return priceMatch[0];
      }
      
      // If element contains $ but no match, return as is
      if (text.includes('$')) {
        return text;
      }
    }
  }
  
  // Try to find any element with $ in the text
  const allElements = document.querySelectorAll('*');
  for (const element of allElements) {
    const text = element.textContent;
    if (text && text.includes('$')) {
      const priceMatch = text.match(/\$[\d,]+\.?\d*/);
      if (priceMatch) {
        return priceMatch[0];
      }
    }
  }
  
  return 'an unknown amount';
}

// Get time-based message
function getTimeBasedMessage() {
  const hour = new Date().getHours();
  const cartTotal = getCartTotal();
  const userName = getUserName();
  const namePrefix = userName ? `${userName}, ` : '';
  
  const messages = {
    lateNight: [
      `${namePrefix}it's ${hour > 12 ? hour - 12 : hour}${hour >= 12 ? 'AM' : 'PM'} and you're about to spend ${cartTotal}. Your tired brain craves instant gratification, but tomorrow you might feel different about this purchase.`,
      `${namePrefix}late night shopping hitting different? That ${cartTotal} might not bring the peace you're looking for right now. What if you tried a calming activity instead?`,
      `${namePrefix}your future self might thank you for pausing on this ${cartTotal} purchase. It's late - maybe grab some water and see if you still want this tomorrow?`
    ],
    morning: [
      `${namePrefix}starting your day with a ${cartTotal} purchase? What if you channeled this morning energy into something that actually fills you up long-term?`,
      `Good morning${userName ? `, ${userName}` : ''}! Before you spend ${cartTotal}, take a breath. Is this purchase aligned with your values today, or just a habit?`,
      `${namePrefix}morning clarity question: Do you really need this ${cartTotal} purchase, or are you shopping because it's become routine?`
    ],
    afternoon: [
      `${namePrefix}midday shopping therapy? This ${cartTotal} won't solve what's really bothering you. What would actually help you feel better right now?`,
      `${namePrefix}pause. Breathe. That ${cartTotal} will still be there in an hour. Will you still want it then, or is this just a momentary impulse?`,
      `${namePrefix}you've made it this far today without this ${cartTotal} purchase. What's really driving this sudden need to buy something?`
    ],
    evening: [
      `${namePrefix}end of day shopping? This ${cartTotal} might temporarily distract from stress, but it won't solve it. What would actually help you unwind?`,
      `${namePrefix}evening impulse? Take a moment. Will this ${cartTotal} purchase truly add value to your life, or is it just a temporary mood boost?`,
      `${namePrefix}you've survived the whole day without this ${cartTotal} item. What's changed in the last few minutes that makes it suddenly essential?`
    ]
  };

  let timeCategory;
  if (hour >= 22 || hour <= 5) {
    timeCategory = 'lateNight';
  } else if (hour >= 6 && hour <= 11) {
    timeCategory = 'morning';
  } else if (hour >= 12 && hour <= 17) {
    timeCategory = 'afternoon';
  } else {
    timeCategory = 'evening';
  }

  const categoryMessages = messages[timeCategory];
  return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
}

// Session storage key for tracking if modal was shown
const MODAL_SHOWN_KEY = 'buynothing-guard-shown';

// Create and show intervention modal
function showInterventionModal() {
  // Check if modal already exists, was already shown, or user chose to continue purchasing
  if (document.getElementById('buynothing-guard-modal') || 
      sessionStorage.getItem(MODAL_SHOWN_KEY) || 
      sessionStorage.getItem('buynothing-guard-allow-purchase')) {
    return;
  }

  // Mark as shown for this session
  sessionStorage.setItem(MODAL_SHOWN_KEY, 'true');

  const modal = document.createElement('div');
  modal.id = 'buynothing-guard-modal';
  modal.className = 'buynothing-guard-modal';
  
  const message = getTimeBasedMessage();
  
  // Enhanced message with price highlighting
  const enhancedMessage = message.replace(/(\$[\d,]+\.?\d*)/g, '<span class="buynothing-guard-price-highlight">$1</span>');
  
  modal.innerHTML = `
    <div class="buynothing-guard-backdrop">
      <div class="buynothing-guard-content">
        <div class="buynothing-guard-header">
          <div class="buynothing-guard-logo"></div>
          <h2>BuyNothing Guard</h2>
          <button class="buynothing-guard-close" onclick="document.getElementById('buynothing-guard-modal').remove()">×</button>
        </div>
        <div class="buynothing-guard-body">
          <p class="buynothing-guard-message">${enhancedMessage}</p>
          <div class="buynothing-guard-actions">
            <button class="buynothing-guard-btn buynothing-guard-btn-primary" onclick="window.open('https://buynothing.replit.app', '_blank'); document.getElementById('buynothing-guard-modal').remove();">
              🏪 Practice Shopping Instead
            </button>
            <button class="buynothing-guard-btn buynothing-guard-btn-secondary" onclick="document.getElementById('buynothing-guard-modal').remove();">
              ⏳ I'll Sleep on It
            </button>
            <button class="buynothing-guard-btn buynothing-guard-btn-tertiary" onclick="sessionStorage.setItem('buynothing-guard-allow-purchase', 'true'); document.getElementById('buynothing-guard-modal').remove(); setTimeout(() => { location.reload(); }, 100);">
              Continue to Purchase
            </button>
          </div>
        </div>
        <div class="buynothing-guard-footer">
          <p>Practice mindful shopping with BuyNothing</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  
  // Send message to background script
  chrome.runtime.sendMessage({
    action: 'checkoutDetected',
    cartTotal: getCartTotal()
  });
}

// Watch for checkout buttons and cart changes
function watchForCheckout() {
  const checkoutSelectors = [
    '#sc-buy-box-ptc-button',
    '[name="placeYourOrder1"]',
    '#buyNowButton',
    '.a-button-primary',
    '[data-testid="checkout-button"]'
  ];

  checkoutSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (!element.dataset.buynothingGuarded) {
        element.dataset.buynothingGuarded = 'true';
        console.log('iBuyNothing Guard: Protected button:', selector, element);
        element.addEventListener('click', (e) => {
          console.log('iBuyNothing Guard: Intercepted click!', e.target);
          
          // Check if user already chose to allow purchases
          if (sessionStorage.getItem('buynothing-guard-allow-purchase')) {
            console.log('iBuyNothing Guard: User chose to continue, allowing purchase');
            return; // Allow the click to proceed normally
          }
          
          // Check if modal was already shown
          if (sessionStorage.getItem(MODAL_SHOWN_KEY)) {
            console.log('iBuyNothing Guard: Modal already shown, allowing purchase');
            return; // Allow the click to proceed normally
          }
          
          e.preventDefault();
          e.stopPropagation();
          showInterventionModal();
        }, true);
      }
    });
  });
}

// Initialize when page loads
function initialize() {
  console.log('iBuyNothing Guard: Checking page...', window.location.href);
  
  if (isCheckoutPage()) {
    console.log('iBuyNothing Guard: Checkout page detected, setting up protection');
    watchForCheckout();
    
    // Watch for dynamic content changes
    const observer = new MutationObserver(() => {
      watchForCheckout();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    console.log('iBuyNothing Guard: Not a checkout page, standing by');
  }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// Also run on any navigation changes (for SPAs)
let currentUrl = window.location.href;
setInterval(() => {
  if (currentUrl !== window.location.href) {
    currentUrl = window.location.href;
    setTimeout(initialize, 1000); // Give the page time to load
  }
}, 1000);