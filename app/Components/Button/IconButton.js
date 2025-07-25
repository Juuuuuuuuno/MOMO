// app/Components/Button/IconButton.js
import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function IconButton({ iconSource, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Image source={iconSource} style={styles.icon} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 4,
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
});
