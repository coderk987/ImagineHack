const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyC7tXAwXp27a5YPgomm4ZO5WOBWTb5lS0I",
  authDomain: "meduveda-c45c9.firebaseapp.com",
  projectId: "meduveda-c45c9",
  storageBucket: "meduveda-c45c9.appspot.com",
  messagingSenderId: "20351578079",
  appId: "1:20351578079:web:45edd879fabf99b6119e6a",
};

// Initialize Firebase
const fireApp = initializeApp(firebaseConfig);
const auth = getAuth(fireApp);

module.exports = { fireApp, auth };
