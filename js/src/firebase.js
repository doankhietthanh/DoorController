import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcMjrq20foUj3sjcjpc5KKdhshHkIvKLA",
  authDomain: "finger-1ffdd.firebaseapp.com",
  databaseURL: "https://finger-1ffdd-default-rtdb.firebaseio.com",
  projectId: "finger-1ffdd",
  storageBucket: "finger-1ffdd.appspot.com",
  messagingSenderId: "777871565979",
  appId: "1:777871565979:web:57db70ab6042d5f632523e",
  measurementId: "G-2GH632N43N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

export { app, auth, database };
