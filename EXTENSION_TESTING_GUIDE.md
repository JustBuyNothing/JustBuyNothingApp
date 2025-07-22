# Testing iBuyNothing Guard Chrome Extension

## Step 1: Download and Install

1. Go to the BuyNothing app Add Ons page: `/add-ons`
2. Click "Download Extension" to get the ZIP file
3. Extract the ZIP file to a folder (e.g., `buynothing-guard-extension`)
4. Open Chrome and go to `chrome://extensions/`
5. Enable "Developer mode" (toggle in top right)
6. Click "Load unpacked" and select the extracted folder
7. The extension should now appear in your extensions list

## Step 2: Test on Amazon

### What to Test:
1. **Cart Page**: Go to `amazon.com/gp/cart/view.html` with items in cart
2. **Checkout Page**: Try to proceed to checkout
3. **Buy Now Button**: Click any "Buy Now" button on a product page
4. **One-Click Purchase**: Try Amazon's one-click purchasing

### Expected Behavior:
- Extension should intercept the checkout attempt
- Modal should appear with time-based messaging
- Should show cart total amount
- Three action buttons should be available:
  - "Visit BuyNothing Store" (opens practice store)
  - "I'll Think About It" (closes modal)
  - "Continue to Purchase" (closes modal, allows purchase)

## Step 3: Test Time-Based Messages

### Test Different Times:
- **Late Night (10PM-5AM)**: Should show sleep-focused messaging
- **Morning (6AM-11AM)**: Should show energy-redirect messaging  
- **Afternoon (12PM-5PM)**: Should show stress-awareness messaging
- **Evening (6PM-9PM)**: Should show end-of-day messaging

### To Test Different Times:
1. Change your computer's system time
2. Refresh the Amazon page
3. Try checkout again to see different messaging

## Step 4: Test Extension Popup

1. Click the extension icon in Chrome toolbar
2. Should show:
   - Extension status (Active)
   - Intervention count for today
   - "Visit BuyNothing Store" button
   - Clean, professional interface

## Step 5: Verify No Tracking

1. Check browser developer tools (F12)
2. Go to Application/Storage tab
3. Verify no external data is being sent
4. All stats should be stored locally only

## Troubleshooting

### Extension Not Loading:
- Check manifest.json is valid
- Ensure all files are in correct structure
- Check Chrome console for errors

### Modal Not Appearing:
- Make sure you're on Amazon.com (not Amazon mobile app)
- Try different checkout pages
- Check if ad blockers are interfering

### Messages Not Changing:
- Verify system time is being read correctly
- Check browser console for JavaScript errors
- Try hard refresh (Ctrl+Shift+R)

## Test Checklist

- [ ] Extension installs without errors
- [ ] Modal appears on Amazon checkout
- [ ] Cart total is displayed correctly
- [ ] Time-based messages work for different hours
- [ ] BuyNothing redirect works
- [ ] Extension popup shows correct info
- [ ] No external data tracking
- [ ] All buttons function properly
- [ ] Extension works across different Amazon pages