// Template for src/environments/environment.ts and environment.prod.ts.
// Copy this file to environment.ts / environment.prod.ts and fill in real values.
// Never commit real credentials — rotate any key that has been committed previously.

const razorPayKey = 'YOUR_RAZORPAY_KEY_HERE';

export const environment = {
  production: false,

  firebase: {
    vapid: 'YOUR_FIREBASE_VAPID_KEY_HERE',
    apiKey: 'YOUR_FIREBASE_API_KEY_HERE',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.firebasestorage.app',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
    measurementId: 'YOUR_MEASUREMENT_ID',
  },
  firebaseUrl: 'https://YOUR_PROJECT-default-rtdb.firebaseio.com/Jobs',
  razorPayKey: razorPayKey,
};
