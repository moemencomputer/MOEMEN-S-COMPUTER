// Admin Panel JavaScript - Updated for ImgBB Upload with Compression & Drag/Drop

// Global variables
let products = [];
let categories = [];
let currentProductId = null;
let uploadedImageUrl = '';
let dataHandler = null;
let imgbbApiKey = '162b5c141c1ad4e58ecf23ac96feff7a'; // Default key

// DOM Elements
const productsTableBody = document.getElementById('productsTableBody');
const loadingProducts = document.getElementById('loadingProducts');
const emptyProducts = document.getElementById('emptyProducts');
const productModal = document.getElementById('productModal');
const deleteModal = document.getElementById('deleteModal');
const productForm = document.getElementById('productForm');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Image upload elements
const imageUploadZone = document.getElementById('imageUploadZone');
const productImageInput = document.getElementById('productImage');
const uploadProgressContainer = document.getElementById('uploadProgressContainer');
const uploadProgressFill = document.getElementById('uploadProgressFill');
const uploadStatus = document.getElementById('uploadStatus');
const imageActions = document.getElementById('imageActions');
const replaceImageBtn = document.getElementById('replaceImageBtn');
const removeImageBtn = document.getElementById('removeImageBtn');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreviewImg = document.getElementById('imagePreviewImg');
const productImageUrlInput = document.getElementById('productImageUrl');

// Settings elements
const imgbbApiKeyInput = document.getElementById('imgbbApiKey');

// Check authentication state before initializing
auth.onAuthStateChanged(function(user) {
    if (!user) {
        window.location.href = 'admin-login.html';
    } else {
        console.log('User authenticated:', user.email);
        initAdmin();
    }
});

// Initialize Admin Panel
function initAdmin() {
    console.log('Admin panel initializing...');
    
    dataHandler = getDataHandler();
    console.log('Data handler type:', dataHandler.type);
    
    loadSettings(); // Load settings first (includes API key)
    loadCategories();
    loadProducts();
    setupEventListeners();
    console.log('Setup complete');
}

// Load Settings (including ImgBB API key)
function loadSettings() {
    const settings = DataStore.getSettings();
    
    // Load ImgBB API key
    imgbbApiKeyInput.value = settings.imgbbApiKey || '';
    imgbbApiKey = settings.imgbbApiKey || imgbbApiKey;
    
    document.getElementById('storeName').value = settings.storeName || '';
    document.getElementById('storeNameAr').value = settings.storeNameAr || '';
    document.getElementById('aboutUs').value = settings.aboutUs || '';
    document.getElementById('whatsappNumber').value = settings.whatsappNumber || '';
    document.getElementById('storeEmail').value = settings.email || '';
    document.getElementById('storeAddress').value = settings.address || '';
    document.getElementById('workingHours').value = settings.workingHours || '';
    document.getElementById('currency').value = settings.currency || '$';
    document.getElementById('facebookLink').value = settings.facebookLink || '';
    document.getElementById('instagramLink').value = settings.instagramLink || '';
}

// Save Settings (including ImgBB API key)
function saveSettings() {
    const settings = {
        storeName: document.getElementById('storeName').value.trim(),
        storeNameAr: document.getElementById('storeNameAr').value.trim(),
        aboutUs: document.getElementById('aboutUs').value.trim(),
        whatsappNumber: document.getElementById('whatsappNumber').value.trim(),
        email: document.getElementById('storeEmail').value.trim(),
        address: document.getElementById('storeAddress').value.trim(),
        workingHours: document.getElementById('workingHours').value.trim(),
        currency: document.getElementById('currency').value,
        facebookLink: document.getElementById('facebookLink').value.trim(),
        instagramLink: document.getElementById('instagramLink').value.trim(),
        imgbbApiKey: document.getElementById('imgbbApiKey').value.trim() // Save API key
    };
    
    // Validate API key
    if (!settings.imgbbApiKey) {
        showToast('Please enter ImgBB API key in settings', 'error');
        return;
    }
    
    imgbbApiKey = settings.imgbbApiKey;
    DataStore.saveSettings(settings);
    showToast('Settings saved successfully! ImgBB API key configured.', 'success');
}

// Load Categories (unchanged)
function loadCategories() {
    if (dataHandler.type === 'local') {
        categories = DataStore.getCategories();
    } else {
        categories = DataStore.defaultCategories || ['Laptops', 'Desktops', 'Accessories', 'Components', 'Networking', 'Peripherals'];
    }
    
    const productCategories = DataStore.getCategoriesFromProducts();
    categories = [...new Set([...categories, ...productCategories])];
    
    renderCategories();
    updateProductCategoryDropdown();
}

