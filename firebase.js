// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyAKkVwRh9Fd32uE8U0mf90sRxm5QRiNkEY",
//     authDomain: "chatapp-6d61b.firebaseapp.com",
//     projectId: "chatapp-6d61b",
//     storageBucket: "chatapp-6d61b.firebasestorage.app",
//     messagingSenderId: "1025209835489",
//     appId: "1:1025209835489:web:6c640e0c6505053b07fca0",
//     measurementId: "G-WRJE3GNB5V"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// // ---
// // firebase.js
// const admin = require('firebase-admin');

const admin = require('firebase-admin');
const serviceAccount = require('./chatapp-6d61b-firebase-adminsdk-n7o6w-297efca737.json');
 
// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),  // Use the cert() method for custom credentials

});
module.exports = admin;  // Export the Firebase admin instance for use in other parts of the app
