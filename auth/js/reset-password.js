import { auth } from './firebase.js';
import { sendPasswordResetEmail } from 'firebase/auth';

// DOM Elements
const resetForm = document.getElementById('resetForm');
const emailInput = document.getElementById('emailInput');
const resetButton = document.getElementById('resetButton');
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

// Handle form submission
resetForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();

  // Reset error messages
  document.querySelectorAll('.error-message').forEach(elem => elem.style.display = 'none');

  // Show loading state
  resetButton.disabled = true;
  resetButton.querySelector('.button-text').style.opacity = '0';
  resetButton.querySelector('.button-loader').style.display = 'block';

  try {
    await sendPasswordResetEmail(auth, email, {
      url: window.location.origin + '/auth/login.html', // Redirect URL after password reset
      handleCodeInApp: true
    });

    showToast('Password reset link sent! Check your email.', 'success');

    // Clear form
    emailInput.value = '';

  } catch (error) {
    let errorMessage = 'Failed to send reset link';

    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many attempts. Please try again later';
        break;
    }

    showToast(errorMessage);
    document.getElementById('emailError').textContent = errorMessage;
    document.getElementById('emailError').style.display = 'block';
  } finally {
    // Reset loading state
    resetButton.disabled = false;
    resetButton.querySelector('.button-text').style.opacity = '1';
    resetButton.querySelector('.button-loader').style.display = 'none';
  }
});

// Redirect if already authenticated
auth.onAuthStateChanged((user) => {
  if (user && user.emailVerified) {
    window.location.href = '../index.html';
  }
});