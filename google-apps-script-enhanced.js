// Enhanced Google Apps Script for Forsa Website Database
// This handles contacts, quick orders, and complete orders

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    // Get the active spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Handle different types of data
    switch(action) {
      case 'saveContact':
        return handleContactSubmission(spreadsheet, data);
      case 'saveOrder':
        return handleQuickOrderSubmission(spreadsheet, data);
      case 'saveCompleteOrder':
        return handleCompleteOrderSubmission(spreadsheet, data);
      default:
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Unknown action: ' + action
        })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle contact form submissions
function handleContactSubmission(spreadsheet, data) {
  let contactSheet = spreadsheet.getSheetByName('Contacts');
  
  // Create sheet if it doesn't exist
  if (!contactSheet) {
    contactSheet = spreadsheet.insertSheet('Contacts');
    contactSheet.appendRow(['التاريخ', 'الاسم', 'البريد الإلكتروني', 'الرسالة', 'المصدر', 'IP Address']);
  }
  
  // Add the contact data
  contactSheet.appendRow([
    new Date(),
    data.name,
    data.email,
    data.message,
    data.source || 'website',
    data.ip || 'Unknown'
  ]);
  
  console.log('Contact saved:', data.name);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Contact saved successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

// Handle quick order submissions
function handleQuickOrderSubmission(spreadsheet, data) {
  let orderSheet = spreadsheet.getSheetByName('Quick Orders');
  
  // Create sheet if it doesn't exist
  if (!orderSheet) {
    orderSheet = spreadsheet.insertSheet('Quick Orders');
    orderSheet.appendRow(['التاريخ', 'اسم المنتج', 'السعر', 'الفئة', 'نوع الطلب', 'المصدر', 'IP Address']);
  }
  
  // Add the order data
  orderSheet.appendRow([
    new Date(),
    data.productName,
    data.productPrice,
    data.productCategory,
    data.orderType || 'quick_order',
    data.source || 'website',
    data.ip || 'Unknown'
  ]);
  
  console.log('Quick order saved:', data.productName);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Order saved successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

// Handle complete order submissions
function handleCompleteOrderSubmission(spreadsheet, data) {
  let completeOrderSheet = spreadsheet.getSheetByName('Complete Orders');
  
  // Create sheet if it doesn't exist
  if (!completeOrderSheet) {
    completeOrderSheet = spreadsheet.insertSheet('Complete Orders');
    completeOrderSheet.appendRow([
      'التاريخ', 'رقم الطلب', 'اسم العميل', 'رقم الهاتف', 'البريد الإلكتروني', 
      'المدينة', 'العنوان', 'طريقة الدفع', 'ملاحظات العميل',
      'المنتجات', 'عدد القطع', 'المبلغ الإجمالي', 'المصدر', 'IP Address'
    ]);
  }
  
  // Parse products if it's a string
  let productsText = '';
  if (typeof data.products === 'string') {
    try {
      const products = JSON.parse(data.products);
      productsText = products.map(p => `${p.name} (${p.quantity}x)`).join(', ');
    } catch (e) {
      productsText = data.products;
    }
  } else if (Array.isArray(data.products)) {
    productsText = data.products.map(p => `${p.name} (${p.quantity}x)`).join(', ');
  }
  
  // Add the complete order data
  completeOrderSheet.appendRow([
    new Date(),
    data.orderId,
    data.customerName,
    data.customerPhone,
    data.customerEmail || '',
    data.customerCity || '',
    data.customerAddress || '',
    data.paymentMethod || '',
    data.customerNotes || '',
    productsText,
    data.totalItems || 0,
    data.totalAmount || 0,
    data.source || 'website',
    data.ip || 'Unknown'
  ]);
  
  console.log('Complete order saved:', data.orderId);
  
  // Send email notification (optional)
  try {
    sendEmailNotification(data);
  } catch (emailError) {
    console.error('Email notification failed:', emailError);
    // Don't fail the main operation if email fails
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Complete order saved successfully',
    orderId: data.orderId
  })).setMimeType(ContentService.MimeType.JSON);
}

// Send email notification for new orders (optional)
function sendEmailNotification(orderData) {
  const email = 'your-email@gmail.com'; // Replace with your email
  const subject = `طلب جديد من موقع Forsa - ${orderData.orderId}`;
  
  let emailBody = `
طلب جديد من موقع Forsa!

رقم الطلب: ${orderData.orderId}
اسم العميل: ${orderData.customerName}
رقم الهاتف: ${orderData.customerPhone}
البريد الإلكتروني: ${orderData.customerEmail || 'غير محدد'}

المنتجات المطلوبة:
${typeof orderData.products === 'string' ? orderData.products : JSON.stringify(orderData.products, null, 2)}

إجمالي المبلغ: ${orderData.totalAmount} جنيه
طريقة الدفع: ${orderData.paymentMethod || 'غير محدد'}

العنوان: ${orderData.customerAddress || 'غير محدد'}
المدينة: ${orderData.customerCity || 'غير محدد'}

ملاحظات: ${orderData.customerNotes || 'لا توجد ملاحظات'}

تاريخ الطلب: ${new Date().toLocaleString('ar-EG')}
  `;
  
  // Only send if email is configured
  if (email !== 'your-email@gmail.com') {
    GmailApp.sendEmail(email, subject, emailBody);
  }
}

// Test function (you can run this to test the setup)
function testSetup() {
  console.log('Testing Google Sheets setup...');
  
  const testData = {
    action: 'saveContact',
    name: 'اختبار',
    email: 'test@example.com',
    message: 'رسالة تجريبية',
    source: 'test'
  };
  
  const result = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
  
  console.log('Test result:', result.getContent());
}