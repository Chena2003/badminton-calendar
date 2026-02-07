importScripts(
  'https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js',
);

// https://stackoverflow.com/questions/37482366/is-it-safe-to-expose-firebase-apikey-to-the-public/37484053#37484053
firebase.initializeApp({
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.firebasestorage.app',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging.isSupported()
  ? firebase.messaging()
  : Promise.reject();
