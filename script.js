
/**
 * MOEMENS COMPUTER - JavaScript
 */

// Global variables - accessible to all functions
let cart = [];
let WHATSAPP_NUMBER = '96171512981';
let currentLang = 'en';
let translations = {};

// Currency Exchange Rates (USD base)
const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    AUD: 1.52,
    LBP: 89500
};

// Currency symbols
const currencySymbols = {
    USD: '$',
    EUR: '€',
    AUD: 'A$',
    LBP: 'LBP'
};

// Current selected currency
let currentCurrency = 'USD';

// Format price based on currency
function formatPrice(usdPrice, currency) {
    if (currency === 'LBP') {
        const converted = usdPrice * exchangeRates.LBP;
        return 'LBP ' + Math.round(converted).toLocaleString();
    } else if (currency === 'EUR') {
        const converted = usdPrice * exchangeRates.EUR;
        return '€' + converted.toFixed(2);
    } else if (currency === 'AUD') {
        const converted = usdPrice * exchangeRates.AUD;
        return 'A$' + converted.toFixed(2);
    } else {
        return '$' + usdPrice.toFixed(2);
    }
}

// Convert USD price to selected currency value
function convertCurrency(usdPrice, currency) {
    return usdPrice * (exchangeRates[currency] || 1);
}

// Initialize currency switcher
function initCurrencySwitcher() {
    const currencyBtn = document.getElementById('currencyBtn');
    const currencyDropdown = document.getElementById('currencyDropdown');
    const currencyOptions = document.querySelectorAll('.currency-option');
    
    if (!currencyBtn || !currencyDropdown) return;
    
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency && exchangeRates[savedCurrency]) {
        currentCurrency = savedCurrency;
        updateCurrencyUI();
    }
    
    currencyBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        currencyDropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', function() {
        currencyDropdown.classList.remove('show');
    });
    
    currencyOptions.forEach(function(option) {
        option.addEventListener('click', function() {
            const currency = this.getAttribute('data-currency');
            if (currency && exchangeRates[currency]) {
                currentCurrency = currency;
                localStorage.setItem('selectedCurrency', currency);
                updateCurrencyUI();
                updateAllPricesWithConversion();
                currencyDropdown.classList.remove('show');
            }
        });
    });
}

