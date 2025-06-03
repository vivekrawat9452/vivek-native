import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const otpInputs = useRef([]);

  const handleSendCode = async () => {
    try {
      setLoading(true);
      const confirmation = await auth().signInWithPhoneNumber('+91' + phoneNumber);
      setConfirm(confirmation);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      const credential = await confirm.confirm(otp.join(''));
      setUser(credential.user);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      setUser(null);
      setConfirm(null);
      setOtp(['', '', '', '', '', '']);
      setPhoneNumber('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  if (user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome!</Text>
          <View style={styles.userDetails}>
            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.value}>{user.phoneNumber}</Text>
            <Text style={styles.label}>UID:</Text>
            <Text style={styles.value}>{user.uid}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.card}>
            <Text style={styles.title}>Login</Text>
            {!confirm ? (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone Number</Text>
                  <View style={styles.phoneInputContainer}>
                    <Text style={styles.countryCode}>+91</Text>
                    <TextInput
                      style={styles.phoneInput}
                      placeholder="Enter phone number"
                      keyboardType="phone-pad"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      maxLength={10}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleSendCode}
                  disabled={loading || phoneNumber.length !== 10}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Send Code</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.otpMessage}>
                  Enter the code sent to +91 {phoneNumber}
                </Text>
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(input) => (otpInputs.current[index] = input)}
                      style={styles.otpInput}
                      maxLength={1}
                      keyboardType="number-pad"
                      value={digit}
                      onChangeText={(value) => handleOtpChange(value, index)}
                      onKeyPress={(e) => handleOtpKeyPress(e, index)}
                    />
                  ))}
                </View>
                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleVerifyCode}
                  disabled={loading || otp.join('').length !== 6}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Verify Code</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  countryCode: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    padding: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  otpMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 4,
  },
  userDetails: {
    marginBottom: 20,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
});

export default LoginScreen; 