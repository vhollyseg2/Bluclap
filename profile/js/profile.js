import { auth, db, storage } from '../js/firebase.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { requireAuth } from '../auth/js/auth-guard.js';

// DOM Elements
const profileImage = document.getElementById('profileImage');
const changePhotoButton = document.getElementById('changePhotoButton');
const usernameDisplay = document.getElementById('usernameDisplay');
const emailDisplay = document.getElementById('emailDisplay');
const bioDisplay = document.getElementById('bioDisplay');
const postsCount = document.getElementById('postsCount');
const followersCount = document.getElementById('followersCount');
const followingCount = document.getElementById('followingCount');
const editProfileButton = document.getElementById('editProfileButton');
const editProfileModal = document.getElementById('editProfileModal');
const editProfileForm = document.getElementById('editProfileForm');
const usernameInput = document.getElementById('usernameInput');
const bioInput = document.getElementById('bioInput');
const postsGrid = document.getElementById('postsGrid');
const toast = document.getElementById('toast');

let currentUser = null;
let userProfile = null;

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

// Load user profile data
async function loadUserProfile() {
  try {
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (userDoc.exists()) {
      userProfile = userDoc.data();

      // Update UI with user data
      usernameDisplay.textContent = userProfile.username;
      emailDisplay.textContent = userProfile.email;
      bioDisplay.textContent = userProfile.bio || 'No bio yet';
      followersCount.textContent = userProfile.followers;
      followingCount.textContent = userProfile.following;

      if (userProfile.photoURL) {
        profileImage.src = userProfile.photoURL;
      }

      // Pre-fill edit form
      usernameInput.value = userProfile.username;
      bioInput.value = userProfile.bio || '';
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    showToast('Failed to load profile data');
  }
}

// Handle profile image upload
async function handleImageUpload(file) {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select an image file');
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('Image size should be less than 5MB');
    }

    // Create storage reference
    const storageRef = ref(storage, `profile-images/${currentUser.uid}`);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    // Update profile image
    await updateDoc(doc(db, 'users', currentUser.uid), {
      photoURL: downloadURL
    });

    // Update UI
    profileImage.src = downloadURL;
    showToast('Profile picture updated successfully', 'success');

  } catch (error) {
    console.error('Error uploading image:', error);
    showToast(error.message);
  }
}

// Set up image upload
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    handleImageUpload(file);
  }
});

changePhotoButton.addEventListener('click', () => {
  fileInput.click();
});

// Modal handlers
editProfileButton.addEventListener('click', () => {
  editProfileModal.style.display = 'block';
});

document.querySelector('.close-button').addEventListener('click', () => {
  editProfileModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === editProfileModal) {
    editProfileModal.style.display = 'none';
  }
});

// Handle profile updates
editProfileForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newUsername = usernameInput.value.trim();
  const newBio = bioInput.value.trim();

  try {
    // Validate username
    if (newUsername.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    // Update profile
    await updateDoc(doc(db, 'users', currentUser.uid), {
      username: newUsername,
      bio: newBio
    });

    // Update UI
    usernameDisplay.textContent = newUsername;
    bioDisplay.textContent = newBio || 'No bio yet';

    // Close modal
    editProfileModal.style.display = 'none';
    showToast('Profile updated successfully', 'success');

  } catch (error) {
    console.error('Error updating profile:', error);
    showToast(error.message);
  }
});

// Load posts
async function loadUserPosts() {
  try {
    // Implementation for loading user posts will go here
    // This will be implemented when we add post functionality
  } catch (error) {
    console.error('Error loading posts:', error);
    showToast('Failed to load posts');
  }
}

// Initialize profile page
async function initializeProfile() {
  try {
    // Check authentication
    currentUser = await requireAuth();

    // Load profile data
    await loadUserProfile();

    // Load posts
    await loadUserPosts();

  } catch (error) {
    console.error('Error initializing profile:', error);
    showToast('Failed to initialize profile');
  }
}

// Start initialization
initializeProfile();

// Add logout functionality
const logoutButton = document.createElement('button');
logoutButton.className = 'logout-button';
logoutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
document.querySelector('.nav-right').appendChild(logoutButton);

logoutButton.addEventListener('click', async () => {
  try {
    await auth.signOut();
    window.location.href = '/auth/login.html';
  } catch (error) {
    console.error('Error signing out:', error);
    showToast('Failed to sign out');
  }
});

// Handle profile navigation
function handleProfileNavigation() {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('uid');

  if (userId && userId !== currentUser.uid) {
    // Load other user's profile
    loadOtherUserProfile(userId);
  }
}

async function loadOtherUserProfile(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const otherUserProfile = userDoc.data();

      // Update UI for other user's profile
      usernameDisplay.textContent = otherUserProfile.username;
      bioDisplay.textContent = otherUserProfile.bio || 'No bio yet';
      followersCount.textContent = otherUserProfile.followers;
      followingCount.textContent = otherUserProfile.following;

      if (otherUserProfile.photoURL) {
        profileImage.src = otherUserProfile.photoURL;
      }

      // Hide edit functionality for other users' profiles
      editProfileButton.style.display = 'none';
      changePhotoButton.style.display = 'none';

      // Show follow button instead
      const followButton = document.createElement('button');
      followButton.className = 'follow-button';
      followButton.textContent = 'Follow';
      document.querySelector('.nav-right').insertBefore(followButton, logoutButton);
    }
  } catch (error) {
    console.error('Error loading other user profile:', error);
    showToast('Failed to load user profile');
  }
}

// Check for profile navigation when page loads
handleProfileNavigation();