// Update currency switcher UI
function updateCurrencyUI() {
    const currentCurrencyEl = document.getElementById('currentCurrency');
    const currencyOptions = document.querySelectorAll('.currency-option');
    
    if (currentCurrencyEl) {
        currentCurrencyEl.textContent = currentCurrency;
    }
    
    currencyOptions.forEach(function(option) {
        const currency = option.getAttribute('data-currency');
        if (currency === currentCurrency) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// Update all prices with currency conversion
function updateAllPricesWithConversion() {
    var priceElements = document.querySelectorAll('.price');
    priceElements.forEach(function(priceEl) {
        var priceValue = parseFloat(priceEl.getAttribute('data-price'));
        if (!isNaN(priceValue)) {
            priceEl.textContent = formatPrice(priceValue, currentCurrency);
        }
    });
    
    updateCartPrices();
    
    var cartTotalEl = document.getElementById('cartTotal');
    if (cartTotalEl) {
        var total = cart.reduce(function(sum, item) { 
            return sum + (item.priceNum * item.quantity); 
        }, 0);
        cartTotalEl.textContent = formatPrice(total, currentCurrency);
    }
}

// Update cart item prices
function updateCartPrices() {
    var cartItemPrices = document.querySelectorAll('.cart-item-price');
    cartItemPrices.forEach(function(priceEl) {
        var priceValue = parseFloat(priceEl.getAttribute('data-price-num'));
        if (!isNaN(priceValue)) {
            priceEl.textContent = formatPrice(priceValue, currentCurrency);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    initCurrencySwitcher();
    loadAndApplySettings();
    loadProductsFromStore();
    
    translations = {
        en: {
            navHome: "Home",
            navProducts: "Products",
            navServices: "Services",
            navAbout: "About Us",
            navContact: "Contact",
            welcome: "Welcome to",
            storeName: "MOEMEN'S COMPUTER",
            subtitle: "Your destination for premium laptops, computers, and tech accessories",
            shopNow: "Shop Now",
            contactUs: "Contact Us",
            happyCustomers: "Happy Customers",
            productsCount: "Products",
            yearsExp: "Years Experience",
            products: "Our Products",
            productsSubtitle: "Explore our wide range of premium tech products",
            all: "All",
            laptops: "Laptops",
            gaming: "Gaming",
            accessories: "Accessories",
            desktops: "Desktops",
            components: "Components",
            networking: "Networking",
            peripherals: "Peripherals",
            quickView: "Quick View",
            addToCart: "Add to Cart",
            new: "New",
            sale: "Sale",
            hot: "Hot",
            services: "Our Services",
            servicesSubtitle: "Professional tech services to meet all your needs",
            laptopRepair: "Laptop Repair",
            laptopRepairDesc: "Expert repair services for all laptop brands. Screen replacement, keyboard repair, and more.",
            hardwareUpgrade: "Hardware Upgrade",
            hardwareUpgradeDesc: "Boost your device performance with RAM upgrades, SSD installation, and component replacements.",
            softwareInstall: "Software Installation",
            softwareInstallDesc: "Operating systems, professional software, antivirus, and all your needed applications installed.",
            techSupport: "Technical Support",
            techSupportDesc: "24/7 technical support for all your devices. Remote assistance and on-site service available.",
            learnMore: "Learn More",
            about: "About Us",
            aboutDesc1: "We are a premier destination for all your computing needs. Founded with a vision to provide cutting-edge technology and exceptional customer service, we have become a trusted name in the tech industry.",
            aboutDesc2: "Our mission is to provide the best computer products and services, ensuring that every customer finds the perfect solution for their needs.",
            qualityProducts: "Quality Products",
            expertTeam: "Expert Team",
            fastDelivery: "Fast Delivery",
            warrantySupport: "Warranty Support",
            contact: "Contact Us",
            contactSubtitle: "Get in touch with us for any inquiries or support",
            yourName: "Your Name",
            emailLabel: "Email Address",
            yourMessage: "Your Message",
            sendMessage: "Send Message",
            location: "Location",
            locationAddress: " Fouad Chehab Street, Tripoli, Lebanon",
            phone: "Phone",
            phoneNumber: "+961 71 512 981",
            email: "Email",
            emailAddress: "info@moemencomputer.com",
            workingHours: "Working Hours",
            workingHoursText: "’Mon - Fri: 9AM - 8PM  Sat: 9AM - 7PM  sun:Close",
            footerDesc: "Your trusted destination for premium computers, laptops, and tech accessories. Quality products, expert service.",
            quickLinks: "Quick Links",
            footerServices: "Services",
            contactInfo: "Contact Info",
            copyright: "All rights reserved.",
            shoppingCart: "Shopping Cart",
            cartEmpty: "Your cart is empty",
            total: "Total",
            customerName: "Your Name (optional)",
            checkoutWhatsApp: "Checkout via WhatsApp",
            addedToCart: "Added to cart!",
            cartEmptyError: "Your cart is empty!",
            orderSent: "Order sent to WhatsApp!",
            remove: "Remove",
            orderTitle: "New Order from MOEMEN'S COMPUTER",
            customerLabel: "Customer:",
            dateLabel: "Date:",
            orderDetails: "Order Details:",
            totalLabel: "TOTAL:",
            thankYouMessage: "Thank you for shopping with MOEMEN'S COMPUTER!",
            quantityLabel: "Quantity:",
            priceLabel: "Price:",
            subtotalLabel: "Subtotal:"
        },
        ar: {
            navHome: "الرئيسية",
            navProducts: "المنتجات",
            navServices: "الخدمات",
            navAbout: "عن الشركة",
            navContact: "اتصل بنا",
            welcome: "مرحباً بكم في",
            storeName: "مؤمن كمبيوتر",
            subtitle: "وجهتك لأفضل أجهزة الكمبيوتر المحمول والمكتبية والإكسسوارات التقنية",
            shopNow: "تسوق الآن",
            contactUs: "اتصل بنا",
            happyCustomers: "عميل سعيد",
            productsCount: "منتج",
            yearsExp: "سنوات خبرة",
            products: "منتجاتنا",
            productsSubtitle: "استكشف مجموعتنا الواسعة من المنتجات التقنية المتطورة",
            all: "الكل",
            laptops: "أجهزة محمولة",
            gaming: "ألعاب",
            accessories: "إكسسوارات",
            desktops: "أجهزة مكتبية",
            components: "مكونات",
            networking: "شبكات",
            peripherals: "ملحقات",
            quickView: "عرض سريع",
            addToCart: "إضافة للسلة",
            new: "جديد",
            sale: "تخفيض",
            hot: "رائج",
            services: "خدماتنا",
            servicesSubtitle: "خدمات تقنية احترافية لجميع احتياجاتك",
            laptopRepair: "إصلاح الأجهزة الابتوب",
            laptopRepairDesc: "خدمات إصلاح متخصصة لجميع العلامات التجارية. استبدال الشاشة، إصلاح لوحة المفاتيح والمزيد.",
            hardwareUpgrade: "ترقية الأجهزة",
            hardwareUpgradeDesc: "قم بتحسين أداء جهازك مع ترقية الذاكرة RAM، تركيب SSD واستبدال المكونات.",
            softwareInstall: "تثبيت البرامج",
            softwareInstallDesc: "أنظمة التشغيل، البرامج المهنية، مضادات الفيروسات وجميع التطبيقات التي تحتاجها.",
            techSupport: "الدعم الفني",
            techSupportDesc: "دعم فني على مدار الساعة لجميع أجهزتك. المساعدة عن بُعد والخدمة في الموقع.",
            learnMore: "اعرف المزيد",
            about: "عن الشركة",
            aboutDesc1: "نحن الوجهة الأولى لجميع احتياجاتكم الحاسوبية. تأسسنا برؤية لتقديم أحدث التقنيات وخدمة عملاء استثنائية، وأصبحنا اسمًا موثوقًا في صناعة التكنولوجيا.",
            aboutDesc2: "مهمتنا هي تقديم أفضل المنتجات والخدمات الحاسوبية، وضمان أن يجد كل عميل الحل المثالي لاحتياجاته.",
            qualityProducts: "منتجات عالية الجودة",
            expertTeam: "فريق متخصص",
            fastDelivery: "توصيل سريع",
            warrantySupport: "ضمان ودعم",
            contact: "اتصل بنا",
            contactSubtitle: "تواصل معنا للاستفسارات أو الدعم",
            yourName: "اسمك",
            emailLabel: "البريد الإلكتروني",
            yourMessage: "رسالتك",
            sendMessage: "إرسال الرسالة",
            location: "الموقع",
            locationAddress: " شارع فؤاد شهاب،'طرابلس، لبنان",
            phone: "الهاتف",
            phoneNumber: "+961 71 512 981",
            email: "البريد الإلكتروني",
            emailAddress: "info@moemencomputer.com",
            workingHours: "ساعات العمل",
            workingHoursText: "الاثنين - الجمعة: 9ص - 8م السبت: 9ص - 7م الأحد: مغلق",
            footerDesc: "وجهتك الموثوقة لأفضل أجهزة الكمبيوتر المحمول والمكتبية والإكسسوارات التقنية. منتجات ذات جودة عالية وخدمة متميزة.",
            quickLinks: "روابط سريعة",
            footerServices: "الخدمات",
            contactInfo: "معلومات الاتصال",
            copyright: "جميع الحقوق محفوظة.",
            shoppingCart: "سلة التسوق",
            cartEmpty: "سلتك فارغة",
            total: "المجموع",
            customerName: "اسمك (اختياري)",
            checkoutWhatsApp: "طلب عبر واتساب",
            addedToCart: "تمت الإضافة للسلة!",
            cartEmptyError: "سلتك فارغة!",
            orderSent: "تم إرسال الطلب عبر واتساب!",
            remove: "حذف",
            orderTitle: "طلب جديد من مؤمن كمبيوتر",
            customerLabel: "العميل:",
            dateLabel: "التاريخ:",
            orderDetails: "تفاصيل الطلب:",
            totalLabel: "الإجمالي:",
            thankYouMessage: "شكراً للتسوق مع مؤمن كمبيوتر!",
            quantityLabel: "الكمية:",
            priceLabel: "السعر:",
            subtotalLabel: "المجموع الفرعي:",
            sent: "تم الإرسال!",
            formSubmitted: "شكراً لك! سنتواصل معك قريباً."
        }
    };
    
    currentLang = 'en';
    
    document.getElementById('langSwitch').addEventListener('click', function() {
        currentLang = currentLang === 'en' ? 'ar' : 'en';
        this.classList.toggle('ar');
        translatePage(currentLang);
    });
    
    function translatePage(lang) {
        const t = translations[lang];
        window.currentLang = lang;
        
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        
        if (lang === 'ar') {
            document.body.style.fontFamily = "'Cairo', sans-serif";
        } else {
            document.body.style.fontFamily = "'Poppins', sans-serif";
        }
        
        const navLinks = document.querySelectorAll('.nav-links a');
        if (navLinks[0]) navLinks[0].textContent = t.navHome;
        if (navLinks[1]) navLinks[1].textContent = t.navProducts;
        if (navLinks[2]) navLinks[2].textContent = t.navServices;
        if (navLinks[3]) navLinks[3].textContent = t.navAbout;
        if (navLinks[4]) navLinks[4].textContent = t.navContact;
        
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.innerHTML = '<span>' + t.welcome + '</span><span class="highlight">' + t.storeName + '</span>';
        }
        
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) heroSubtitle.textContent = t.subtitle;
        
        const shopNowBtn = document.querySelector('.hero-buttons .btn-primary');
        if (shopNowBtn) {
            if (lang === 'ar') {
                shopNowBtn.innerHTML = '<i class="fas fa-arrow-left"></i> ' + t.shopNow;
            } else {
                shopNowBtn.innerHTML = t.shopNow + ' <i class="fas fa-arrow-right"></i>';
            }
        }
        
        const contactBtn = document.querySelector('.hero-buttons .btn-secondary');
        if (contactBtn) contactBtn.textContent = t.contactUs;
        
        const statLabels = document.querySelectorAll('.stat-label');
        if (statLabels[0]) statLabels[0].textContent = t.happyCustomers;
        if (statLabels[1]) statLabels[1].textContent = t.productsCount;
        if (statLabels[2]) statLabels[2].textContent = t.yearsExp;
        
        const productsTitle = document.querySelector('#products .section-title');
        if (productsTitle) productsTitle.textContent = t.products;
        const productsSubtitle = document.querySelector('#products .section-subtitle');
        if (productsSubtitle) productsSubtitle.textContent = t.productsSubtitle;
        
        // Translate filter buttons dynamically based on their data-filter attribute
        const filterBtns = document.querySelectorAll('.filter-btn');
        const categoryTranslations = {
            'all': t.all,
            'laptops': t.laptops,
            'gaming': t.gaming,
            'accessories': t.accessories,
            'desktops': t.desktops,
            'components': t.components,
            'networking': t.networking,
            'peripherals': t.peripherals
        };
        
        filterBtns.forEach(function(btn) {
            const filter = btn.getAttribute('data-filter');
            if (filter && categoryTranslations[filter]) {
                btn.textContent = categoryTranslations[filter];
            } else if (filter === 'all') {
                btn.textContent = t.all;
            }
            // If no translation exists, keep the original text (for custom categories)
        });
        
        document.querySelectorAll('.product-badge').forEach(function(badge) {
            const text = badge.textContent.trim().toLowerCase();
            if (text === 'new') badge.textContent = t.new;
            else if (text === 'sale') badge.textContent = t.sale;
            else if (text === 'hot') badge.textContent = t.hot;
        });
        
        document.querySelectorAll('.btn-quick-view').forEach(function(btn) {
            btn.textContent = t.quickView;
        });
        
        translateProducts(lang);
        
        const servicesTitle = document.querySelector('#services .section-title');
        if (servicesTitle) servicesTitle.textContent = t.services;
        const servicesSubtitle = document.querySelector('#services .section-subtitle');
        if (servicesSubtitle) servicesSubtitle.textContent = t.servicesSubtitle;
        
        const serviceCards = document.querySelectorAll('.service-card');
        if (serviceCards[0]) {
            serviceCards[0].querySelector('h3').textContent = t.laptopRepair;
            serviceCards[0].querySelector('p').textContent = t.laptopRepairDesc;
            serviceCards[0].querySelector('.service-link').textContent = t.learnMore;
        }
        if (serviceCards[1]) {
            serviceCards[1].querySelector('h3').textContent = t.hardwareUpgrade;
            serviceCards[1].querySelector('p').textContent = t.hardwareUpgradeDesc;
            serviceCards[1].querySelector('.service-link').textContent = t.learnMore;
        }
        if (serviceCards[2]) {
            serviceCards[2].querySelector('h3').textContent = t.softwareInstall;
            serviceCards[2].querySelector('p').textContent = t.softwareInstallDesc;
            serviceCards[2].querySelector('.service-link').textContent = t.learnMore;
        }
        if (serviceCards[3]) {
            serviceCards[3].querySelector('h3').textContent = t.techSupport;
            serviceCards[3].querySelector('p').textContent = t.techSupportDesc;
            serviceCards[3].querySelector('.service-link').textContent = t.learnMore;
        }
        
        const aboutTitle = document.querySelector('#about .section-title');
        if (aboutTitle) aboutTitle.textContent = t.about;
        
        const aboutTexts = document.querySelectorAll('.about-text p');
        if (aboutTexts[0]) aboutTexts[0].textContent = t.aboutDesc1;
        if (aboutTexts[1]) aboutTexts[1].textContent = t.aboutDesc2;
        
        const features = document.querySelectorAll('.about-features .feature');
        if (features[0]) features[0].innerHTML = '<i class="fas fa-check-circle"></i> ' + t.qualityProducts;
        if (features[1]) features[1].innerHTML = '<i class="fas fa-check-circle"></i> ' + t.expertTeam;
        if (features[2]) features[2].innerHTML = '<i class="fas fa-check-circle"></i> ' + t.fastDelivery;
        if (features[3]) features[3].innerHTML = '<i class="fas fa-check-circle"></i> ' + t.warrantySupport;
        
        const contactTitle = document.querySelector('#contact .section-title');
        if (contactTitle) contactTitle.textContent = t.contact;
        const contactSubtitle = document.querySelector('#contact .section-subtitle');
        if (contactSubtitle) contactSubtitle.textContent = t.contactSubtitle;
        
        const nameLabel = document.querySelector('label[for="name"]');
        if (nameLabel) nameLabel.textContent = t.yourName;
        
        const emailLabel = document.querySelector('label[for="email"]');
        if (emailLabel) emailLabel.textContent = t.emailLabel;
        
        const messageLabel = document.querySelector('label[for="message"]');
        if (messageLabel) messageLabel.textContent = t.yourMessage;
        
        const submitBtn = document.querySelector('#contactForm button[type="submit"]');
        if (submitBtn) {
            if (lang === 'ar') {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ' + t.sendMessage;
            } else {
                submitBtn.innerHTML = t.sendMessage + ' <i class="fas fa-paper-plane"></i>';
            }
        }
        
        const infoItems = document.querySelectorAll('.contact-info .info-item');
        if (infoItems[0]) {
            infoItems[0].querySelector('h4').textContent = t.location;
            infoItems[0].querySelector('p').textContent = t.locationAddress;
        }
        if (infoItems[1]) {
            infoItems[1].querySelector('h4').textContent = t.phone;
            infoItems[1].querySelector('p').textContent = t.phoneNumber;
        }
        if (infoItems[2]) {
            infoItems[2].querySelector('h4').textContent = t.email;
            infoItems[2].querySelector('p').textContent = t.emailAddress;
        }
        if (infoItems[3]) {
            infoItems[3].querySelector('h4').textContent = t.workingHours;
            infoItems[3].querySelector('p').textContent = t.workingHoursText;
        }
        
        const footerBrand = document.querySelector('.footer-brand p');
        if (footerBrand) footerBrand.textContent = t.footerDesc;
        
        const footerLinksTitle = document.querySelector('.footer-links h4');
        if (footerLinksTitle) footerLinksTitle.textContent = t.quickLinks;
        
        const footerServicesTitle = document.querySelector('.footer-services h4');
        if (footerServicesTitle) footerServicesTitle.textContent = t.footerServices;
        
        const footerContactTitle = document.querySelector('.footer-contact h4');
        if (footerContactTitle) footerContactTitle.textContent = t.contactInfo;
        
        const footerQuickLinks = document.querySelectorAll('.footer-links ul li a');
        if (footerQuickLinks[0]) footerQuickLinks[0].textContent = t.navHome;
        if (footerQuickLinks[1]) footerQuickLinks[1].textContent = t.navProducts;
        if (footerQuickLinks[2]) footerQuickLinks[2].textContent = t.navServices;
        if (footerQuickLinks[3]) footerQuickLinks[3].textContent = t.navAbout;
        if (footerQuickLinks[4]) footerQuickLinks[4].textContent = t.navContact;
        
        const footerServiceLinks = document.querySelectorAll('.footer-services ul li a');
        if (footerServiceLinks[0]) footerServiceLinks[0].textContent = t.laptopRepair;
        if (footerServiceLinks[1]) footerServiceLinks[1].textContent = t.hardwareUpgrade;
        if (footerServiceLinks[2]) footerServiceLinks[2].textContent = t.softwareInstall;
        if (footerServiceLinks[3]) footerServiceLinks[3].textContent = t.techSupport;
        
        const footerContactItems = document.querySelectorAll('.footer-contact ul li');
        if (footerContactItems[0]) {
            footerContactItems[0].innerHTML = '<i class="fas fa-map-marker-alt"></i> ' + t.locationAddress;
        }
        if (footerContactItems[1]) {
            footerContactItems[1].innerHTML = '<i class="fas fa-phone"></i> ' + t.phoneNumber;
        }
        if (footerContactItems[2]) {
            footerContactItems[2].innerHTML = '<i class="fas fa-envelope"></i> ' + t.emailAddress;
        }
        
        const copyright = document.querySelector('.footer-bottom p');
        if (copyright) {
            copyright.innerHTML = '&copy; 2024 <span>' + (lang === 'ar' ? 'مؤمن كمبيوتر' : "MOEMEN'S COMPUTER") + '</span>. ' + t.copyright;
        }
        
        const cartHeader = document.querySelector('.cart-header h3');
        if (cartHeader) cartHeader.textContent = t.shoppingCart;
        
        const cartEmpty = document.querySelector('.cart-empty');
        if (cartEmpty) cartEmpty.textContent = t.cartEmpty;
        
        const cartTotalLabel = document.querySelector('.cart-total span:first-child');
        if (cartTotalLabel) cartTotalLabel.textContent = t.total;
        
        const customerNameInput = document.getElementById('customerName');
        if (customerNameInput) customerNameInput.placeholder = t.customerName;
        
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            if (lang === 'ar') {
                checkoutBtn.innerHTML = '<i class="fab fa-whatsapp"></i> ' + t.checkoutWhatsApp;
            } else {
                checkoutBtn.innerHTML = '<i class="fab fa-whatsapp"></i> ' + t.checkoutWhatsApp;
            }
        }
        
        const cartClose = document.querySelector('.cart-close');
        if (cartClose) {
            cartClose.innerHTML = '<i class="fas fa-times"></i>';
        }
        
        window.translatedNotifications = {
            addedToCart: t.addedToCart,
            cartEmptyError: t.cartEmptyError,
            orderSent: t.orderSent
        };
    }
    
    initParticles();
    
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const targetPosition = target.offsetTop - 70;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    const navLinks = document.getElementById('navLinks');
                    if (navLinks) navLinks.classList.remove('active');
                }
            }
        });
    });
    
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            
            var filter = this.getAttribute('data-filter');
            document.querySelectorAll('.product-card').forEach(function(card) {
                // Use case-insensitive comparison for reliable filtering
                var category = card.getAttribute('data-category');
                var originalCategory = card.getAttribute('data-original-category');
                
                if (filter === 'all' || 
                    (originalCategory && originalCategory.toLowerCase() === filter.toLowerCase()) || 
                    (category && category.toLowerCase() === filter.toLowerCase())) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    document.querySelectorAll('.stat-number').forEach(function(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        let animated = false;
        
        function isInViewport() {
            const rect = counter.getBoundingClientRect();
            return rect.top < window.innerHeight;
        }
        
        function animate() {
            const duration = 2000;
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(target * easeOut);
                
                if (target >= 1000) {
                    counter.textContent = current.toLocaleString() + '+';
                } else {
                    counter.textContent = current;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    if (target >= 1000) {
                        counter.textContent = target.toLocaleString() + '+';
                    } else {
                        counter.textContent = target;
                    }
                }
            }
            
            requestAnimationFrame(update);
        }
        
        function check() {
            if (isInViewport() && !animated) {
                animated = true;
                animate();
            }
        }
        
        setTimeout(check, 100);
        window.addEventListener('scroll', check);
    });
    
    const mobileMenuBtn = document.getElementById('mobileMenu');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const navLinks = document.getElementById('navLinks');
            if (navLinks) navLinks.classList.toggle('active');
        });
    }
    
    document.querySelectorAll('.btn-add-cart').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.product-card');
            const productName = this.getAttribute('data-name');
            const productPrice = this.getAttribute('data-price');
            const productPriceNum = parseFloat(productPrice);
            const productImage = this.getAttribute('data-image');
            const priceDisplay = card.querySelector('.price').textContent;
            
            const existingItem = cart.find(function(item) { return item.name === productName; });
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    name: productName,
                    price: priceDisplay,
                    priceNum: productPriceNum,
                    image: productImage,
                    quantity: 1
                });
            }
            
            this.classList.add('added');
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-cart-plus');
                icon.classList.add('fa-check');
            }
            
            updateCartCount();
            showNotification(window.translatedNotifications?.addedToCart || 'Added to cart!', 'success');
            
            setTimeout(function() {
                btn.classList.remove('added');
                if (icon) {
                    icon.classList.remove('fa-check');
                    icon.classList.add('fa-cart-plus');
                }
            }, 1500);
        });
    });
    
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', function() {
            cartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            renderCart();
        });
    }
    
    if (cartClose && cartModal) {
        cartClose.addEventListener('click', function() {
            cartModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (cartOverlay && cartModal) {
        cartOverlay.addEventListener('click', function() {
            cartModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification(window.translatedNotifications?.cartEmptyError || 'Your cart is empty!', 'error');
                return;
            }
            
            const t = translations[currentLang];
            const customerNameInput = document.getElementById('customerName');
            const customerName = customerNameInput && customerNameInput.value ? customerNameInput.value : (currentLang === 'ar' ? 'عميل' : 'Customer');
            
            const now = new Date();
            const dateOptions = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            const dateStr = now.toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US', dateOptions);
            
            let message = '*' + t.orderTitle + '*\n\n';
            message += '*' + t.customerLabel + '* ' + customerName + '\n';
            message += '*' + t.dateLabel + '* ' + dateStr + '\n\n';
            message += '*' + t.orderDetails + '*\n';
            message += '━━━━━━━━━━━━━━━━━━━━━━\n\n';
            
            let total = 0;
            cart.forEach(function(item) {
                const itemTotal = item.priceNum * item.quantity;
                total += itemTotal;
                message += '*' + item.name + '*\n';
                message += '  ' + t.priceLabel + ' $' + item.priceNum.toLocaleString() + '\n';
                message += '  ' + t.quantityLabel + ' ' + item.quantity + '\n';
                message += '  ' + t.subtotalLabel + ' $' + itemTotal.toLocaleString() + '\n\n';
            });
            
            message += '━━━━━━━━━━━━━━━━━━━━━━\n';
            message += '*' + t.totalLabel + ' $' + total.toLocaleString() + '*\n\n';
            message += '_' + t.thankYouMessage + '_';
            
            const encodedMessage = encodeURIComponent(message);
            window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodedMessage, '_blank');
            
            // Update customer count and order tracking after successful order
            if (typeof DataStore !== 'undefined') {
                DataStore.incrementCustomerCount();
                DataStore.incrementOrders();
            }
            
            // Clear cart after order
            cart = [];
            updateCartCount();
            renderCart();
            
            showNotification(window.translatedNotifications?.orderSent || 'Order sent to WhatsApp!', 'success');
        });
    }
    
    function updateCartCount() {
        const totalItems = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
        const cartCountEl = document.getElementById('cartCount');
        if (cartCountEl) {
            cartCountEl.textContent = totalItems;
        }
    }
    
    function renderCart() {
        const cartItemsEl = document.getElementById('cartItems');
        const cartTotalEl = document.getElementById('cartTotal');
        const t = translations[currentLang];
        
        if (!cartItemsEl || !cartTotalEl) return;
        
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="cart-empty">' + t.cartEmpty + '</p>';
            cartTotalEl.textContent = '$0';
            return;
        }
        
        let html = '';
        let total = 0;
        
        cart.forEach(function(item, index) {
            const itemTotal = item.priceNum * item.quantity;
            total += itemTotal;
            
            html += '<div class="cart-item">';
            html += '<div class="cart-item-image"><img src="' + item.image + '" alt="' + item.name + '"></div>';
            html += '<div class="cart-item-details">';
            html += '<h4>' + item.name + '</h4>';
            html += '<p class="cart-item-price" data-price-num="' + item.priceNum + '">' + item.price + '</p>';
            html += '<div class="cart-item-quantity">';
            html += '<button class="qty-btn qty-minus" data-index="' + index + '">-</button>';
            html += '<span>' + item.quantity + '</span>';
            html += '<button class="qty-btn qty-plus" data-index="' + index + '">+</button>';
            html += '</div></div></div>';
        });
        
        cartItemsEl.innerHTML = html;
        cartTotalEl.textContent = '$' + total.toLocaleString();
        
        document.querySelectorAll('.qty-minus').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                updateCartCount();
                renderCart();
            });
        });
        
        document.querySelectorAll('.qty-plus').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity++;
                updateCartCount();
                renderCart();
            });
        });
    }
    
    document.querySelectorAll('.btn-quick-view').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.product-card');
            const productName = card.querySelector('h3').textContent;
            const productDesc = card.querySelector('.product-desc').textContent;
            const priceEl = card.querySelector('.price');
            const productPrice = priceEl.textContent;
            const productPriceNum = parseFloat(priceEl.getAttribute('data-price')) || 0;
            const productImage = card.querySelector('img').src;
            const t = translations[currentLang];
            
            const modal = document.createElement('div');
            modal.className = 'quick-modal';
            modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:3000;display:flex;align-items:center;justify-content:center;padding:20px;';
            
            const closeBtnText = currentLang === 'ar' ? 'right:15px;left:auto;' : 'left:15px;right:auto;';
            
            modal.innerHTML = '<div style="background:#1e1e2e;max-width:700px;width:100%;border-radius:16px;position:relative;overflow:hidden;">' +
                '<button class="modal-close" style="position:absolute;top:15px;' + closeBtnText + 'background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;z-index:10;">&times;</button>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;">' +
                '<div><img src="' + productImage + '" style="width:100%;height:100%;object-fit:cover;"></div>' +
                '<div style="padding:30px;display:flex;flex-direction:column;justify-content:center;">' +
                '<h2 style="font-size:1.5rem;margin-bottom:10px;">' + productName + '</h2>' +
                '<p style="color:#888;margin-bottom:15px;font-size:0.9rem;">' + productDesc + '</p>' +
                '<p style="color:#00d4ff;font-size:1.8rem;font-weight:700;margin-bottom:20px;">' + productPrice + '</p>' +
                '<button class="modal-add-btn btn btn-primary" style="padding:12px 24px;">' + t.addToCart + '</button>' +
                '</div></div>';
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            modal.querySelector('.modal-close').addEventListener('click', function() {
                modal.remove();
                document.body.style.overflow = '';
            });
            
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.remove();
                    document.body.style.overflow = '';
                }
            });
            
            modal.querySelector('.modal-add-btn').addEventListener('click', function() {
                const existingItem = cart.find(function(item) { return item.name === productName; });
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({
                        name: productName,
                        price: productPrice,
                        priceNum: productPriceNum,
                        image: productImage,
                        quantity: 1
                    });
                }
                updateCartCount();
                showNotification(t.addedToCart, 'success');
                modal.remove();
                document.body.style.overflow = '';
            });
        });
    });
    
    function showNotification(message, type) {
        const notif = document.getElementById('notification');
        if (!notif) {
            const newNotif = document.createElement('div');
            newNotif.id = 'notification';
            newNotif.className = 'notification';
            document.body.appendChild(newNotif);
        }
        
        const notificationEl = document.getElementById('notification');
        notificationEl.textContent = message;
        notificationEl.className = 'notification show';
        
        if (type === 'success') {
            notificationEl.classList.add('success');
        } else if (type === 'error') {
            notificationEl.classList.add('error');
        }
        
        setTimeout(function() {
            notificationEl.classList.remove('show');
        }, 3000);
    }
    
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.style.cssText = 'position:fixed;bottom:25px;right:25px;width:45px;height:45px;background:linear-gradient(135deg,#00d4ff,#007bff);border:none;border-radius:50%;color:#0a0a0a;font-size:1rem;cursor:pointer;opacity:0;visibility:hidden;transition:all 0.3s;z-index:999;';
    document.body.appendChild(scrollBtn);
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    // Contact form is handled by EmailJS below
});

