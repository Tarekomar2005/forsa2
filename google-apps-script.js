/**
 * ============================================
 * FORSA BAGS - GOOGLE SHEETS DATABASE SCRIPT
 * ============================================
 * 
 * This Google Apps Script receives data from the Forsa website
 * and saves it to Google Sheets as a database.
 * 
 * Setup Instructions:
 * 1. Create a new Google Apps Script project
 * 2. Replace the default code with this script
 * 3. Create two Google Sheets:
 *    - "Forsa Contacts" - for contact form submissions
 *    - "Forsa Orders" - for quick order submissions
 * 4. Update the SHEET_IDs below with your actual sheet IDs
 * 5. Deploy as a web app with "Anyone can access" permission
 * 6. Copy the web app URL and update it in script.js
 */

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

// Google Sheets IDs (found in the URL of your Google Sheets)
const CONTACTS_SHEET_ID = 'YOUR_CONTACTS_SHEET_ID_HERE';
const ORDERS_SHEET_ID = 'YOUR_ORDERS_SHEET_ID_HERE';

// Sheet names (tabs within the Google Sheets)
const CONTACTS_SHEET_NAME = 'Contacts';
const ORDERS_SHEET_NAME = 'Orders';

// ============================================
// MAIN HANDLER FUNCTION
// ============================================

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Route to appropriate handler based on action
    if (data.action === 'saveContact') {
      return handleContactSubmission(data);
    } else if (data.action === 'saveOrder') {
      return handleOrderSubmission(data);
    } else {
      return createResponse(false, 'Invalid action');
    }
    
  } catch (error) {
    console.error('Error processing request:', error);
    return createResponse(false, 'Server error: ' + error.toString());
  }
}

// ============================================
// CONTACT FORM HANDLER
// ============================================

function handleContactSubmission(data) {
  try {
    // Open the contacts spreadsheet
    const sheet = SpreadsheetApp.openById(CONTACTS_SHEET_ID).getSheetByName(CONTACTS_SHEET_NAME);
    
    // If sheet doesn't exist, create it with headers
    if (!sheet) {
      const newSheet = SpreadsheetApp.openById(CONTACTS_SHEET_ID).insertSheet(CONTACTS_SHEET_NAME);
      const headers = [
        'التاريخ والوقت',
        'الاسم', 
        'البريد الإلكتروني',
        'الرسالة',
        'المصدر',
        'عنوان IP',
        'المتصفح',
        'معرف الجلسة'
      ];
      newSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers
      newSheet.getRange(1, 1, 1, headers.length)
        .setBackground('#4CAF50')
        .setFontColor('white')
        .setFontWeight('bold');
    }
    
    // Prepare the row data
    const rowData = [
      new Date(data.timestamp),
      data.name,
      data.email,
      data.message,
      data.source || 'website_contact_form',
      data.ip || 'Unknown',
      data.userAgent || 'Unknown',
      Utilities.getUuid()
    ];
    
    // Add the data to the sheet
    const targetSheet = sheet || SpreadsheetApp.openById(CONTACTS_SHEET_ID).getSheetByName(CONTACTS_SHEET_NAME);
    targetSheet.appendRow(rowData);
    
    // Auto-resize columns for better visibility
    targetSheet.autoResizeColumns(1, rowData.length);
    
    // Send email notification (optional)
    sendContactNotificationEmail(data);
    
    return createResponse(true, 'Contact saved successfully', {
      timestamp: data.timestamp,
      name: data.name
    });
    
  } catch (error) {
    console.error('Error saving contact:', error);
    return createResponse(false, 'Failed to save contact: ' + error.toString());
  }
}

// ============================================
// ORDER HANDLER
// ============================================

function handleOrderSubmission(data) {
  try {
    // Open the orders spreadsheet
    const sheet = SpreadsheetApp.openById(ORDERS_SHEET_ID).getSheetByName(ORDERS_SHEET_NAME);
    
    // If sheet doesn't exist, create it with headers
    if (!sheet) {
      const newSheet = SpreadsheetApp.openById(ORDERS_SHEET_ID).insertSheet(ORDERS_SHEET_NAME);
      const headers = [
        'التاريخ والوقت',
        'اسم المنتج',
        'فئة المنتج',
        'سعر المنتج',
        'نوع الطلب',
        'المصدر',
        'عنوان IP',
        'المتصفح',
        'حالة الطلب',
        'معرف الطلب'
      ];
      newSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers
      newSheet.getRange(1, 1, 1, headers.length)
        .setBackground('#2196F3')
        .setFontColor('white')
        .setFontWeight('bold');
    }
    
    // Prepare the row data
    const rowData = [
      new Date(data.timestamp),
      data.productName,
      data.productCategory,
      data.productPrice,
      data.orderType || 'quick_order',
      data.source || 'website_quick_order',
      data.ip || 'Unknown',
      data.userAgent || 'Unknown',
      'جديد',
      Utilities.getUuid()
    ];
    
    // Add the data to the sheet
    const targetSheet = sheet || SpreadsheetApp.openById(ORDERS_SHEET_ID).getSheetByName(ORDERS_SHEET_NAME);
    targetSheet.appendRow(rowData);
    
    // Auto-resize columns for better visibility
    targetSheet.autoResizeColumns(1, rowData.length);
    
    // Send email notification (optional)
    sendOrderNotificationEmail(data);
    
    return createResponse(true, 'Order saved successfully', {
      timestamp: data.timestamp,
      productName: data.productName
    });
    
  } catch (error) {
    console.error('Error saving order:', error);
    return createResponse(false, 'Failed to save order: ' + error.toString());
  }
}

