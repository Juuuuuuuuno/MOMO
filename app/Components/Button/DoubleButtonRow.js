// Components/Button/DoubleButtonRow.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function DoubleButtonRow({ leftLabel, rightLabel, onLeftPress, onRightPress }) {
    return (
        <View style={styles.row}>
            {/* 왼쪽 버튼 - 상태 관리 */}
            <TouchableOpacity style={[styles.button, styles.outlined]} onPress={onLeftPress}>
                <Text style={styles.outlinedText}>{leftLabel}</Text>
            </TouchableOpacity>

            {/* 오른쪽 버튼 - 상품 추가 */}
            <TouchableOpacity style={[styles.button, styles.filled]} onPress={onRightPress}>
                <Text style={styles.filledText}>{rightLabel}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    outlined: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#FF8A8A',
    },
    outlinedText: {
        color: '#FF8A8A',
        fontSize: 16,
        fontWeight: 'bold',
    },
    filled: {
        backgroundColor: '#FF8A8A',
    },
    filledText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
