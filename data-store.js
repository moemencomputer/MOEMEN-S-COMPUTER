// Data Store - LocalStorage fallback for Firebase
// This provides a working demo mode when Firebase is not configured

const DataStore = {
    // Default categories
    defaultCategories: ['Laptops', 'Desktops', 'Gaming', 'Accessories', 'Components', 'Networking', 'Peripherals'],
    
    // Default settings
    defaultSettings: {
        storeName: 'MOEMEN-S COMPUTER',
        storeNameAr: 'مؤمن كمبيوتر',
        whatsappNumber: '96171512981',
        currency: '$',
        email: 'info@moemencomputer.com',
        address: 'Fouad Chehab Street, Tripoli, Lebanon',
        workingHours: 'Sat - Thu: 9AM - 9PM',
        aboutUs: 'We are a premier destination for all your computing needs.',
        facebookLink: 'https://www.facebook.com/share/1CvUKPNp6V/',
        instagramLink: 'https://www.instagram.com/moemen.s.computers?igsh=N242eXdobHBqcXJq',
        customerCount: 500,
        totalOrders: 0
    },
    
    // Get categories from localStorage
    getCategories: function() {
        const data = localStorage.getItem('moumens_categories');
        if (data) {
            return JSON.parse(data);
        }
        // Initialize with default categories
        this.saveCategories(this.defaultCategories);
        return this.defaultCategories;
    },
    
    // Save categories to localStorage
    saveCategories: function(categories) {
        localStorage.setItem('moumens_categories', JSON.stringify(categories));
    },
    
    // Add a new category
    addCategory: function(categoryName) {
        const categories = this.getCategories();
        if (!categories.includes(categoryName)) {
            categories.push(categoryName);
            this.saveCategories(categories);
            return true;
        }
        return false;
    },
    
    // Delete a category
    deleteCategory: function(categoryName) {
        const categories = this.getCategories();
        const filtered = categories.filter(c => c !== categoryName);
        this.saveCategories(filtered);
        return true;
    },
    
    // Get unique categories from existing products
    getCategoriesFromProducts: function() {
        const products = this.getProducts();
        const productCategories = products.map(p => p.category).filter(c => c);
        const uniqueCategories = [...new Set(productCategories)];
        
        // Merge with saved categories
        const savedCategories = this.getCategories();
        const allCategories = [...new Set([...savedCategories, ...uniqueCategories])];
        
        return allCategories;
    },
    
    // Get settings from localStorage
    getSettings: function() {
        const data = localStorage.getItem('moumens_settings');
        if (data) {
            return { ...this.defaultSettings, ...JSON.parse(data) };
        }
        // Initialize with default settings
        this.saveSettings(this.defaultSettings);
        return this.defaultSettings;
    },
    
    // Save settings to localStorage
    saveSettings: function(settings) {
        localStorage.setItem('moumens_settings', JSON.stringify(settings));
    },
    
    // Update customer count
    incrementCustomerCount: function() {
        const settings = this.getSettings();
        settings.customerCount = (settings.customerCount || 0) + 1;
        this.saveSettings(settings);
        return settings.customerCount;
    },
    
    // Get customer count
    getCustomerCount: function() {
        const settings = this.getSettings();
        return settings.customerCount || 500;
    },
    
    // Update total orders
    incrementOrders: function() {
        const settings = this.getSettings();
        settings.totalOrders = (settings.totalOrders || 0) + 1;
        this.saveSettings(settings);
        return settings.totalOrders;
    },
    
    // Get products from localStorage
    getProducts: function() {
        const data = localStorage.getItem('moumens_products');
        return data ? JSON.parse(data) : [];
    },
    
    // Save products to localStorage
    saveProducts: function(products) {
        localStorage.setItem('moumens_products', JSON.stringify(products));
    },
    
    // Add a new product
    addProduct: function(productData) {
        const products = this.getProducts();
        const newProduct = {
            id: 'prod_' + Date.now(),
            ...productData,
            quantity: productData.quantity || 0,
            sold: 0,
            createdAt: new Date().toISOString()
        };
        products.unshift(newProduct);
        this.saveProducts(products);
        return newProduct;
    },
    
    // Update a product
    updateProduct: function(productId, productData) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData, updatedAt: new Date().toISOString() };
            this.saveProducts(products);
            return products[index];
        }
        return null;
    },
    
    // Decrease product quantity when sold
    decreaseQuantity: function(productId, amount) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products[index].quantity = Math.max(0, (products[index].quantity || 0) - amount);
            products[index].sold = (products[index].sold || 0) + amount;
            this.saveProducts(products);
            return products[index];
        }
        return null;
    },
    
    // Delete a product
    deleteProduct: function(productId) {
        const products = this.getProducts();
        const filtered = products.filter(p => p.id !== productId);
        this.saveProducts(filtered);
        return true;
    },
    
    // Get product by ID
    getProduct: function(productId) {
        const products = this.getProducts();
        return products.find(p => p.id === productId) || null;
    },
    
    // Get total products count
    getTotalProductsCount: function() {
        const products = this.getProducts();
        return products.length;
    }
};

