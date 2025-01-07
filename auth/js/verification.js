import { auth } from './firebase.js';
import { sendEmailVerification } from 'firebase/auth';

// DOM Elements
const resendButton = document.getElementById('resendButton');
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

// Handle resend verification email
let lastResendTime = 0;
const RESEND_COOLDOWN = 60000; // 1 minute cooldown

resendButton.addEventListener('click', async () => {
  const currentTime = Date.now();
  if (currentTime - lastResendTime < RESEND_COOLDOWN) {
    const remainingTime = Math.ceil((RESEND_COOLDOWN - (currentTime - lastResendTime)) / 1000);
    showToast(`Please wait ${remainingTime} seconds before requesting another email`, 'error');
    return;
  }

  try {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      // Show loading state
      resendButton.disabled = true;
      resendButton.querySelector('.button-text').style.opacity = '0';
      resendButton.querySelector('.button-loader').style.display = 'block';

      await sendEmailVerification(user, {
        url: window.location.origin + '/auth/login.html',
        handleCodeInApp: true
      });

      lastResendTime = Date.now();
      showToast('Verification email sent successfully!', 'success');
    } else {
      showToast('No unverified user found', 'error');
    }
  } catch (error) {
    console.error('Error sending verification email:', error);
    showToast('Failed to send verification email. Please try again later.');
  } finally {
    // Reset loading state
    resendButton.disabled = false;
    resendButton.querySelector('.button-text').style.opacity = '1';
    resendButton.querySelector('.button-loader').style.display = 'none';
  }
});

// Check verification status periodically
let checkInterval;

function startVerificationCheck() {
  checkInterval = setInterval(async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(checkInterval);
          showToast('Email verified successfully!', 'success');
          setTimeout(() => {
            window.location.href = '../index.html';
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  }, 5000); // Check every 5 seconds
}

// Start checking when page loads
auth.onAuthStateChanged((user) => {
  if (user) {
    if (user.emailVerified) {
      window.location.href = '../index.html';
    } else {
      startVerificationCheck();
    }
  }
});

// Clean up interval when page is closed
window.addEventListener('unload', () => {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
});