// app/Login/register.js
import React, { useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router'; // ✅ router 추가
import BackButton from '../Components/Button/BackButton';
import InputField from '../Components/InputField/InputField';
import FullWidthButton from '../Components/Button/FullWidthButton';
import styles from '../Styles/RegisterStyle';
import axios from 'axios';
import { SERVER_DOMAIN } from '@env';

export default function Register() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const router = useRouter(); // ✅ useRouter 사용

    const isValid = name.trim() !== '' && /^\d{10,11}$/.test(phone);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.container}>
                <BackButton />
                <Text style={styles.title}>실명과 휴대전화번호를{"\n"}입력해 주세요</Text>
                <InputField
                    placeholder="예시) 홍길동"
                    value={name}
                    onChangeText={setName}
                />
                <InputField
                    placeholder="-없이 숫자로만 입력"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="numeric"
                />

                <FullWidthButton
                    label="다음"
                    disabled={!isValid}
                    onPress={async () => {
                        try {
                        await axios.post(`${SERVER_DOMAIN}/api/send-auth-code`, {
                            phone: phone.replace(/-/g, '') // 하이픈 제거
                        });

                        // 성공 시 다음 페이지로 이동
                        router.push({
                            pathname: '/Login/registerauth',
                            params: { name, phone }
                        });
                        } catch (error) {
                        console.error('❌ 인증번호 요청 실패:', error.response?.data || error.message);
                        Alert.alert('오류', '인증번호 요청 실패');
                        }
                    }}
                />
            </View>
        </SafeAreaView>
    );
}
