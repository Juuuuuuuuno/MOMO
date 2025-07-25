// app/Components/Button/ColoredFullWidthButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ColoredFullWidthButton = ({ label, onPress, disabled, backgroundColor }) => {
    return (
        <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[
            styles.button,
            { backgroundColor: backgroundColor || '#FF8A8A' },
            disabled && styles.disabled,
        ]}
        >
        <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
    };

    const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    disabled: {
        opacity: 0.6,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ColoredFullWidthButton;
