import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const androidConfig = {
  apiKey: "AIzaSyC2lG3c89HwZs_0jpjx0F2b1MffY_olxpw",
  authDomain: "tradingclash-a6d81.firebaseapp.com",
  databaseURL: "https://tradingclash-a6d81-default-rtdb.firebaseio.com",
  projectId: "tradingclash-a6d81",
  storageBucket: "tradingclash-a6d81.appspot.com",
  messagingSenderId: "574096806453",
  appId: "1:574096806453:web:7e9b9795c92d433da3d77c",
  measurementId: "G-P19NQYMP9Z"
};

// Initialize Firebase if it hasn't been initialized yet
if (!firebase.apps.length) {
  firebase.initializeApp(androidConfig);
}

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '574096806453-ka4q1aafgsa6une8g3im5u09kj5s6cmc.apps.googleusercontent.com',
});

export default firebase; 