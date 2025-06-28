import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const BackButton = () => {
    const router = useRouter();

    return (
    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.arrow}>←</Text>
    </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    backButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom:15
    },
    arrow: {
    fontSize: 30,
    color: '#000',
    },
});

export default BackButton;
