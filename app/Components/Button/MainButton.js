// app/Components/Button/MainButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


const MainButton = ({ title, onPress }) => {
    return (
    <TouchableOpacity style={styles.mainButton} onPress={onPress}>
        <Text style={styles.mainButtonText}>{title}</Text>
    </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    mainButton: {
    backgroundColor: '#FFB6B6',
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 12,
    marginTop: 20,
    },
    mainButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    },
});

export default MainButton;
