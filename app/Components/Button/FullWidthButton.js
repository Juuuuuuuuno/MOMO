// app/Components/Button/FullWidthButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function FullWidthButton({ label, onPress, disabled }) {
    return (
    <TouchableOpacity
        style={[styles.button, disabled && styles.disabled]}
        onPress={onPress}
        disabled={disabled}
    >
        <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#FF8A8A',
    alignItems: 'center',
    },
    text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    },
    disabled: {
    backgroundColor: '#ccc',
    },
});
