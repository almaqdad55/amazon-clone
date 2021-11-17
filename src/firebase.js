import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByQOb-zKtG-d_vasZkz17dUmDjRE22_fw",
  authDomain: "clone-d29c0.firebaseapp.com",
  projectId: "clone-d29c0",
  storageBucket: "clone-d29c0.appspot.com",
  messagingSenderId: "990669129058",
  appId: "1:990669129058:web:730a5a3ae724fd871e983b",
  measurementId: "G-633MKTGQTN",
};

const firebaseApp = initializeApp(firebaseConfig);

// const db = firebaseApp.firestore();
// const db = firebase.database();
const auth = getAuth();

// const app = initializeApp(firebaseConfig);
// const auth = getAuth();
const db = getFirestore();

export { db, auth };
