import firebase from "firebase";
// import "firebase/firestore";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA-ZuUjAfFlDVFS8qznXleivF7Snb29bD4",
  authDomain: "instagram-clone-d9c1d.firebaseapp.com",
  databaseURL: "https://instagram-clone-d9c1d-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-d9c1d",
  storageBucket: "instagram-clone-d9c1d.appspot.com",
  messagingSenderId: "339586544521",
  appId: "1:339586544521:web:f7ceff103c7439b8fee758",
  measurementId: "G-081VJ7T6FJ",
});
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
