import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAaJejk61fih3O99DKKb2XlSyFVf1k-mTA",
    authDomain: "zema-hukuk.firebaseapp.com",
    projectId: "zema-hukuk",
    storageBucket: "zema-hukuk.firebasestorage.app",
    messagingSenderId: "666069200863",
    appId: "1:666069200863:web:2b147d13092a7f93589e6a",
    measurementId: "G-QLTVSG3N79"
};

export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);
