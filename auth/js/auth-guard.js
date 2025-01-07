import { auth } from './firebase.js';

export function requireAuth(redirectUrl = '/auth/login.html') {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        if (!user.emailVerified) {
          window.location.href = '/auth/verification-pending.html';
          reject(new Error('Email not verified'));
        } else {
          resolve(user);
        }
      } else {
        window.location.href = redirectUrl;
        reject(new Error('Not authenticated'));
      }
    });
  });
}

export function redirectIfAuthenticated(redirectUrl = '/index.html') {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user && user.emailVerified) {
        window.location.href = redirectUrl;
        reject(new Error('Already authenticated'));
      } else {
        resolve(null);
      }
    });
  });
}