import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import {
  getFirestore,
  doc,
  setDoc
} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
import firebaseConfig from './config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// DOM Elements
const signupForm = document.getElementById('signupForm');
const usernameInput = document.getElementById('usernameInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const confirmPasswordInput = document.getElementById('confirmPasswordInput');
const termsCheckbox = document.getElementById('termsCheckbox');
const signupButton = document.getElementById('signupButton');
const googleSignup = document.getElementById('googleSignup');
const facebookSignup = document.getElementById('facebookSignup');
const togglePassword = document.getElementById('togglePassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

// Toast Elements
const toast = document.getElementById('toast');
const toastMessage = toast.querySelector('.toast-message');
const toastIcon = toast.querySelector('.toast-icon');

// Show toast message
function showToast(message, type = 'error') {
  toastMessage.textContent = message;
  toastIcon.className = `toast-icon fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Validate password strength
function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return 'Password must be at least 8 characters long';
  }
  if (!hasUpperCase || !hasLowerCase) {
    return 'Password must contain both uppercase and lowercase letters';
  }
  if (!hasNumbers) {
    return 'Password must contain at least one number';
  }
  if (!hasSpecialChar) {
    return 'Password must contain at least one special character';
  }
  return '';
}

// Create user profile in Firestore
async function createUserProfile(userId, userData) {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

// Toggle password visibility
[togglePassword, toggleConfirmPassword].forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    const input = e.currentTarget.parentElement.querySelector('input');
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    e.currentTarget.querySelector('i').className = `fas fa-${type === 'password' ? 'eye' : 'eye-slash'}`;
  });
});

// Handle form submission
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form values
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Reset error messages
  document.querySelectorAll('.error-message').forEach(error => error.style.display = 'none');

  // Validate form
  if (!username || !email || !password || !confirmPassword) {
    showToast('Please fill in all fields');
    return;
  }

  if (username.length < 3) {
    document.getElementById('usernameError').textContent = 'Username must be at least 3 characters long';
    document.getElementById('usernameError').style.display = 'block';
    return;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    document.getElementById('passwordError').textContent = passwordError;
    document.getElementById('passwordError').style.display = 'block';
    return;
  }

  if (password !== confirmPassword) {
    document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
    document.getElementById('confirmPasswordError').style.display = 'block';
    return;
  }

  if (!termsCheckbox.checked) {
    document.getElementById('termsError').textContent = 'You must agree to the Terms of Service';
    document.getElementById('termsError').style.display = 'block';
    return;
  }

  // Show loading state
  signupButton.disabled = true;
  signupButton.querySelector('.button-text').style.opacity = '0';
  signupButton.querySelector('.button-loader').style.display = 'block';

  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update profile with username
    await updateProfile(userCredential.user, {
      displayName: username
    });

    // Create user profile in Firestore
    await createUserProfile(userCredential.user.uid, {
      username,
      email,
      photoURL: null,
      bio: '',
      followers: [],
      following: []
    });

    showToast('Account created successfully!', 'success');

    // Redirect to home page
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1500);

  } catch (error) {
    let errorMessage = 'An error occurred during signup';

    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak';
        break;
      default:
        console.error('Signup error:', error);
    }

    showToast(errorMessage);
  } finally {
    // Reset loading state
    signupButton.disabled = false;
    signupButton.querySelector('.button-text').style.opacity = '1';
    signupButton.querySelector('.button-loader').style.display = 'none';
  }
});

// Social Sign Up handlers
async function handleSocialSignup(provider, providerName) {
  try {
    const result = await signInWithPopup(auth, provider);

    // Check if this is a new user
    if (result._tokenResponse?.isNewUser) {
      await createUserProfile(result.user.uid, {
        username: result.user.displayName || `user_${Math.random().toString(36).slice(2, 8)}`,
        email: result.user.email,
        photoURL: result.user.photoURL,
        bio: '',
        followers: [],
        following: []
      });
    }

    showToast('Account created successfully!', 'success');

    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1500);
  } catch (error) {
    console.error(`${providerName} signup error:`, error);
    showToast(`${providerName} signup failed`);
  }
}

googleSignup.addEventListener('click', () => handleSocialSignup(googleProvider, 'Google'));
facebookSignup.addEventListener('click', () => handleSocialSignup(facebookProvider, 'Facebook'));

// Check if user is already logged in
auth.onAuthStateChanged((user) => {
  if (user && !user.isAnonymous) {
    window.location.href = '../index.html';
  }
});