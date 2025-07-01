// app/Login/registerauth.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // ✅ 추가
import BackButton from '../Components/Button/BackButton';
import FullWidthButton from '../Components/Button/FullWidthButton';
import styles from '../Styles/RegisterStyle'; // 기존 registerStyle 재사용

export default function RegisterAuth() {
    const [code, setCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(180); // 3분 (180초)
    const router = useRouter(); // ✅ 추가

    const isValid = /^\d{6}$/.test(code);

  // 타이머 감소 로직
    useEffect(() => {
    if (timeLeft <= 0) {
        Alert.alert('알림', '인증 시간이 만료되었습니다');
        return;
    }
    const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
    }, [timeLeft]);

  // mm:ss 포맷으로 변환
    const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
    };

    return (
    <View style={styles.container}>
        <BackButton />
        <Text style={styles.title}>지금 문자로 발송된{"\n"}인증번호를 입력해 주세요</Text>

        <View style={styles.inputRow}>
        <TextInput
            style={styles.input}
            placeholder="6자리 숫자 입력"
            keyboardType="numeric"
            maxLength={6}
            value={code}
            onChangeText={setCode}
        />
        <Text
            style={[styles.timer, { color: timeLeft <= 30 ? '#FF0000' : '#666' }]}
        >
            {formatTime(timeLeft)}
        </Text>
        </View>

        <FullWidthButton
        label="다음"
        disabled={!isValid}
        onPress={() => router.push('/Login/registerpw')} // ✅ 비밀번호 입력 화면으로 이동
        />

        <TouchableOpacity>
        <Text style={styles.footerText}>인증번호가 오지 않나요?</Text>
        </TouchableOpacity>
    </View>
    );
}