// ... (keep all existing functions: renderCategories, deleteCategory, updateProductCategoryDropdown, addNewCategory unchanged)

function renderCategories() {
    const categoriesList = document.getElementById('categoriesList');
    if (!categoriesList) return;
    
    if (categories.length === 0) {
        categoriesList.innerHTML = '<p class="empty-message">No categories found. Add your first category!</p>';
        return;
    }
    
    let html = '<div class="category-tags">';
    categories.forEach(function(category) {
        html += '<span class="category-tag">';
        html += '<i class="fas fa-tag"></i> ' + category;
        html += '<button class="delete-category-btn" data-category="' + category + '"><i class="fas fa-times"></i></button>';
        html += '</span>';
    });
    html += '</div>';
    
    categoriesList.innerHTML = html;
    
    document.querySelectorAll('.delete-category-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            deleteCategory(category);
        });
    });
}

function deleteCategory(categoryName) {
    if (confirm('Are you sure you want to delete the category "' + categoryName + '"?')) {
        DataStore.deleteCategory(categoryName);
        categories = categories.filter(c => c !== categoryName);
        renderCategories();
        updateProductCategoryDropdown();
        showToast('Category deleted successfully!', 'success');
    }
}

function updateProductCategoryDropdown() {
    const categorySelect = document.getElementById('productCategory');
    if (!categorySelect) return;
    
    const currentValue = categorySelect.value;
    
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    categories.forEach(function(category) {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    
    if (currentValue && categories.includes(currentValue)) {
        categorySelect.value = currentValue;
    }
}

function addNewCategory() {
   const categoryEN = document.getElementById("category_en").value;
const categoryAR = document.getElementById("category_ar").value;

addDoc(collection(db, "categories"), {
  name_en: categoryEN,
  name_ar: categoryAR
});
    
    if (!categoryName) {
        showToast('Please enter a category name', 'error');
        return;
    }
    
    if (categories.includes(categoryName)) {
        showToast('Category already exists', 'error');
        return;
    }
    
    DataStore.addCategory(categoryName);
    categories.push(categoryName);
    
    categoryInput.value = '';
    renderCategories();
    updateProductCategoryDropdown();
    showToast('Category added successfully!', 'success');
}

// Load Products (unchanged)
async function loadProducts() {
    try {
        loadingProducts.style.display = 'block';
        emptyProducts.style.display = 'none';
        productsTableBody.innerHTML = '';

        console.log('Loading products...');

        if (dataHandler.subscribe && dataHandler.type === 'firebase') {
            dataHandler.subscribe('admin', function(updatedProducts) {
                console.log('Products updated via real-time listener:', updatedProducts.length);
                loadingProducts.style.display = 'none';
                products = updatedProducts;
                
                if (updatedProducts.length === 0) {
                    emptyProducts.style.display = 'block';
                    productsTableBody.innerHTML = '';
                } else {
                    renderProductsRealTime(updatedProducts);
                }
            });
            
            products = await dataHandler.getAll();
        } else {
            products = await dataHandler.getAll();
        }
        
        console.log('Products loaded:', products.length);
        loadingProducts.style.display = 'none';

        if (products.length === 0) {
            emptyProducts.style.display = 'block';
        } else {
            renderProducts();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Error loading products: ' + error.message, 'error');
        loadingProducts.style.display = 'none';
    }
}

function renderProducts() {
    renderProductsRealTime(products);
}

function renderProductsRealTime(productsList) {
    productsTableBody.innerHTML = '';

    productsList.forEach(function(product) {
        const row = document.createElement('tr');
        row.innerHTML = 
            '<td><img src="' + (product.image || 'https://via.placeholder.com/60') + '" alt="' + (product.nameEn || 'Product') + '"></td>' +
            '<td>' + (product.nameEn || 'Unnamed') + '</td>' +
            '<td>' + (product.category || 'Uncategorized') + '</td>' +
            '<td>$' + parseFloat(product.price || 0).toFixed(2) + '</td>' +
            '<td class="actions">' +
                '<button class="edit-btn" onclick="editProduct(\'' + product.id + '\')" title="Edit">' +
                    '<i class="fas fa-edit"></i>' +
                '</button>' +
                '<button class="delete-btn" onclick="deleteProduct(\'' + product.id + '\')" title="Delete">' +
                    '<i class="fas fa-trash"></i>' +
                '</button>' +
            '</td>';
        productsTableBody.appendChild(row);
    });
}

// Open Product Modal (enhanced for existing images)
function openProductModal(productId) {
    currentProductId = productId;
    document.getElementById('modalTitle').textContent = productId ? 'Edit Product' : 'Add New Product';
    document.getElementById('saveProductBtn').innerHTML = productId ? 
        '<i class="fas fa-save"></i> Update Product' : 
        '<i class="fas fa-save"></i> Save Product';
    
    productForm.reset();
    resetImageUpload();
    uploadedImageUrl = '';

    if (productId) {
        const product = products.find(function(p) { return p.id === productId; });
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productNameEn').value = product.nameEn || '';
            document.getElementById('productNameAr').value = product.nameAr || '';
            document.getElementById('productCategory').value = product.category || '';
            document.getElementById('productPrice').value = product.price || '';
            document.getElementById('productDescEn').value = product.descriptionEn || '';
            document.getElementById('productDescAr').value = product.descriptionAr || '';
            document.getElementById('productImageUrl').value = product.image || '';
            
            if (product.image) {
                uploadedImageUrl = product.image;
                showImagePreview(product.image);
                showImageActions();
            }
        }
    }

    productModal.classList.add('active');
}

// Reset image upload UI to initial state
function resetImageUpload() {
    imageUploadZone.classList.remove('dragover', 'uploading', 'has-image');
    uploadProgressContainer.classList.remove('show');
    imageActions.classList.remove('show');
    imagePreviewContainer.style.display = 'none';
    imagePreviewImg.src = '';
    productImageInput.value = '';
    uploadedImageUrl = '';
    document.getElementById('productImageUrl').value = '';
}

// Show image preview
function showImagePreview(imageSrc) {
    imagePreviewContainer.style.display = 'block';
    imagePreviewImg.src = imageSrc;
    imageUploadZone.classList.add('has-image');
}

// Show image actions (replace/remove)
function showImageActions() {
    imageActions.classList.add('show');
}

// **ENHANCED IMAGE UPLOAD with ImgBB + Compression + Drag/Drop**
function handleImageUpload(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
        return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showToast('Image size must be less than 10MB', 'error');
        return;
    }

    uploadImageToImgBB(file);
}

async function uploadImageToImgBB(file) {
    try {
        // Show uploading state
        imageUploadZone.classList.add('uploading');
        uploadProgressContainer.classList.add('show');
        uploadStatus.textContent = 'Compressing image...';
        uploadProgressFill.style.width = '20%';

        // 1. Compress image
        const compressedFile = await compressImage(file);
        uploadStatus.textContent = 'Uploading to ImgBB...';
        uploadProgressFill.style.width = '40%';

        // 2. Upload to ImgBB
        const imgbbUrl = await uploadToImgBB(compressedFile);
        
        // 3. Success
        uploadedImageUrl = imgbbUrl;
        document.getElementById('productImageUrl').value = imgbbUrl;
        
        showImagePreview(imgbbUrl);
        showImageActions();
        
        imageUploadZone.classList.remove('uploading');
        uploadProgressContainer.classList.remove('show');
        
        showToast('✅ Image uploaded successfully to ImgBB!', 'success');
        
    } catch (error) {
        console.error('Upload failed:', error);
        imageUploadZone.classList.remove('uploading');
        uploadProgressContainer.classList.remove('show');
        showToast('❌ Upload failed: ' + error.message, 'error');
    }
}

// Compress image using Canvas (max 1920px, 80% quality)
function compressImage(file) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // Max dimensions
            const maxWidth = 1920;
            const maxHeight = 1920;
            
            let { width, height } = img;
            
            // Resize if too large
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
                (blob) => {
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    resolve(compressedFile);
                },
                'image/jpeg',
                0.8 // 80% quality
            );
        };
        
        img.src = URL.createObjectURL(file);
    });
}

