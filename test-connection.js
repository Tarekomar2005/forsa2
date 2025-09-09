// Test Connection to Google Sheets
// Use this to verify your Google Apps Script is working

console.log('🧪 Testing Google Sheets Connection...');

// Replace with your actual Google Apps Script URL
const TEST_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';

async function testConnection() {
    console.log('Testing URL:', TEST_URL);
    
    // Test 1: POST (Write) - should always work
    try {
        const postData = {
            action: 'saveContact',
            name: 'Test Connection',
            email: 'test@example.com',
            message: 'Connection test from test-connection.js',
            timestamp: new Date().toISOString()
        };
        
        await fetch(TEST_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });
        
        console.log('✅ POST test passed - Data should be saved to Google Sheets');
    } catch (error) {
        console.error('❌ POST test failed:', error);
    }
    
    // Test 2: GET (Read) - may fail if doGet not implemented
    try {
        const getUrl = TEST_URL + '?action=getCompleteOrders&test=1';
        const response = await fetch(getUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ GET test passed - Retrieved data:', data);
        } else {
            console.warn('⚠️ GET test failed - HTTP', response.status);
            console.log('This means doGet function is not implemented or has errors');
        }
    } catch (error) {
        console.error('❌ GET test failed:', error);
        console.log('This usually means doGet function is missing');
    }
}

// Auto-test when this file is loaded
if (TEST_URL !== 'PASTE_YOUR_WEB_APP_URL_HERE') {
    testConnection();
} else {
    console.warn('⚠️ Please update TEST_URL with your Google Apps Script Web App URL');
}

// Export for manual testing
window.testGoogleSheetsConnection = testConnection;