// Load Products from Data Store
function loadProductsFromStore() {
    if (typeof DataStore === 'undefined') {
        setTimeout(loadProductsFromStore, 100);
        return;
    }
    
    var handler = getDataHandler();
    
    // Check if handler supports real-time subscription (Firebase)
    if (handler.subscribe && handler.type === 'firebase') {
        // Use real-time listener for Firebase
        handler.subscribe('storefront', function(products) {
            console.log('Products updated via real-time listener:', products.length);
            generateCategoryFilters(products);
            renderProductsFromStore(products);
        });
        
        // Also do initial load to have data immediately
        handler.getAll().then(function(products) {
            generateCategoryFilters(products);
            renderProductsFromStore(products);
        }).catch(function(error) {
            // Silent fail - products will show as unavailable
        });
    } else {
        // Use regular getAll for localStorage or non-Firebase
        handler.getAll().then(function(products) {
            generateCategoryFilters(products);
            renderProductsFromStore(products);
        }).catch(function(error) {
            // Silent fail - products will show as unavailable
        });
    }
}

// Load and Apply Store Settings
function loadAndApplySettings() {
    if (typeof DataStore === 'undefined') {
        setTimeout(loadAndApplySettings, 100);
        return;
    }
    
    var settings = DataStore.getSettings();
    
    if (settings) {
        if (settings.storeName) {
            document.title = settings.storeName + ' - Premium Tech Store';
        }
        
        var heroTitle = document.querySelector('.hero-title .highlight');
        if (heroTitle && settings.storeName) {
            heroTitle.textContent = settings.storeName;
        }
        
        var locationText = document.querySelector('.contact-info .info-item:nth-child(1) p');
        if (locationText && settings.address) {
            locationText.textContent = settings.address;
        }
        
        var phoneText = document.querySelector('.contact-info .info-item:nth-child(2) p');
        if (phoneText && settings.whatsappNumber) {
            phoneText.textContent = '+' + settings.whatsappNumber;
        }
        
        var emailText = document.querySelector('.contact-info .info-item:nth-child(3) p');
        if (emailText && settings.email) {
            emailText.textContent = settings.email;
        }
        
        var hoursText = document.querySelector('.contact-info .info-item:nth-child(4) p');
        if (hoursText && settings.workingHours) {
            hoursText.textContent = settings.workingHours;
        }
        
        var footerBrand = document.querySelector('.footer-brand p');
        if (footerBrand && settings.aboutUs) {
            footerBrand.textContent = settings.aboutUs;
        }
        
        var footerContactItems = document.querySelectorAll('.footer-contact ul li');
        if (footerContactItems.length >= 3) {
            if (footerContactItems[0] && settings.address) {
                footerContactItems[0].innerHTML = '<i class="fas fa-map-marker-alt"></i> ' + settings.address;
            }
            if (footerContactItems[1] && settings.whatsappNumber) {
                footerContactItems[1].innerHTML = '<i class="fas fa-phone"></i> +' + settings.whatsappNumber;
            }
            if (footerContactItems[2] && settings.email) {
                footerContactItems[2].innerHTML = '<i class="fas fa-envelope"></i> ' + settings.email;
            }
        }
        
        if (settings.whatsappNumber) {
            WHATSAPP_NUMBER = settings.whatsappNumber;
            window.WHATSAPP_NUMBER = settings.whatsappNumber;
        }
        
        if (settings.currency) {
            window.storeCurrency = settings.currency;
            currentCurrency = settings.currency;
            updateAllPrices(settings.currency);
            updateCurrencyUI();
        }
    }
}

