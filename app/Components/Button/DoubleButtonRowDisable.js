// Components/Button/DoubleButtonRowDisable.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function DoubleButtonRow({
    leftLabel,
    rightLabel,
    onLeftPress,
    onRightPress,
    disabled = false // ✅ 기본값 false
}) {
    return (
        <View style={styles.row}>
            {/* 왼쪽 버튼 */}
            <TouchableOpacity
                style={[
                    styles.button,
                    styles.outlined,
                    disabled && styles.disabledOutlined
                ]}
                onPress={onLeftPress}
                disabled={disabled}
            >
                <Text style={[styles.outlinedText, disabled && styles.disabledText]}>
                    {leftLabel}
                </Text>
            </TouchableOpacity>

            {/* 오른쪽 버튼 */}
            <TouchableOpacity
                style={[
                    styles.button,
                    styles.filled,
                    disabled && styles.disabledFilled
                ]}
                onPress={onRightPress}
                disabled={disabled}
            >
                <Text style={[styles.filledText, disabled && styles.disabledText]}>
                    {rightLabel}
                </Text>
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
    filled: {
        backgroundColor: '#FF8A8A',
    },
    outlinedText: {
        color: '#FF8A8A',
        fontSize: 16,
        fontWeight: 'bold',
    },
    filledText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledOutlined: {
        backgroundColor: '#F0F0F0',
        borderColor: '#CCC',
    },
    disabledFilled: {
        backgroundColor: '#CCC',
    },
    disabledText: {
        color: '#999',
    },
});