// Upload to ImgBB with progress tracking
function uploadToImgBB(file) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('key', imgbbApiKey);
        formData.append('image', file);
        
        const xhr = new XMLHttpRequest();
        
        // Progress tracking
        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 60 + 40); // 40-100%
                uploadProgressFill.style.width = percent + '%';
                uploadStatus.textContent = `Uploading... ${percent}%`;
            }
        });
        
        xhr.onload = function() {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success && response.data.url) {
                    resolve(response.data.url);
                } else {
                    reject(new Error(response.error?.message || 'Upload failed'));
                }
            } catch (e) {
                reject(new Error('Invalid response from ImgBB'));
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('Network error during upload'));
        };
        
        xhr.open('POST', 'https://api.imgbb.com/1/upload');
        xhr.send(formData);
    });
}

// Drag & Drop Support
imageUploadZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    imageUploadZone.classList.add('dragover');
});

imageUploadZone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    imageUploadZone.classList.remove('dragover');
});

imageUploadZone.addEventListener('drop', function(e) {
    e.preventDefault();
    imageUploadZone.classList.remove('dragover');
    handleImageUpload(e);
});

// Click to upload
imageUploadZone.addEventListener('click', function(e) {
    if (e.target !== productImageInput) {
        productImageInput.click();
    }
});

