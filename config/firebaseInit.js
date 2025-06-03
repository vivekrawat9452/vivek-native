// Polyfill for setImmediate
if (typeof setImmediate === 'undefined') {
  global.setImmediate = (callback) => setTimeout(callback, 0);
}

import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/database';
import '@react-native-firebase/firestore';
import '@react-native-firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const androidConfig = {
  apiKey: "AIzaSyDWY141AKrEmHH1ulsa9gSKZwjzfsFvgHk",
  authDomain: "vivek-7ce08.firebaseapp.com",
  databaseURL: "https://vivek-7ce08-default-rtdb.firebaseio.com",
  projectId: "vivek-7ce08",
  storageBucket: "vivek-7ce08.firebasestorage.app",
  messagingSenderId: "17742810420",
  appId: "1:17742810420:web:8ca6ed5a35a46858a4e961",
  measurementId: "G-0T98N7TJR1"
};

// Initialize Firebase if it hasn't been initialized yet
if (!firebase.apps.length) {
  firebase.initializeApp(androidConfig);
}

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '344300978238-an1us955nt1m7ms362mkrr3jc48l9sn1.apps.googleusercontent.com',
});

export default firebase; 