import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCEXMjhaM-GpAJlaSwBE5fFXTmXr692Wvo',
  authDomain: 'call-center-8d03d.firebaseapp.com',
  projectId: 'call-center-8d03d',
  storageBucket: 'call-center-8d03d.firebasestorage.app',
  messagingSenderId: '111902847259',
  appId: '1:111902847259:web:986b7de89101970d3863be',
  measurementId: 'G-JWNW59YYB3',
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Inicializar Auth con persistencia usando AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { db, auth };
