// Simple test content script that should always work
console.log('🚀 TEST: iBuyNothing Guard extension loaded on:', window.location.href);
console.log('🚀 TEST: Document ready state:', document.readyState);

// Function to set up button handlers
function setupButtonHandlers() {
  console.log('🔍 TEST: Looking for checkout buttons...');
  
  const buttons = document.querySelectorAll('#buyNowButton, #sc-buy-box-ptc-button, [name="placeYourOrder1"]');
  console.log('📊 TEST: Found', buttons.length, 'checkout buttons');
  
  buttons.forEach((btn, i) => {
    console.log(`✅ TEST: Button ${i + 1}:`, btn.id || btn.name || btn.className);
    
    // Remove any existing handlers
    btn.removeEventListener('click', handleClick);
    
    // Add new handler
    btn.addEventListener('click', handleClick, true);
  });
}

// Click handler function
function handleClick(e) {
  console.log('🎯 TEST: Button clicked!', e.target);
  e.preventDefault();
  e.stopPropagation();
  alert('Extension is working! Button click intercepted.');
}

// Run immediately
setupButtonHandlers();

// Also run after a delay to catch dynamically loaded content
setTimeout(setupButtonHandlers, 2000);

// Watch for DOM changes
const observer = new MutationObserver(() => {
  setupButtonHandlers();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});