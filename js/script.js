// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.getElementById('navbar');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
    
    // Enhanced navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });
});

// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for navbar height
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Advanced fade-in animation on scroll
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add staggered animation for product cards
            if (entry.target.classList.contains('product-card')) {
                const cards = document.querySelectorAll('.product-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 100);
                });
            }
        }
    });
}, observerOptions);

// Enhanced animation elements
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.product-card, .about-text, .about-image, .contact-info, .contact-form, .hero-content');
    
    animatedElements.forEach((el, index) => {
        // Add different animation classes
        if (el.classList.contains('about-text')) {
            el.classList.add('slide-right');
        } else if (el.classList.contains('about-image')) {
            el.classList.add('slide-left');
        } else {
            el.classList.add('fade-in');
        }
        
        observer.observe(el);
    });
});

// Enhanced product functionality
// Wishlist toggle function
function toggleWishlist(button) {
    const icon = button.querySelector('i');
    button.classList.toggle('liked');
    
    if (button.classList.contains('liked')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
        
        // Show notification
        showNotification('تم إضافة المنتج إلى المفضلة ❤️');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        showNotification('تم إزالة المنتج من المفضلة');
    }
}

// Enhanced product order functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle main product buttons (Add to Cart)
    document.querySelectorAll('.product-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const productImage = productCard.querySelector('.product-image img').src;
            const productCategory = productCard.querySelector('.product-category').textContent;
            
            // Add to cart animation
            this.innerHTML = '<div class="loading"></div> جاري الإضافة...';
            this.disabled = true;
            
            setTimeout(() => {
                addToCart(productName, productPrice, productImage, productCategory);
                this.disabled = false;
            }, 1000);
        });
    });
    
    // Handle quick order buttons (Direct to WhatsApp + Google Sheets)
    document.querySelectorAll('.quick-order-btn').forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'جاري المعالجة...';
            this.disabled = true;
            
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const productCategory = productCard.querySelector('.product-category').textContent;
            
            // Save to Google Sheets first, then send to WhatsApp
            saveQuickOrderToGoogleSheets(productName, productPrice, productCategory)
                .then(() => {
                    sendQuickOrderToWhatsApp(productName, productPrice, productCategory);
                    showNotification(`تم إرسال طلب ${productName} وحفظه بنجاح!`, 'success');
                })
                .catch((error) => {
                    console.error('Error saving order to Google Sheets:', error);
                    // Still send to WhatsApp even if Google Sheets fails
                    sendQuickOrderToWhatsApp(productName, productPrice, productCategory);
                    // Save locally as backup
                    saveOrderLocally(productName, productPrice, productCategory);
                    showNotification(`تم إرسال طلب ${productName}! (تم الحفظ المحلي)`, 'warning');
                })
                .finally(() => {
                    // Restore button state
                    this.textContent = originalText;
                    this.disabled = false;
                });
        });
    });
});

// Contact form submission with Google Sheets integration
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'جاري الإرسال...';
    submitBtn.disabled = true;
    
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Save to Google Sheets first, then send to WhatsApp
    saveContactToGoogleSheets(name, email, message)
        .then(() => {
            // After successful save, send to WhatsApp
            sendContactMessageToWhatsApp(name, email, message);
            showNotification('تم إرسال رسالتك وحفظها بنجاح!', 'success');
            this.reset();
        })
        .catch((error) => {
            console.error('Error saving to Google Sheets:', error);
            // Still send to WhatsApp even if Google Sheets fails
            sendContactMessageToWhatsApp(name, email, message);
            // Save locally as backup
            saveContactLocally(name, email, message);
            showNotification('تم إرسال رسالتك! (تم الحفظ المحلي)', 'warning');
            this.reset();
        })
        .finally(() => {
            // Restore button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
});