// Update all prices with new currency
function updateAllPrices(currency) {
    var priceElements = document.querySelectorAll('.price');
    priceElements.forEach(function(priceEl) {
        var priceValue = priceEl.getAttribute('data-price');
        if (priceValue) {
            priceEl.textContent = currency + parseFloat(priceValue).toFixed(2);
        }
    });
    
    var cartTotalEl = document.getElementById('cartTotal');
    if (cartTotalEl && cart.length > 0) {
        var total = cart.reduce(function(sum, item) { return sum + (item.priceNum * item.quantity); }, 0);
        cartTotalEl.textContent = currency + total.toLocaleString();
    }
}

// Generate Category Filters dynamically
function generateCategoryFilters(products) {
    var productsFilter = document.getElementById('productsFilter');
    if (!productsFilter) return;
    
    var productCategories = [];
    if (products && products.length > 0) {
        products.forEach(function(product) {
            if (product.category && !productCategories.includes(product.category)) {
                productCategories.push(product.category);
            }
        });
    }
    
    var savedCategories = [];
    if (typeof DataStore !== 'undefined' && typeof DataStore.getCategories === 'function') {
        savedCategories = DataStore.getCategories() || [];
    }
    
    var categories = [...new Set([...savedCategories, ...productCategories])];
    categories.sort();
    
    productsFilter.innerHTML = '<button class="filter-btn active" data-filter="all">All</button>';
    
    categories.forEach(function(category) {
        var btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.setAttribute('data-filter', category.toLowerCase());
        btn.textContent = category;
        productsFilter.appendChild(btn);
    });
    
    attachFilterEventListeners();
}