// Check if Firebase is configured and initialized properly
function isFirebaseConfigured() {
    // Check if firebase is available and initialized
    if (typeof firebase === 'undefined') {
        console.log('Firebase SDK not loaded');
        return false;
    }
    
    // Check if we have a valid config
    if (!window.firebaseConfig) {
        console.log('Firebase config not found');
        return false;
    }
    
    // Check if using placeholder values
    if (window.firebaseConfig.apiKey && window.firebaseConfig.apiKey.includes('YOUR_')) {
        console.log('Firebase using placeholder API key');
        return false;
    }
    
    // Check if db was initialized successfully
    if (!window.db) {
        console.log('Firestore database not initialized');
        return false;
    }
    
    console.log('Firebase is properly configured');
    return true;
}

// Get the appropriate data handler
function getDataHandler() {
    // Check if Firebase is available and properly initialized
    const firebaseReady = isFirebaseConfigured() && 
                          typeof window.productsRef !== 'undefined' && 
                          window.productsRef !== null && 
                          typeof firebase !== 'undefined';
    
    if (firebaseReady) {
        console.log('Using Firebase Firestore for data');
        
        // Store for active listeners and callbacks
        var firebaseListeners = {};
        var firebaseCallbacks = {};
        
        return {
            type: 'firebase',
            // Set up a real-time listener for products
            // callback: function that will be called when products change
            // listenerId: unique identifier for this listener (e.g., 'admin' or 'storefront')
            subscribe: function(listenerId, callback) {
                firebaseCallbacks[listenerId] = callback;
                
                // If we already have products loaded, send them immediately
                if (firebaseListeners[listenerId] && firebaseListeners[listenerId].products) {
                    callback(firebaseListeners[listenerId].products);
                }
                
                // If listener doesn't exist yet, create it
                if (!firebaseListeners[listenerId]) {
                    firebaseListeners[listenerId] = {
                        unsubscribe: null,
                        products: []
                    };
                    
                    // Set up real-time listener with onSnapshot
                    firebaseListeners[listenerId].unsubscribe = window.productsRef
                        .orderBy('createdAt', 'desc')
                        .onSnapshot(function(snapshot) {
                            var products = snapshot.docs.map(function(doc) {
                                return { id: doc.id, ...doc.data() };
                            });
                            console.log('Firebase products updated via real-time listener:', products.length);
                            
                            // Store products
                            firebaseListeners[listenerId].products = products;
                            
                            // Call all registered callbacks
                            Object.keys(firebaseCallbacks).forEach(function(key) {
                                if (firebaseCallbacks[key]) {
                                    firebaseCallbacks[key](products);
                                }
                            });
                        }, function(error) {
                            console.error('Firebase real-time listener error:', error);
                            // Fall back to localStorage on error
                            if (firebaseCallbacks[listenerId]) {
                                firebaseCallbacks[listenerId](DataStore.getProducts());
                            }
                        });
                }
                
                // Return unsubscribe function
                return function() {
                    delete firebaseCallbacks[listenerId];
                    // Note: We keep the listener active as other callbacks might still need it
                };
            },
            // Keep getAll for backward compatibility - uses one-time fetch
            getAll: async function() {
                try {
                    const snapshot = await window.productsRef.orderBy('createdAt', 'desc').get();
                    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    console.log('Firebase products loaded:', products.length);
                    return products;
                } catch (error) {
                    console.error('Error loading from Firebase:', error);
                    // Fall back to localStorage on error
                    console.log('Falling back to localStorage');
                    return DataStore.getProducts();
                }
            },
            add: async function(data) {
                try {
                    const docRef = await window.productsRef.add({
                        ...data,
                        quantity: data.quantity || 0,
                        sold: 0,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    console.log('Product added to Firebase:', docRef.id);
                    return { id: docRef.id, ...data };
                } catch (error) {
                    console.error('Error adding to Firebase:', error);
                    // Fall back to localStorage
                    return DataStore.addProduct(data);
                }
            },
            update: async function(id, data) {
                try {
                    await window.productsRef.doc(id).update({
                        ...data,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    console.log('Product updated in Firebase:', id);
                    return { id, ...data };
                } catch (error) {
                    console.error('Error updating in Firebase:', error);
                    return DataStore.updateProduct(id, data);
                }
            },
            delete: async function(id) {
                try {
                    await window.productsRef.doc(id).delete();
                    console.log('Product deleted from Firebase:', id);
                    return true;
                } catch (error) {
                    console.error('Error deleting from Firebase:', error);
                    return DataStore.deleteProduct(id);
                }
            }
        };
    } else {
        // Use localStorage fallback
        console.log('Using localStorage fallback (Firebase not configured or failed)');
        console.log('Firebase status:', {
            firebaseDefined: typeof firebase !== 'undefined',
            configExists: !!window.firebaseConfig,
            dbExists: !!window.db,
            productsRefExists: !!window.productsRef
        });
        return {
            type: 'local',
            getAll: async function() {
                return DataStore.getProducts();
            },
            add: async function(data) {
                return DataStore.addProduct(data);
            },
            update: async function(id, data) {
                return DataStore.updateProduct(id, data);
            },
            delete: async function(id) {
                return DataStore.deleteProduct(id);
            }
        };
    }
}