// Social media links functionality
document.querySelectorAll('.social-link, .footer-social-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const icon = this.querySelector('i').classList;
        let url = '';
        
        if (icon.contains('fa-whatsapp')) {
            // Send a welcome message when clicking WhatsApp
            const welcomeMessage = '🌹 مرحباً بك في Forsa!\n\nنحن متخصصون في الشنط الحريمي الأنيقة والعصرية\n\nكيف يمكنني مساعدتك اليوم؟';
            url = `https://wa.me/201234567890?text=${encodeURIComponent(welcomeMessage)}`;
        } else if (icon.contains('fa-instagram')) {
            url = 'https://instagram.com/forsa_bags';
        } else if (icon.contains('fa-facebook')) {
            url = 'https://facebook.com/forsa.bags';
        }
        
        if (url) {
            window.open(url, '_blank');
        }
    });
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 150);
    }
});

// Image lazy loading
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                
                img.onload = function() {
                    img.style.opacity = '1';
                };
                
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Add hover effects for better user experience
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click ripple effect
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}

// Add ripple effect CSS
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 600ms linear;
    background-color: rgba(255, 255, 255, 0.6);
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Apply ripple effect to buttons
document.querySelectorAll('.cta-button, .product-btn, .submit-btn').forEach(button => {
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.addEventListener('click', createRipple);
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // Navbar scroll effect code here
}, 16)); // ~60fps

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.4s ease;
        max-width: 300px;
        font-family: 'Cairo', sans-serif;
    `;
    
    if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 4000);
}

// Back to top button
document.addEventListener('DOMContentLoaded', function() {
    // Create back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.title = 'العودة للأعلى';
    document.body.appendChild(backToTopButton);
    
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initialize cart
    updateCartDisplay();
});

// Shopping Cart Functionality
let cart = JSON.parse(localStorage.getItem('forsaCart')) || [];

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    
    if (cartSidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function addToCart(productName, productPrice, productImage, productCategory) {
    const price = parseInt(productPrice.replace(/[^0-9]/g, ''));
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`تم زيادة كمية ${productName} في السلة`);
    } else {
        cart.push({
            id: Date.now(),
            name: productName,
            price: price,
            image: productImage,
            category: productCategory,
            quantity: 1
        });
        showNotification(`تم إضافة ${productName} إلى السلة`);
    }
    
    saveCart();
    updateCartDisplay();
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    updateCartUI();
    showNotification('تم إزالة المنتج من السلة');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        saveCart();
        updateCartDisplay();
        updateCartUI();
    }
}

function clearCart() {
    if (cart.length === 0) {
        showNotification('السلة فارغة بالفعل', 'error');
        return;
    }
    
    if (confirm('هل أنت متأكد من إفراغ السلة؟')) {
        cart = [];
        saveCart();
        updateCartDisplay();
        updateCartUI();
        showNotification('تم إفراغ السلة بنجاح');
    }
}

function saveCart() {
    localStorage.setItem('forsaCart', JSON.stringify(cart));
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart count
    cartCount.textContent = totalItems;
    cartCount.classList.toggle('hidden', totalItems === 0);
    
    // Update cart total
    cartTotal.textContent = `${totalPrice} جنيه`;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>السلة فارغة</p>
                <span>أضف بعض المنتجات إلى سلتك</span>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="item-price">${item.price} جنيه</div>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity(${item.id}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
}

function updateCartUI() {
    // Update product buttons based on cart status
    document.querySelectorAll('.product-btn').forEach(button => {
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        const cartItem = cart.find(item => item.name === productName);
        
        if (cartItem) {
            button.innerHTML = `في السلة (${cartItem.quantity})`;
            button.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
        } else {
            button.innerHTML = 'أضف للسلة';
            button.style.background = '';
        }
    });
}

// Enhanced WhatsApp Order Function
function sendOrderToWhatsApp() {
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    let orderMessage = '🛍️ *طلب جديد من موقع Forsa*\n';
    orderMessage += '═══════════════════════\n\n';
    
    // Customer information if available
    if (customerInfo.name) {
        orderMessage += '👤 *بيانات العميل:*\n';
        orderMessage += `📛 الاسم: ${customerInfo.name}\n`;
        orderMessage += `📱 الهاتف: ${customerInfo.phone}\n`;
        if (customerInfo.email) orderMessage += `📧 الإيميل: ${customerInfo.email}\n`;
        orderMessage += `📍 المدينة: ${customerInfo.city}\n`;
        orderMessage += `🏠 العنوان: ${customerInfo.address}\n`;
        if (customerInfo.paymentMethod) {
            orderMessage += `💳 طريقة الدفع: ${getPaymentMethodText(customerInfo.paymentMethod)}\n`;
        }
        if (customerInfo.notes) {
            orderMessage += `📝 ملاحظات: ${customerInfo.notes}\n`;
        }
        orderMessage += '\n═══════════════════════\n\n';
    }
    
    // Products information
    orderMessage += '🛒 *المنتجات المطلوبة:*\n';
    orderMessage += `📦 إجمالي القطع: ${totalItems}\n\n`;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        orderMessage += `${index + 1}. *${item.name}*\n`;
        orderMessage += `   📂 الفئة: ${item.category}\n`;
        orderMessage += `   🔢 الكمية: ${item.quantity}\n`;
        orderMessage += `   💰 السعر: ${item.price} جنيه\n`;
        orderMessage += `   💵 الإجمالي: ${itemTotal} جنيه\n\n`;
    });
    
    orderMessage += '═══════════════════════\n';
    orderMessage += `💳 *إجمالي المبلغ: ${totalPrice} جنيه*\n`;
    orderMessage += '═══════════════════════\n\n';
    orderMessage += '📅 تاريخ الطلب: ' + new Date().toLocaleDateString('ar-EG') + '\n';
    orderMessage += '🕐 وقت الطلب: ' + new Date().toLocaleTimeString('ar-EG') + '\n\n';
    orderMessage += 'شكراً لاختياركم Forsa! 🌹';
    
    // Replace your phone number here
    const whatsappNumber = '201234567890'; // Replace with actual number
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;
    
    window.open(whatsappURL, '_blank');
    
    showNotification('جاري تحويلك للواتساب لإتمام الطلب...');
    
    // Optional: Clear cart after sending
    if (confirm('هل تريد إفراغ السلة بعد إرسال الطلب؟')) {
        clearCart();
        toggleCart(); // Close cart sidebar
    }
}

// Customer Information Management
let customerInfo = JSON.parse(localStorage.getItem('forsaCustomerInfo')) || {};

function showCustomerForm() {
    const modal = document.getElementById('customerModalOverlay');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set today's date as default
    document.getElementById('orderDate').value = new Date().toISOString().split('T')[0];
    
    // Load saved customer info if exists
    if (customerInfo.name) {
        document.getElementById('customerName').value = customerInfo.name || '';
        document.getElementById('customerPhone').value = customerInfo.phone || '';
        document.getElementById('customerEmail').value = customerInfo.email || '';
        document.getElementById('customerCity').value = customerInfo.city || '';
        document.getElementById('customerAddress').value = customerInfo.address || '';
        document.getElementById('paymentMethod').value = customerInfo.paymentMethod || '';
        document.getElementById('customerNotes').value = customerInfo.notes || '';
    }
}

function hideCustomerForm() {
    const modal = document.getElementById('customerModalOverlay');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function saveCustomerInfo() {
    const form = document.getElementById('customerForm');
    
    // Validate required fields
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Save customer information
    customerInfo = {
        name: document.getElementById('customerName').value,
        phone: document.getElementById('customerPhone').value,
        email: document.getElementById('customerEmail').value,
        city: document.getElementById('customerCity').value,
        address: document.getElementById('customerAddress').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        orderDate: document.getElementById('orderDate').value,
        notes: document.getElementById('customerNotes').value,
        savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('forsaCustomerInfo', JSON.stringify(customerInfo));
    
    hideCustomerForm();
    showNotification('تم حفظ بيانات العميل بنجاح!');
}

// Excel Export Functionality
// =============================================
// ENHANCED ORDER MANAGEMENT
// =============================================

// Utility function for payment method text
function getPaymentMethodText(method) {
    const methods = {
        'cash_on_delivery': 'دفع عند الاستلام',
        'bank_transfer': 'حوالة بنكية',
        'vodafone_cash': 'فودافون كاش',
        'orange_money': 'أورانج مني'
    };
    return methods[method] || method;
}

// Open Admin Panel function
function openAdminPanel() {
    const adminUrl = window.location.origin + window.location.pathname.replace('index.html', 'admin-panel.html');
    const newWindow = window.open(adminUrl, '_blank');
    
    if (newWindow) {
        showNotification('📈 تم فتح لوحة إدارة الطلبات في نافذة جديدة', 'success');
    } else {
        showNotification('تعذر فتح لوحة الإدارة. يرجى السماح بالنوافذ المنبثقة', 'error');
    }
}

// Update saved orders count display
function updateSavedOrdersCount() {
    const completeOrders = JSON.parse(localStorage.getItem('forsa_complete_orders') || '[]');
    const savedOrdersInfo = document.getElementById('savedOrdersInfo');
    const savedOrdersCount = document.getElementById('savedOrdersCount');
    
    if (completeOrders.length > 0) {
        savedOrdersCount.textContent = completeOrders.length;
        savedOrdersInfo.style.display = 'block';
    } else {
        savedOrdersInfo.style.display = 'none';
    }
}

// Call this function when the page loads and when orders are saved
document.addEventListener('DOMContentLoaded', function() {
    updateSavedOrdersCount();
    // Update count every 5 seconds to catch any changes
    setInterval(updateSavedOrdersCount, 5000);
});

// View locally saved orders function
function viewLocalOrders() {
    const completeOrders = JSON.parse(localStorage.getItem('forsa_complete_orders') || '[]');
    const quickOrders = JSON.parse(localStorage.getItem('forsa_orders') || '[]');
    
    if (completeOrders.length === 0 && quickOrders.length === 0) {
        showNotification('لا توجد طلبات محفوظة محلياً. قم بإضافة منتجات وإتمام طلب أولاً!', 'warning');
        return;
    }
    
    let ordersList = '📊 الطلبات المحفوظة محلياً:\n\n';
    
    // Show complete orders
    if (completeOrders.length > 0) {
        ordersList += '🛍️ الطلبات الكاملة: ' + completeOrders.length + '\n';
        completeOrders.slice(-3).forEach(order => {
            // Check both possible data structures
            const customerName = order.customer ? order.customer.name : order.customerName;
            const totalAmount = order.totals ? order.totals.totalAmount : order.totalAmount;
            const productCount = order.products ? order.products.length : 'غير محدد';
            
            ordersList += `• ${order.orderId}: ${customerName} - ${totalAmount} جنيه (${productCount} منتج)\n`;
        });
        ordersList += '\n';
    }
    
    // Show quick orders (filter out complete order items)
    const actualQuickOrders = quickOrders.filter(order => order.orderType !== 'complete_order');
    if (actualQuickOrders.length > 0) {
        ordersList += '⚡ الطلبات السريعة: ' + actualQuickOrders.length + '\n';
        actualQuickOrders.slice(-3).forEach(order => {
            ordersList += `• ${order.productName} - ${order.customerName || 'غير محدد'}\n`;
        });
    }
    
    ordersList += '\n📁 لعرض التفاصيل الكاملة، افتح admin-panel.html';
    
    alert(ordersList);
    showNotification('📈 تم عرض الطلبات المحفوظة! للتفاصيل الكاملة افتح لوحة الإدارة', 'success');
}

// Add keyboard shortcut to view orders (Ctrl+Alt+O)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.altKey && e.key === 'o') {
        viewLocalOrders();
    }
});

// Enhanced checkout function with automatic data saving
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('السلة فارغة. أضف بعض المنتجات أولاً', 'error');
        return;
    }
    
    // Check if customer info exists
    if (!customerInfo.name || !customerInfo.phone) {
        showNotification('يجب إدخال بيانات العميل (الاسم ورقم الهاتف) أولاً', 'error');
        showCustomerForm();
        return;
    }
    
    // Show loading state
    showNotification('جاري حفظ الطلب في قاعدة البيانات...', 'info');
    
    // Save order data automatically to both Google Sheets and Local Storage
    saveCompleteOrderData()
        .then((orderData) => {
            // After successful save, send to WhatsApp
            showNotification(`✅ تم حفظ الطلب رقم ${orderData.orderId} في قاعدة البيانات! 🎉`, 'success');
            
            // Show admin panel link
            setTimeout(() => {
                showNotification(`📈 يمكنك عرض الطلب في لوحة الإدارة أو باستخدام Ctrl+Alt+O`, 'info');
            }, 2000);
            
            // Optional: Ask if user wants to go to WhatsApp
            if (confirm('تم حفظ الطلب بنجاح!\n\nهل تريد إرسال نسخة عبر الواتساب أيضاً؟')) {
                sendOrderToWhatsApp();
            }
        })
        .catch((error) => {
            console.error('Error saving order:', error);
            
            // Check if Google Sheets URL is configured
            if (GOOGLE_SHEETS_URL === 'PASTE_YOUR_WEB_APP_URL_HERE') {
                showNotification('⚠️ تم حفظ الطلب محلياً (لم يتم إعداد Google Sheets)', 'warning');
            } else {
                showNotification('⚠️ تم حفظ الطلب محلياً (مشكلة في الاتصال)', 'warning');
            }
            
            // Ask if user still wants to go to WhatsApp
            if (confirm('تم حفظ الطلب محلياً.\n\nهل تريد إرساله عبر الواتساب؟')) {
                sendOrderToWhatsApp();
            }
        });
}

// Enhanced WhatsApp Order Function
function sendOrderToWhatsApp() {
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    let orderMessage = '🛍️ *طلب جديد من موقع Forsa*\n';
    orderMessage += '═══════════════════════\n\n';
    
    // Customer information if available
    if (customerInfo.name) {
        orderMessage += '👤 *بيانات العميل:*\n';
        orderMessage += `📛 الاسم: ${customerInfo.name}\n`;
        orderMessage += `📱 الهاتف: ${customerInfo.phone}\n`;
        if (customerInfo.email) orderMessage += `📧 الإيميل: ${customerInfo.email}\n`;
        orderMessage += `📍 المدينة: ${customerInfo.city}\n`;
        orderMessage += `🏠 العنوان: ${customerInfo.address}\n`;
        if (customerInfo.paymentMethod) {
            orderMessage += `💳 طريقة الدفع: ${getPaymentMethodText(customerInfo.paymentMethod)}\n`;
        }
        if (customerInfo.notes) {
            orderMessage += `📝 ملاحظات: ${customerInfo.notes}\n`;
        }
        orderMessage += '\n═══════════════════════\n\n';
    }
    
    // Products information
    orderMessage += '🛒 *المنتجات المطلوبة:*\n';
    orderMessage += `📦 إجمالي القطع: ${totalItems}\n\n`;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        orderMessage += `${index + 1}. *${item.name}*\n`;
        orderMessage += `   📂 الفئة: ${item.category}\n`;
        orderMessage += `   🔢 الكمية: ${item.quantity}\n`;
        orderMessage += `   💰 السعر: ${item.price} جنيه\n`;
        orderMessage += `   💵 الإجمالي: ${itemTotal} جنيه\n\n`;
    });
    
    orderMessage += '═══════════════════════\n';
    orderMessage += `💳 *إجمالي المبلغ: ${totalPrice} جنيه*\n`;
    orderMessage += '═══════════════════════\n\n';
    orderMessage += '📅 تاريخ الطلب: ' + new Date().toLocaleDateString('ar-EG') + '\n';
    orderMessage += '🕐 وقت الطلب: ' + new Date().toLocaleTimeString('ar-EG') + '\n\n';
    orderMessage += 'شكراً لاختياركم Forsa! 🌹';
    
    // Replace your phone number here
    const whatsappNumber = '201234567890'; // Replace with actual number
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;
    
    window.open(whatsappURL, '_blank');
    
    showNotification('جاري تحويلك للواتساب لإتمام الطلب...');
    
    // Optional: Clear cart after sending
    if (confirm('هل تريد إفراغ السلة بعد إرسال الطلب؟')) {
        clearCart();
        toggleCart(); // Close cart sidebar
    }
}

// Quick Order WhatsApp Function
function sendQuickOrderToWhatsApp(productName, productPrice, productCategory) {
    let message = '🛍️ *طلب سريع من موقع Forsa*\n';
    message += '═══════════════════\n\n';
    message += '🎯 *المنتج المطلوب:*\n';
    message += `📦 الاسم: *${productName}*\n`;
    message += `📂 الفئة: ${productCategory}\n`;
    message += `💰 السعر: ${productPrice}\n\n`;
    message += '═══════════════════\n';
    message += '📅 تاريخ الطلب: ' + new Date().toLocaleDateString('ar-EG') + '\n';
    message += '🕐 وقت الطلب: ' + new Date().toLocaleTimeString('ar-EG') + '\n\n';
    message += 'أرجو التواصل معي لإتمام الطلب\n';
    message += 'شكراً! 🌹';
    
    const whatsappNumber = '201234567890'; // Replace with actual number
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappURL, '_blank');
    showNotification(`تم إرسال طلب ${productName} للواتساب`);
}

// Contact WhatsApp Function
function sendContactMessageToWhatsApp(name, email, message) {
    let contactMessage = '📞 *رسالة من موقع Forsa*\n';
    contactMessage += '═══════════════════\n\n';
    contactMessage += '👤 *بيانات المرسل:*\n';
    contactMessage += `📛 الاسم: ${name}\n`;
    contactMessage += `📧 الإيميل: ${email}\n\n`;
    contactMessage += '💬 *الرسالة:*\n';
    contactMessage += `${message}\n\n`;
    contactMessage += '═══════════════════\n';
    contactMessage += '📅 تاريخ الإرسال: ' + new Date().toLocaleDateString('ar-EG') + '\n';
    contactMessage += '🕐 وقت الإرسال: ' + new Date().toLocaleTimeString('ar-EG') + '\n\n';
    contactMessage += 'شكراً للتواصل! 🌹';
    
    const whatsappNumber = '201234567890'; // Replace with actual number
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(contactMessage)}`;
    
    window.open(whatsappURL, '_blank');
    showNotification('تم إرسال رسالتك للواتساب بنجاح!');
}