// ============================================
// EMAIL NOTIFICATION FUNCTIONS
// ============================================

function sendContactNotificationEmail(data) {
  try {
    // Configure your email settings here
    const recipientEmail = 'your-email@example.com'; // Replace with your email
    const subject = '🌹 رسالة جديدة من موقع Forsa';
    
    const htmlBody = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1>🌹 رسالة جديدة من موقع Forsa</h1>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">تفاصيل الرسالة:</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #e8f4fd;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">الاسم:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">البريد الإلكتروني:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.email}</td>
            </tr>
            <tr style="background: #e8f4fd;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">التاريخ والوقت:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${new Date(data.timestamp).toLocaleString('ar-EG')}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; vertical-align: top;">الرسالة:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.message}</td>
            </tr>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px;">
            <strong>💡 تذكير:</strong> تم حفظ هذه الرسالة تلقائياً في قاعدة بيانات Google Sheets.
          </div>
        </div>
      </div>
    `;
    
    // Only send email if recipient email is configured
    if (recipientEmail !== 'your-email@example.com') {
      MailApp.sendEmail({
        to: recipientEmail,
        subject: subject,
        htmlBody: htmlBody
      });
    }
    
  } catch (error) {
    console.error('Error sending contact notification email:', error);
  }
}

function sendOrderNotificationEmail(data) {
  try {
    // Configure your email settings here
    const recipientEmail = 'your-email@example.com'; // Replace with your email
    const subject = '🛍️ طلب جديد من موقع Forsa';
    
    const htmlBody = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; text-align: center;">
          <h1>🛍️ طلب جديد من موقع Forsa</h1>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">تفاصيل الطلب:</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #e8f5e8;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">اسم المنتج:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.productName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">فئة المنتج:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.productCategory}</td>
            </tr>
            <tr style="background: #e8f5e8;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">السعر:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.productPrice}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">نوع الطلب:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.orderType}</td>
            </tr>
            <tr style="background: #e8f5e8;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">التاريخ والوقت:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${new Date(data.timestamp).toLocaleString('ar-EG')}</td>
            </tr>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 5px;">
            <strong>📊 معلومة:</strong> تم حفظ هذا الطلب تلقائياً في قاعدة بيانات Google Sheets.
          </div>
        </div>
      </div>
    `;
    
    // Only send email if recipient email is configured
    if (recipientEmail !== 'your-email@example.com') {
      MailApp.sendEmail({
        to: recipientEmail,
        subject: subject,
        htmlBody: htmlBody
      });
    }
    
  } catch (error) {
    console.error('Error sending order notification email:', error);
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function createResponse(success, message, data = null) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: success,
      message: message,
      data: data,
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// ADMIN FUNCTIONS (call manually for maintenance)
// ============================================

function createSampleData() {
  // This function can be run manually to create sample data for testing
  
  // Sample contact
  const sampleContact = {
    action: 'saveContact',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    message: 'مرحباً، أريد الاستفسار عن منتجاتكم',
    timestamp: new Date().toISOString(),
    source: 'test_data',
    ip: '192.168.1.1',
    userAgent: 'Test Browser'
  };
  
  // Sample order
  const sampleOrder = {
    action: 'saveOrder',
    productName: 'شنطة يد أنيقة',
    productPrice: '299 جنيه',
    productCategory: 'شنط يد',
    orderType: 'quick_order',
    timestamp: new Date().toISOString(),
    source: 'test_data',
    ip: '192.168.1.1',
    userAgent: 'Test Browser'
  };
  
  handleContactSubmission(sampleContact);
  handleOrderSubmission(sampleOrder);
  
  console.log('Sample data created successfully!');
}

function getStatistics() {
  // Function to get basic statistics about stored data
  
  try {
    const contactsSheet = SpreadsheetApp.openById(CONTACTS_SHEET_ID).getSheetByName(CONTACTS_SHEET_NAME);
    const ordersSheet = SpreadsheetApp.openById(ORDERS_SHEET_ID).getSheetByName(ORDERS_SHEET_NAME);
    
    const contactsCount = contactsSheet ? contactsSheet.getLastRow() - 1 : 0; // -1 for header
    const ordersCount = ordersSheet ? ordersSheet.getLastRow() - 1 : 0; // -1 for header
    
    const stats = {
      totalContacts: contactsCount,
      totalOrders: ordersCount,
      lastUpdated: new Date().toISOString()
    };
    
    console.log('Statistics:', stats);
    return stats;
    
  } catch (error) {
    console.error('Error getting statistics:', error);
    return null;
  }
}