// Attach filter event listeners
function attachFilterEventListeners() {
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            
            var filter = this.getAttribute('data-filter');
            document.querySelectorAll('.product-card').forEach(function(card) {
                var category = card.getAttribute('data-category');
                var originalCategory = card.getAttribute('data-original-category');
                
                // Use case-insensitive comparison for reliable filtering
                if (filter === 'all' || 
                    (originalCategory && originalCategory.toLowerCase() === filter.toLowerCase()) || 
                    (category && category.toLowerCase() === filter.toLowerCase())) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function renderProductsFromStore(products) {
    var productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (!products || products.length === 0) {
        productsGrid.innerHTML = '<p style="text-align:center;color:#888;grid-column:1/-1;">No products available</p>';
        return;
    }
    
    products.forEach(function(product) {
        var category = product.category || 'accessories';
        var categoryClass = category.toLowerCase();
        var price = parseFloat(product.price || 0);
        var priceFormatted = formatPrice(price, currentCurrency);
        var nameEn = product.nameEn || 'Unnamed Product';
        var nameAr = product.nameAr || nameEn;
        var descEn = product.descriptionEn || '';
        var descAr = product.descriptionAr || descEn;
        var image = product.image || 'https://via.placeholder.com/400x300';
        
        var card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', categoryClass);
        card.setAttribute('data-original-category', category);
        card.setAttribute('data-name-en', nameEn);
        card.setAttribute('data-name-ar', nameAr);
        card.setAttribute('data-desc-en', descEn);
        card.setAttribute('data-desc-ar', descAr);
        
        var currentName = window.currentLang === 'ar' ? nameAr : nameEn;
        var currentDesc = window.currentLang === 'ar' ? descAr : descEn;
        
        card.innerHTML = 
            '<div class="product-image">' +
                '<img src="' + image + '" alt="' + currentName + '">' +
            '</div>' +
            '<div class="product-info">' +
                '<h3>' + currentName + '</h3>' +
                '<p class="product-desc">' + currentDesc + '</p>' +
                '<div class="product-price">' +
                    '<span class="price" data-price="' + price + '">' + priceFormatted + '</span>' +
                    '<button class="btn-add-cart" data-name="' + nameEn + '" data-name-ar="' + nameAr + '" data-price="' + price + '" data-image="' + image + '"><i class="fas fa-cart-plus"></i></button>' +
                '</div>' +
            '</div>' +
            '<div class="product-overlay">' +
                '<button class="btn-quick-view"> Quick View</button>' +
            '</div>';
        
        productsGrid.appendChild(card);
    });
    
    attachProductEventListeners();
}

// Translate products when language changes
function translateProducts(lang) {
    var productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(function(card) {
        var nameEn = card.getAttribute('data-name-en');
        var nameAr = card.getAttribute('data-name-ar');
        var descEn = card.getAttribute('data-desc-en');
        var descAr = card.getAttribute('data-desc-ar');
        
        var nameEl = card.querySelector('.product-info h3');
        var descEl = card.querySelector('.product-desc');
        
        if (nameEl) {
            nameEl.textContent = lang === 'ar' ? nameAr : nameEn;
        }
        if (descEl) {
            descEl.textContent = lang === 'ar' ? descAr : descEn;
        }
    });
    
    translateCartItems(lang);
}

// Translate cart items
function translateCartItems(lang) {
    var cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach(function(item) {
        var nameEl = item.querySelector('h4');
        if (nameEl) {
            var btn = item.querySelector('.btn-add-cart');
            if (btn && lang === 'ar') {
                var nameAr = btn.getAttribute('data-name-ar');
                if (nameAr) {
                    nameEl.textContent = nameAr;
                }
            }
        }
    });
}

// Attach event listeners to dynamically created products
function attachProductEventListeners() {
    document.querySelectorAll('.btn-add-cart').forEach(function(btn) {
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var card = this.closest('.product-card');
            var productName = this.getAttribute('data-name');
            var productPrice = this.getAttribute('data-price');
            var productPriceNum = parseFloat(productPrice);
            var productImage = this.getAttribute('data-image');
            var priceDisplay = card.querySelector('.price').textContent;
            
            var existingItem = cart.find(function(item) { return item.name === productName; });
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    name: productName,
                    price: priceDisplay,
                    priceNum: productPriceNum,
                    image: productImage,
                    quantity: 1
                });
            }
            
            this.classList.add('added');
            var icon = this.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-cart-plus');
                icon.classList.add('fa-check');
            }
            
            updateCartCount();
            showNotification('Added to cart!', 'success');
            
            setTimeout(function() {
                btn.classList.remove('added');
                if (icon) {
                    icon.classList.remove('fa-check');
                    icon.classList.add('fa-cart-plus');
                }
            }, 1500);
        };
    });
    
    document.querySelectorAll('.btn-quick-view').forEach(function(btn) {
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var card = this.closest('.product-card');
            var productName = card.querySelector('h3').textContent;
            var productDesc = card.querySelector('.product-desc').textContent;
            var priceEl = card.querySelector('.price');
            var productPrice = priceEl.textContent;
            var productPriceNum = parseFloat(priceEl.getAttribute('data-price')) || 0;
            var productImage = card.querySelector('img').src;
            
            var modal = document.createElement('div');
            modal.className = 'quick-modal';
            modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:3000;display:flex;align-items:center;justify-content:center;padding:20px;';
            
            modal.innerHTML = '<div style="background:#1e1e2e;max-width:700px;width:100%;border-radius:16px;position:relative;overflow:hidden;">' +
                '<button class="modal-close" style="position:absolute;top:15px;right:15px;background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;z-index:10;">&times;</button>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;">' +
                '<div><img src="' + productImage + '" style="width:100%;height:100%;object-fit:cover;"></div>' +
                '<div style="padding:30px;display:flex;flex-direction:column;justify-content:center;">' +
                '<h2 style="font-size:1.5rem;margin-bottom:10px;">' + productName + '</h2>' +
                '<p style="color:#888;margin-bottom:15px;font-size:0.9rem;">' + productDesc + '</p>' +
                '<p style="color:#00d4ff;font-size:1.8rem;font-weight:700;margin-bottom:20px;">' + productPrice + '</p>' +
                '<button class="modal-add-btn btn btn-primary" style="padding:12px 24px;">Add to Cart</button>' +
                '</div></div>';
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            modal.querySelector('.modal-close').onclick = function() {
                modal.remove();
                document.body.style.overflow = '';
            };
            
            modal.onclick = function(e) {
                if (e.target === modal) {
                    modal.remove();
                    document.body.style.overflow = '';
                }
            };
            
            modal.querySelector('.modal-add-btn').onclick = function() {
                var existingItem = cart.find(function(item) { return item.name === productName; });
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({
                        name: productName,
                        price: productPrice,
                        priceNum: productPriceNum,
                        image: productImage,
                        quantity: 1
                    });
                }
                updateCartCount();
                showNotification('Added to cart!', 'success');
                modal.remove();
                document.body.style.overflow = '';
            };
        };
    });
}