// Additional WhatsApp Helper Functions
function sendCustomWhatsAppMessage(message, phoneNumber = '201234567890') {
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

// =============================================
// COMPLETE ORDER DATA SAVING FUNCTION  
// =============================================

// Save complete order data to both Google Sheets and Local Storage
async function saveCompleteOrderData() {
    const orderData = {
        orderId: 'ORD-' + Date.now(),
        timestamp: new Date().toISOString(),
        customer: {
            name: customerInfo.name,
            phone: customerInfo.phone,
            email: customerInfo.email || '',
            city: customerInfo.city || '',
            address: customerInfo.address || '',
            paymentMethod: customerInfo.paymentMethod || '',
            notes: customerInfo.notes || ''
        },
        products: cart.map(item => ({
            name: item.name,
            category: item.category,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
        })),
        totals: {
            totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
            totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        },
        source: 'website_complete_order'
    };
    
    try {
        // Save to Google Sheets first
        await saveCompleteOrderToGoogleSheets(orderData);
        console.log('✅ Order saved to Google Sheets successfully');
        
        // Save to local storage as backup
        saveCompleteOrderToLocalStorage(orderData);
        console.log('✅ Order saved to local storage successfully');
        
        return Promise.resolve(orderData);
        
    } catch (error) {
        console.error('❌ Error saving to Google Sheets:', error);
        
        // Always save locally even if Google Sheets fails
        saveCompleteOrderToLocalStorage(orderData);
        console.log('✅ Order saved to local storage as backup');
        
        throw error;
    }
}

// Save complete order to Google Sheets
async function saveCompleteOrderToGoogleSheets(orderData) {
    const data = {
        action: 'saveCompleteOrder',
        orderId: orderData.orderId,
        customerName: orderData.customer.name,
        customerPhone: orderData.customer.phone,
        customerEmail: orderData.customer.email,
        customerCity: orderData.customer.city,
        customerAddress: orderData.customer.address,
        paymentMethod: orderData.customer.paymentMethod,
        customerNotes: orderData.customer.notes,
        products: JSON.stringify(orderData.products),
        totalItems: orderData.totals.totalItems,
        totalAmount: orderData.totals.totalAmount,
        orderType: 'complete_order',
        timestamp: orderData.timestamp,
        source: orderData.source,
        ip: await getUserIP().catch(() => 'Unknown'),
        userAgent: navigator.userAgent
    };
    
    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        console.log('Complete order data sent to Google Sheets');
        return Promise.resolve();
        
    } catch (error) {
        console.error('Failed to save complete order to Google Sheets:', error);
        throw error;
    }
}