productImageInput.addEventListener('change', handleImageUpload);

// Image action buttons
replaceImageBtn.addEventListener('click', function() {
    productImageInput.click();
});

removeImageBtn.addEventListener('click', function() {
    resetImageUpload();
    showToast('Image removed', 'success');
});

// Validate API key before form submit
productForm.addEventListener('submit', function(e) {
    if (!uploadedImageUrl && !document.getElementById('productImageUrl').value) {
        e.preventDefault();
        showToast('Please upload a product image first', 'error');
        return;
    }
    if (!imgbbApiKey) {
        e.preventDefault();
        showToast('Please configure ImgBB API key in Settings', 'error');
        return;
    }
    handleProductSubmit(e);
});

// Keep existing handleProductSubmit (unchanged)
async function handleProductSubmit(e) {
    e.preventDefault();

    const nameEn = document.getElementById('productNameEn').value.trim();
    const nameAr = document.getElementById('productNameAr').value.trim();
    const category = document.getElementById('productCategory').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const descriptionEn = document.getElementById('productDescEn').value.trim();
    const descriptionAr = document.getElementById('productDescAr').value.trim();
    const imageUrl = uploadedImageUrl || document.getElementById('productImageUrl').value;

    if (!nameEn || !nameAr || !category || !price || !imageUrl) {
        showToast('Please fill in all required fields including image', 'error');
        return;
    }

    const productData = {
        nameEn,
        nameAr,
        category,
        price,
        descriptionEn,
        descriptionAr,
        image: imageUrl
    };

    try {
        if (currentProductId) {
            await dataHandler.update(currentProductId, productData);
            showToast('Product updated successfully!', 'success');
        } else {
            await dataHandler.add(productData);
            showToast('Product added successfully to ImgBB + Firestore!', 'success');
        }

        closeProductModal();
        loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        showToast('Error saving product: ' + error.message, 'error');
    }
}

function closeProductModal() {
    productModal.classList.remove('active');
    currentProductId = null;
    resetImageUpload();
}

// Setup Event Listeners (add new ones)
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Existing listeners...
    document.getElementById('addProductBtn').addEventListener('click', () => openProductModal());
    document.getElementById('closeModal').addEventListener('click', closeProductModal);
    document.getElementById('cancelBtn').addEventListener('click', closeProductModal);
    
    productModal.addEventListener('click', function(e) {
        if (e.target === productModal) closeProductModal();
    });
    
    // Settings save
    document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
    
    // Navigation, logout, etc. (existing code)
    document.querySelectorAll('.admin-sidebar nav a').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('addCategoryBtn').addEventListener('click', addNewCategory);
    
    const newCategoryName = document.getElementById('newCategoryName');
    if (newCategoryName) {
        newCategoryName.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addNewCategory();
        });
    }
    
    // Delete modal (existing)
    document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDeleteBtn').addEventListener('click', async function() {
        if (!currentProductId) return;
        try {
            await dataHandler.delete(currentProductId);
            showToast('Product deleted successfully!', 'success');
            closeDeleteModal();
            loadProducts();
        } catch (error) {
            showToast('Error deleting product: ' + error.message, 'error');
        }
    });
    
    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) closeDeleteModal();
    });

    console.log('All event listeners set up including ImgBB upload');
}

// Keep all existing functions: handleNavigation, handleLogout, showToast, editProduct, deleteProduct
function editProduct(productId) {
    openProductModal(productId);
}

function deleteProduct(productId) {
    currentProductId = productId;
    var product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('deleteProductName').textContent = product.nameEn;
    }
    deleteModal.classList.add('active');
}

function handleNavigation(e) {
    e.preventDefault();
    
    document.querySelectorAll('.admin-sidebar nav a').forEach(link => {
        link.classList.remove('active');
    });
    e.target.closest('a').classList.add('active');

    const section = e.target.closest('a').dataset.section;
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(section + '-section').classList.add('active');
}

function handleLogout() {
    auth.signOut().then(() => {
        window.location.href = 'admin-login.html';
    }).catch(error => {
        console.error('Error signing out:', error);
        window.location.href = 'admin-login.html';
    });
}

function showToast(message, type) {
    type = type || 'success';
    toastMessage.textContent = message;
    toast.className = 'toast';
    if (type === 'error') toast.classList.add('error');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function closeDeleteModal() {
    deleteModal.classList.remove('active');
    currentProductId = null;
}

// Export functions for global use (table onclick handlers)
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;


