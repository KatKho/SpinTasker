import React from 'react';
import { Text, View, Button } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';

export default function HomeScreen({ navigation }) {
    const auth = getAuth();

    const handleSignOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            // You can navigate to the login screen or do nothing to go back to the login screen automatically if your auth state changes are properly set up
        }).catch((error) => {
            // An error happened.
            console.error('Sign out error', error);
        });
    };

    return (
        <View>
            <Text>Home Screen</Text>
            <Button title="Sign Out" onPress={handleSignOut} />
        </View>
    );
}