// Save complete order to local storage
function saveCompleteOrderToLocalStorage(orderData) {
    try {
        // Save to complete orders list with flattened structure for admin panel compatibility
        const completeOrders = JSON.parse(localStorage.getItem('forsa_complete_orders') || '[]');
        const newCompleteOrder = {
            id: Date.now(),
            orderId: orderData.orderId,
            timestamp: orderData.timestamp,
            customerName: orderData.customer.name,
            customerPhone: orderData.customer.phone,
            customerEmail: orderData.customer.email,
            customerCity: orderData.customer.city,
            customerAddress: orderData.customer.address,
            paymentMethod: orderData.customer.paymentMethod,
            customerNotes: orderData.customer.notes,
            products: orderData.products,
            totalItems: orderData.totals.totalItems,
            totalAmount: orderData.totals.totalAmount,
            source: orderData.source,
            synced: false
        };
        
        completeOrders.push(newCompleteOrder);
        localStorage.setItem('forsa_complete_orders', JSON.stringify(completeOrders));
        
        // Also save to the existing orders format for compatibility with admin panel
        const legacyOrders = JSON.parse(localStorage.getItem('forsa_orders') || '[]');
        orderData.products.forEach(product => {
            legacyOrders.push({
                id: Date.now() + Math.random(),
                productName: product.name,
                productPrice: `${product.price} جنيه`,
                productCategory: product.category,
                quantity: product.quantity,
                customerName: orderData.customer.name,
                customerPhone: orderData.customer.phone,
                orderType: 'complete_order',
                timestamp: orderData.timestamp,
                synced: false
            });
        });
        localStorage.setItem('forsa_orders', JSON.stringify(legacyOrders));
        
        console.log('Complete order saved to local storage');
        
        // Update the saved orders count display
        updateSavedOrdersCount();
        
    } catch (error) {
        console.error('Failed to save complete order locally:', error);
    }
}

