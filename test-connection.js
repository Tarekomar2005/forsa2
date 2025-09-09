// Quick Test Script for Google Sheets Integration
// Copy this code to your browser console to test the connection

async function testGoogleSheetsConnection() {
    console.log('🧪 Testing Google Sheets Integration...');
    
    // Test contact submission
    const testContact = {
        name: 'أحمد محمد - اختبار',
        email: 'test@example.com',
        message: 'هذه رسالة اختبار للتأكد من عمل النظام'
    };
    
    try {
        console.log('📧 Testing contact form...');
        await saveContactToGoogleSheets(testContact.name, testContact.email, testContact.message);
        console.log('✅ Contact test successful!');
        
        console.log('🛍️ Testing order form...');
        await saveQuickOrderToGoogleSheets('شنطة يد أنيقة - اختبار', '299 جنيه', 'شنط يد');
        console.log('✅ Order test successful!');
        
        console.log('🎉 All tests passed! Your Google Sheets integration is working.');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        console.log('💡 Make sure you updated GOOGLE_SHEETS_URL in script.js');
        console.log('💡 Check that your Google Apps Script is deployed correctly');
    }
}

// Run the test
testGoogleSheetsConnection();