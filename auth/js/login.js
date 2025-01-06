import { auth } from './firebase.js';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';

// Initialize providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const togglePassword = document.getElementById('togglePassword');
const loginButton = document.getElementById('loginButton');
const googleLogin = document.getElementById('googleLogin');
const facebookLogin = document.getElementById('facebookLogin');
const rememberMe = document.getElementById('rememberMe');
const toast = document.getElementById('toast');

// Show toast message
function showToast(message, type = 'error') {
  const toastMessage = toast.querySelector('.toast-message');
  const toastIcon = toast.querySelector('.toast-icon');

  toastMessage.textContent = message;
  toastIcon.className = `toast-icon fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Toggle password visibility
togglePassword.addEventListener('click', () => {
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
  togglePassword.querySelector('i').className = `fas fa-${type === 'password' ? 'eye' : 'eye-slash'}`;
});

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Show loading state
  loginButton.disabled = true;
  loginButton.querySelector('.button-text').style.opacity = '0';
  loginButton.querySelector('.button-loader').style.display = 'block';

  try {
    // Set persistence based on remember me checkbox
    await setPersistence(auth, rememberMe.checked ? browserLocalPersistence : browserSessionPersistence);

    // Sign in user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    showToast('Login successful!', 'success');

    // Redirect to home page
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1000);

  } catch (error) {
    let errorMessage = 'An error occurred during login';

    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
    }

    showToast(errorMessage);
  } finally {
    // Reset loading state
    loginButton.disabled = false;
    loginButton.querySelector('.button-text').style.opacity = '1';
    loginButton.querySelector('.button-loader').style.display = 'none';
  }
});

// Social login handlers
async function handleSocialLogin(provider, providerName) {
  try {
    const result = await signInWithPopup(auth, provider);
    showToast('Login successful!', 'success');

    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1000);
  } catch (error) {
    console.error(`${providerName} login error:`, error);
    showToast(`${providerName} login failed`);
  }
}

googleLogin.addEventListener('click', () => handleSocialLogin(googleProvider, 'Google'));
facebookLogin.addEventListener('click', () => handleSocialLogin(facebookProvider, 'Facebook'));

// Check if user is already logged in
auth.onAuthStateChanged((user) => {
  if (user) {
    window.location.href = '../index.html';
  }
});