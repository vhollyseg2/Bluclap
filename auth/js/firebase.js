// auth/js/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyC_kNrvjTBo1NRO7hc7XeXvouKMPdMJSFU",
  authDomain: "bluclap-app.firebaseapp.com",
  projectId: "bluclap-app",
  storageBucket: "bluclap-app.firebasestorage.app",
  messagingSenderId: "393382535159",
  appId: "1:393382535159:web:36555210b03c8455c3d8f2",
  measurementId: "G-VYCPME68WX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, analytics };
export default app;