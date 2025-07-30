// app/Login/registerauth.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // ✅ 추가
import BackButton from '../Components/Button/BackButton';
import FullWidthButton from '../Components/Button/FullWidthButton';
import styles from '../Styles/RegisterStyle'; // 기존 registerStyle 재사용
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

export default function RegisterAuth() {
    const [code, setCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(180); // 3분 (180초)
    const router = useRouter(); // ✅ 추가

    const isValid = /^\d{6}$/.test(code);

    //register.js에서 받아온 phone 값
    const { name, phone } = useLocalSearchParams();

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

        {/*다음 버튼을 눌러 문자 인증*/}
        <FullWidthButton
            label="다음"
            disabled={!isValid}
            onPress={async () => {
                try {
                const response = await axios.post('http://192.168.35.144:3001/api/verify-auth-code', {
                    phone: phone, // 등록한 전화번호 (register.js에서 넘겨받는 구조 필요함)
                    code: code,
                });

                if (response.data.success) {
                    router.push({
                        pathname: '/Login/registerpw',
                        params: { name, phone }
                    });
                } else {
                    Alert.alert('오류', '인증에 실패했습니다.');
                }
                } catch (error) {
                console.error('인증번호 검증 실패:', error.response?.data || error.message);
                Alert.alert('오류', error.response?.data?.message || '서버 오류');
                }
            }}
        />

        <TouchableOpacity
            onPress={() => {
                Alert.alert(
                '알림',
                '인증번호가 문자로 오지 않나요?\n010-3270-0115 번호가 차단되어 있다면,\n해제 후 다시 시도해주세요.',
                [
                    { text: '닫기', style: 'cancel' },
                    {
                    text: '재전송',
                    onPress: async () => {
                        try {
                        const res = await axios.post('http://192.168.35.144:3001/api/send-auth-code', {
                            phone: phone.replace(/-/g, '')
                        });
                        if (res.data.success) {
                            Alert.alert('성공', '인증번호가 재전송되었습니다.');
                            setTimeLeft(180); // 타이머 초기화
                        }
                        } catch (error) {
                        console.error('❌ 인증번호 재전송 실패:', error.response?.data || error.message);
                        Alert.alert('실패', '인증번호 전송에 실패했습니다.');
                        }
                    }
                    }
                ]
                );
            }}
            >
            <Text style={styles.footerText}>인증번호가 오지 않나요?</Text>
        </TouchableOpacity>
    </View>
    );
}
