import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: 'AIzaSyCg8k73ur8zsih0dNyBJjPNOsSc3uYKm28',
    authDomain: 'atpenn-4fc94.firebaseapp.com',
    projectId: 'atpenn-4fc94',
    storageBucket: 'atpenn-4fc94.appspot.com',
    messagingSenderId: '851879336191',
    appId: '1:851879336191:web:0a61867a3ab3ffc02554ca',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
