// Components/Button/DoubleButtonRowIndividualDisable.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function DoubleButtonRowIndividualDisable({
    leftLabel,
    rightLabel,
    onLeftPress,
    onRightPress,
    leftDisabled = false,
    rightDisabled = false,
    }) {
    return (
        <View style={styles.row}>
        {/* 왼쪽 버튼 */}
        <TouchableOpacity
            style={[
            styles.button,
            styles.outlined,
            leftDisabled && styles.disabledOutlined,
            ]}
            onPress={onLeftPress}
            disabled={leftDisabled}
        >
            <Text
            style={[
                styles.outlinedText,
                leftDisabled && styles.disabledText,
            ]}
            >
            {leftLabel}
            </Text>
        </TouchableOpacity>

        {/* 오른쪽 버튼 */}
        <TouchableOpacity
            style={[
            styles.button,
            styles.filled,
            rightDisabled && styles.disabledFilled,
            ]}
            onPress={onRightPress}
            disabled={rightDisabled}
        >
            <Text
            style={[
                styles.filledText,
                rightDisabled && styles.disabledText,
            ]}
            >
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
