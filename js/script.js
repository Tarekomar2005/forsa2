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
    
    // Handle quick order buttons (Direct to WhatsApp)
    document.querySelectorAll('.quick-order-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            const message = `مرحباً، أريد طلب ${productName} بسعر ${productPrice}`;
            const whatsappURL = `https://wa.me/201234567890?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappURL, '_blank');
        });
    });
});

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // WhatsApp message for contact form
    const contactMessage = `مرحباً، اسمي ${name}\nالإيميل: ${email}\nالرسالة: ${message}`;
    const whatsappURL = `https://wa.me/201234567890?text=${encodeURIComponent(contactMessage)}`;
    
    window.open(whatsappURL, '_blank');
    
    // Reset form
    this.reset();
    
    // Show success message
    alert('تم إرسال رسالتك بنجاح! سيتم توجيهك إلى واتساب.');
});

// Social media links functionality
document.querySelectorAll('.social-link, .footer-social-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const icon = this.querySelector('i').classList;
        let url = '';
        
        if (icon.contains('fa-whatsapp')) {
            url = 'https://wa.me/201234567890';
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

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('السلة فارغة. أضف بعض المنتجات أولاً', 'error');
        return;
    }
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let orderMessage = 'مرحباً! أريد طلب المنتجات التالية:\n\n';
    
    cart.forEach((item, index) => {
        orderMessage += `${index + 1}. ${item.name}\nالكمية: ${item.quantity}\nالسعر: ${item.price * item.quantity} جنيه\n\n`;
    });
    
    orderMessage += `إجمالي المبلغ: ${totalPrice} جنيه`;
    
    const whatsappURL = `https://wa.me/201234567890?text=${encodeURIComponent(orderMessage)}`;
    window.open(whatsappURL, '_blank');
    
    showNotification('جاري تحويلك للواتساب لإتمام الطلب...');
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
function exportToExcel() {
    if (cart.length === 0) {
        showNotification('السلة فارغة. أضف بعض المنتجات أولاً', 'error');
        return;
    }
    
    if (!customerInfo.name) {
        showNotification('يجب إدخال بيانات العميل أولاً', 'error');
        showCustomerForm();
        return;
    }
    
    try {
        // Create workbook and worksheets
        const workbook = XLSX.utils.book_new();
        
        // Customer Information Sheet
        const customerData = [
            ['بيانات العميل', ''],
            ['الاسم', customerInfo.name],
            ['رقم الهاتف', customerInfo.phone],
            ['البريد الإلكتروني', customerInfo.email || '-'],
            ['المحافظة/المدينة', customerInfo.city],
            ['العنوان', customerInfo.address],
            ['طريقة الدفع', getPaymentMethodText(customerInfo.paymentMethod)],
            ['تاريخ الطلب', customerInfo.orderDate || new Date().toISOString().split('T')[0]],
            ['ملاحظات', customerInfo.notes || '-'],
            ['', ''],
            ['تاريخ التصدير', new Date().toLocaleString('ar-EG')]
        ];
        
        const customerSheet = XLSX.utils.aoa_to_sheet(customerData);
        
        // Products Sheet
        const productsData = [
            ['المنتجات المطلوبة', '', '', '', ''],
            ['رقم', 'اسم المنتج', 'الفئة', 'الكمية', 'السعر الإجمالي']
        ];
        
        let totalAmount = 0;
        cart.forEach((item, index) => {
            const totalPrice = item.price * item.quantity;
            totalAmount += totalPrice;
            productsData.push([
                index + 1,
                item.name,
                item.category,
                item.quantity,
                `${totalPrice} جنيه`
            ]);
        });
        
        // Add total row
        productsData.push(['', '', '', '', '']);
        productsData.push(['', '', '', 'الإجمالي:', `${totalAmount} جنيه`]);
        
        const productsSheet = XLSX.utils.aoa_to_sheet(productsData);
        
        // Add sheets to workbook
        XLSX.utils.book_append_sheet(workbook, customerSheet, 'بيانات العميل');
        XLSX.utils.book_append_sheet(workbook, productsSheet, 'المنتجات');
        
        // Generate filename with customer name and date
        const fileName = `Forsa_Order_${customerInfo.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        // Save file
        XLSX.writeFile(workbook, fileName);
        
        showNotification('تم تصدير الطلب إلى Excel بنجاح!');
        
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        showNotification('حدث خطأ أثناء تصدير Excel', 'error');
    }
}

function getPaymentMethodText(method) {
    const methods = {
        'cash_on_delivery': 'دفع عند الاستلام',
        'bank_transfer': 'حوالة بنكية',
        'vodafone_cash': 'فودافون كاش',
        'orange_money': 'أورانج مني'
    };
    return methods[method] || method;
}