// Particles initialization with null check
function initParticles() {
    var container = document.getElementById('particles');
    if (!container) return;
    
    if (container.querySelectorAll('.particle').length > 0) return;
    
    for (var i = 0; i < 25; i++) {
        var p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 15 + 's';
        p.style.animationDuration = (Math.random() * 10 + 10) + 's';
        container.appendChild(p);
    }
}

// Global function to update cart count
function updateCartCount() {
    var totalItems = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
    var cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
    }
}

// Global function to show notification
function showNotification(message, type) {
    var notif = document.getElementById('notification');
    if (!notif) {
        var newNotif = document.createElement('div');
        newNotif.id = 'notification';
        newNotif.className = 'notification';
        document.body.appendChild(newNotif);
    }
    
    var notificationEl = document.getElementById('notification');
    notificationEl.textContent = message;
    notificationEl.className = 'notification show';
    
    if (type === 'success') {
        notificationEl.classList.add('success');
    } else if (type === 'error') {
        notificationEl.classList.add('error');
    }
    
    setTimeout(function() {
        notificationEl.classList.remove('show');
    }, 3000);
}

// EmailJS Contact Form Handler
(function () {
  if (typeof emailjs !== 'undefined') {
    try {
      emailjs.init("HUxbDHk5jYaR8Wugx");
    } catch (error) {
      // Silent fail - form will use fallback
    }
  }
})();

