// app/Login/registerpw.js
import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import BackButton from '../Components/Button/BackButton';
import InputField from '../Components/InputField/InputFieldpw'; // ✅ InputField 추가
import FullWidthButton from '../Components/Button/FullWidthButton';
import styles from '../Styles/RegisterStyle';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { EXPO_PUBLIC_SERVER_DOMAIN } from '@env';

export default function RegisterPw() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    //전달 받은 이름/전화번호
    const { name, phone } = useLocalSearchParams();

    const isValid = password.length >= 8;

    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
        <BackButton />
        <Text style={styles.title}>비밀번호를{"\n"}입력해 주세요</Text>

        <InputField
            placeholder="8자 이상 입력"
            value={password}
            onChangeText={setPassword}
          secureTextEntry={!showPassword} // ✅ 보이기/숨기기 상태 적용
        />

        <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}
            onPress={() => setShowPassword(!showPassword)}
        >
            <View style={{
            width: 18,
            height: 18,
            marginRight: 8,
            borderWidth: 1,
            borderColor: '#888',
            backgroundColor: showPassword ? '#888' : '#fff'
            }} />
            <Text>비밀번호 표시</Text>
        </TouchableOpacity>

<FullWidthButton
    label="시작하기"
    disabled={!isValid}
    onPress={async () => {
        try {
        const response = await axios.post(`${EXPO_PUBLIC_SERVER_DOMAIN}/api/register`, {
            name,
            phone,
            pw: password
        });

        if (response.data.success) {
            router.push('/Login/login'); // 회원가입 후 로그인 화면으로 이동
        } else {
            Alert.alert('회원가입 실패', '서버 오류');
        }
        } catch (error) {
        console.error('회원가입 오류:', error.response?.data || error.message);
        Alert.alert('회원가입 실패', error.response?.data?.message || '서버 오류');
        }
    }}
/>

        </View>
    </SafeAreaView>
    );
}
