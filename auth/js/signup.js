import { auth, db } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Initialize providers
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
function setupPasswordToggle(inputId, toggleId) {
  const input = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);

  toggle.addEventListener('click', () => {
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    toggle.querySelector('i').className = `fas fa-${type === 'password' ? 'eye' : 'eye-slash'}`;
  });
}

setupPasswordToggle('passwordInput', 'togglePassword');
setupPasswordToggle('confirmPasswordInput', 'toggleConfirmPassword');

// Validate password
function validatePassword(password) {
  const minLength = 8;
  const hasNumber = /\d/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return 'Password must be at least 8 characters long';
  }
  if (!hasNumber) {
    return 'Password must contain at least one number';
  }
  if (!hasLower || !hasUpper) {
    return 'Password must contain both uppercase and lowercase letters';
  }
  if (!hasSpecial) {
    return 'Password must contain at least one special character';
  }
  return '';
}

// Create user profile in Firestore
async function createUserProfile(user, username) {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      username: username,
      email: user.email,
      createdAt: new Date().toISOString(),
      photoURL: user.photoURL || '',
      bio: '',
      followers: 0,
      following: 0
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

// Handle form submission
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Reset error messages
  document.querySelectorAll('.error-message').forEach(elem => elem.style.display = 'none');

  // Validate inputs
  if (password !== confirmPassword) {
    document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
    document.getElementById('confirmPasswordError').style.display = 'block';
    return;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    document.getElementById('passwordError').textContent = passwordError;
    document.getElementById('passwordError').style.display = 'block';
    return;
  }

  if (!termsCheckbox.checked) {
    document.getElementById('termsError').textContent = 'You must accept the terms and conditions';
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
    await createUserProfile(userCredential.user, username);

    showToast('Account created successfully!', 'success');

    // Redirect to home page
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1000);

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
    }

    showToast(errorMessage);
  } finally {
    // Reset loading state
    signupButton.disabled = false;
    signupButton.querySelector('.button-text').style.opacity = '1';
    signupButton.querySelector('.button-loader').style.display = 'none';
  }
});

// Social signup handlers
async function handleSocialSignup(provider, providerName) {
  try {
    const result = await signInWithPopup(auth, provider);

    // Create user profile if it's a new user
    if (result._tokenResponse?.isNewUser) {
      await createUserProfile(result.user, result.user.displayName || '');
    }

    showToast('Account created successfully!', 'success');

    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1000);
  } catch (error) {
    console.error(`${providerName} signup error:`, error);
    showToast(`${providerName} signup failed`);
  }
}

googleSignup.addEventListener('click', () => handleSocialSignup(googleProvider, 'Google'));
facebookSignup.addEventListener('click', () => handleSocialSignup(facebookProvider, 'Facebook'));

// Check if user is already logged in
auth.onAuthStateChanged((user) => {
  if (user) {
    window.location.href = '../index.html';
  }
});
// Add this after creating the user account in the signup form handler
// In the try block after createUserWithEmailAndPassword

// Send email verification
await userCredential.user.sendEmailVerification({
  url: window.location.origin + '/auth/login.html', // Redirect URL after verification
  handleCodeInApp: true
});

// Show success message
showToast('Account created! Please check your email to verify your account.', 'success');

// Modify the redirect to wait for verification
if (!userCredential.user.emailVerified) {
  // Sign out the user and wait for verification
  await auth.signOut();
  window.location.href = 'verification-pending.html';
} else {
  // If somehow already verified, proceed to home
  window.location.href = '../index.html';
}