document.addEventListener('DOMContentLoaded', function() {
  var contactForm = document.getElementById("contactForm");
  if (!contactForm) return;
  
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var nameInput = document.getElementById("name");
    var emailInput = document.getElementById("email");
    var messageInput = document.getElementById("message");
    
    if (!nameInput || !emailInput || !messageInput) {
      alert("Error: Form inputs not found. Please refresh the page.");
      return;
    }
    
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var message = messageInput.value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    var submitBtn = this.querySelector('button[type="submit"]');
    var originalBtnText = submitBtn.innerHTML;

    if (typeof emailjs === 'undefined') {
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      submitBtn.style.background = '#28a745';
      submitBtn.disabled = true;
      
      alert("Thank you for your message! We will get back to you soon.");
      contactForm.reset();
      
      setTimeout(function() {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
      return;
    }

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    var templateParams = {
      from_name: name,
      from_email: email,
      message: message,
      to_email: "moemencomputer@gmail.com"
    };

    emailjs
      .send("service_g8jzz4k", "template_3wc071s", templateParams)
      .then(function (response) {
        alert("Message sent successfully!");
        contactForm.reset();
      })
      .catch(function (error) {
        alert("Failed to send message. Please try again or contact us directly.");
      })
      .finally(function () {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      });
  });
});


