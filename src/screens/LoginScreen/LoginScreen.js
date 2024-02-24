import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

export default function LoginScreen({ navigation, setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onFooterLinkPress = () => {
        navigation.navigate('Registration');
    };

    const onLoginPress = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((response) => {
                const uid = response.user.uid;
                navigation.navigate('Home', { user: { id: uid, email: email } });
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    const onForgotPasswordPress = () => {
        if (email.trim() === '') {
          alert('Please enter your email address to reset your password.');
          return;
        }
        
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
          .then(() => {
            alert('Password reset email sent! Check your inbox.');
          })
          .catch((error) => {
            alert(error.message); 
          });
      };
      

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../../assets/icon.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
            
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                    <TouchableOpacity
                    onPress={onForgotPasswordPress}
                    style={styles.forgotPassword}
                    >
                    <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>

                </View>
                
            </KeyboardAwareScrollView>
        </View>
    )
}