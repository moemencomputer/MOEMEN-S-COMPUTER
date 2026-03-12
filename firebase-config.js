// Firebase Configuration
// Replace these values with your Firebase project credentials
// Get them from: Firebase Console -> Project Settings -> General -> Your apps

window.firebaseConfig = {
  apiKey: "AIzaSyCvxX5jmjN4icr1F6kojPL5G7Is00TMaww",
  authDomain: "moemen-s-computer.firebaseapp.com",
  projectId: "moemen-s-computer",
  storageBucket: "moemen-s-computer.firebasestorage.app",
  messagingSenderId: "975931747441",
  appId: "1:975931747441:web:95b1ad7e044b82c47f3fd0",
  measurementId: "G-E6Q3GY7G0S"
};

// Initialize Firebase with error handling
window.db = null;
window.storage = null;
window.auth = null;
window.productsRef = null;

try {
  // Initialize Firebase
  firebase.initializeApp(window.firebaseConfig);
  
  // Initialize Firestore
  window.db = firebase.firestore();
  

  
  // Initialize Auth
  window.auth = firebase.auth();
  
  // Reference to products collection (only if db is initialized)
  if (window.db) {
    window.productsRef = window.db.collection('products');
  }
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  console.log('Using localStorage fallback mode');
}
