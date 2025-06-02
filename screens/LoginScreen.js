import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Platform
} from "react-native";
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../globals/styles';
import firebaseConfig from '../config/firebase';

// Polyfill for setImmediate for web compatibility
if (typeof setImmediate === 'undefined') {
  global.setImmediate = (callback) => setTimeout(callback, 0);
}

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    initializeFirebase();
    configureGoogleSignIn();
  }, []);

  const initializeFirebase = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  };

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: '17742810420-eef4umpmmv3nkc508du4d983kik96mbc.apps.googleusercontent.com',
    });
  };

  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
  };

  const handleSendCode = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Notice', 'Phone authentication is not fully supported on web. Please use Google Sign-In.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(`+91${phoneNumber}`);
      setVerificationId(confirmation.verificationId);
      setShowPhone(false);
      setShowOTP(true);
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error(error);
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Notice', 'Phone authentication is not fully supported on web. Please use Google Sign-In.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await auth().signInWithCredential(credential);
      await AsyncStorage.setItem('isLoggedin', '1');
      navigation.navigate('UserProfile');
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error(error);
    }
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      if (Platform.OS === 'web') {
        // For web, we'll need to handle Google Sign-In differently
        Alert.alert('Notice', 'Google Sign-In will be implemented for web soon. Currently, full authentication is supported on mobile.');
        setLoading(false);
        return;
      }
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      await AsyncStorage.setItem('isLoggedin', '1');
      navigation.navigate('UserProfile');
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <ActivityIndicator size="large" color={colors.primary} />}
      {showPhone && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter your phone number:</Text>
          <View style={styles.phoneInputContainer}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              placeholder="Phone Number"
              onChangeText={handlePhoneNumberChange}
              value={phoneNumber}
              maxLength={10}
            />
          </View>
          <TouchableOpacity 
            style={[styles.button, !phoneNumber && styles.buttonDisabled]} 
            onPress={handleSendCode}
            disabled={!phoneNumber}
          >
            <Text style={styles.buttonText}>Send Code</Text>
          </TouchableOpacity>
        </View>
      )}
      {showOTP && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter OTP:</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="Enter 6-digit OTP"
            onChangeText={setVerificationCode}
            value={verificationCode}
            maxLength={6}
          />
          <TouchableOpacity 
            style={[styles.button, !verificationCode && styles.buttonDisabled]}
            onPress={handleVerifyCode}
            disabled={!verificationCode}
          >
            <Text style={styles.buttonText}>Verify Code</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>
      <TouchableOpacity style={styles.googleButton} onPress={signInWithGoogle}>
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: colors.textcolor,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  countryCode: {
    fontSize: 16,
    marginRight: 10,
    color: colors.textcolor,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.textcolor,
    opacity: 0.3,
  },
  orText: {
    marginHorizontal: 10,
    color: colors.textcolor,
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  googleButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen; 