// =============================================
// GOOGLE SHEETS DATABASE INTEGRATION
// =============================================

// Google Apps Script Web App URL
// IMPORTANT: Replace this URL with your actual Google Apps Script Web App URL
// Example: 'https://script.google.com/macros/s/AKfycbz.../exec'
// Follow the setup guide in google-apps-script-enhanced.js to get your URL
const GOOGLE_SHEETS_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';

// Check if Google Sheets is properly configured
function isGoogleSheetsConfigured() {
    return GOOGLE_SHEETS_URL !== 'PASTE_YOUR_WEB_APP_URL_HERE' && 
           GOOGLE_SHEETS_URL.includes('script.google.com');
}

// Function to save contact form data to Google Sheets
async function saveContactToGoogleSheets(name, email, message) {
    const data = {
        action: 'saveContact',
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toISOString(),
        source: 'website_contact_form',
        ip: await getUserIP().catch(() => 'Unknown'),
        userAgent: navigator.userAgent
    };
    
    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Note: with no-cors mode, we can't read the response
        // but the request will be sent successfully
        console.log('Contact data sent to Google Sheets');
        return Promise.resolve();
        
    } catch (error) {
        console.error('Failed to save to Google Sheets:', error);
        throw error;
    }
}

// Function to save quick order data to Google Sheets
async function saveQuickOrderToGoogleSheets(productName, productPrice, productCategory) {
    const data = {
        action: 'saveOrder',
        productName: productName,
        productPrice: productPrice,
        productCategory: productCategory,
        orderType: 'quick_order',
        timestamp: new Date().toISOString(),
        source: 'website_quick_order',
        ip: await getUserIP().catch(() => 'Unknown'),
        userAgent: navigator.userAgent
    };
    
    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        console.log('Order data sent to Google Sheets');
        return Promise.resolve();
        
    } catch (error) {
        console.error('Failed to save order to Google Sheets:', error);
        throw error;
    }
}

