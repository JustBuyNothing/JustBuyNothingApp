// Popup script for iBuyNothing Guard
document.addEventListener('DOMContentLoaded', function() {
  // Load stats from storage
  loadStats();
  
  // Visit store button
  document.getElementById('visitStore').addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://buynothing.replit.app' });
    window.close();
  });
});

function loadStats() {
  chrome.storage.local.get(['interventions', 'totalSaved'], function(result) {
    const interventions = result.interventions || [];
    const today = new Date().toDateString();
    
    // Count interventions today
    const todayInterventions = interventions.filter(intervention => 
      new Date(intervention.timestamp).toDateString() === today
    ).length;
    
    document.getElementById('interventionsToday').textContent = todayInterventions;
    
    // Calculate total saved (rough estimate)
    const totalSaved = result.totalSaved || 0;
    document.getElementById('moneySaved').textContent = `$${totalSaved}`;
  });
}