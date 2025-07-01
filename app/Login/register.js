// app/Login/register.js
import React, { useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router'; // ✅ router 추가
import BackButton from '../Components/Button/BackButton';
import InputField from '../Components/InputField/InputField';
import FullWidthButton from '../Components/Button/FullWidthButton';
import styles from '../Styles/RegisterStyle';

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
                    onPress={() => router.push('/Login/registerauth')} // ✅ 페이지 이동
                />
            </View>
        </SafeAreaView>
    );
}