// Helper function to get user IP (optional)
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'Unknown';
    }
}

// Local storage backup functions
function saveContactLocally(name, email, message) {
    try {
        const contacts = JSON.parse(localStorage.getItem('forsa_contacts') || '[]');
        const newContact = {
            id: Date.now(),
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString(),
            synced: false
        };
        
        contacts.push(newContact);
        localStorage.setItem('forsa_contacts', JSON.stringify(contacts));
        console.log('Contact saved locally as backup');
        
    } catch (error) {
        console.error('Failed to save contact locally:', error);
    }
}

function saveOrderLocally(productName, productPrice, productCategory) {
    try {
        const orders = JSON.parse(localStorage.getItem('forsa_orders') || '[]');
        const newOrder = {
            id: Date.now(),
            productName: productName,
            productPrice: productPrice,
            productCategory: productCategory,
            orderType: 'quick_order',
            timestamp: new Date().toISOString(),
            synced: false
        };
        
        orders.push(newOrder);
        localStorage.setItem('forsa_orders', JSON.stringify(orders));
        console.log('Order saved locally as backup');
        
    } catch (error) {
        console.error('Failed to save order locally:', error);
    }
}

// Function to sync local data to Google Sheets (call this when connection is restored)
function syncLocalDataToGoogleSheets() {
    // Sync contacts
    const contacts = JSON.parse(localStorage.getItem('forsa_contacts') || '[]');
    const unsyncedContacts = contacts.filter(contact => !contact.synced);
    
    unsyncedContacts.forEach(async (contact) => {
        try {
            await saveContactToGoogleSheets(contact.name, contact.email, contact.message);
            contact.synced = true;
        } catch (error) {
            console.error('Failed to sync contact:', error);
        }
    });
    
    // Sync orders
    const orders = JSON.parse(localStorage.getItem('forsa_orders') || '[]');
    const unsyncedOrders = orders.filter(order => !order.synced);
    
    unsyncedOrders.forEach(async (order) => {
        try {
            await saveQuickOrderToGoogleSheets(order.productName, order.productPrice, order.productCategory);
            order.synced = true;
        } catch (error) {
            console.error('Failed to sync order:', error);
        }
    });
    
    // Update local storage
    localStorage.setItem('forsa_contacts', JSON.stringify(contacts));
    localStorage.setItem('forsa_orders', JSON.stringify(orders));
}

// Auto-sync every 5 minutes
setInterval(syncLocalDataToGoogleSheets, 5 * 60 * 1000);
