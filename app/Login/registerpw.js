// app/Login/registerpw.js
import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import BackButton from '../Components/Button/BackButton';
import InputField from '../Components/InputField/InputFieldpw'; // ✅ InputField 추가
import FullWidthButton from '../Components/Button/FullWidthButton';
import styles from '../Styles/RegisterStyle';

export default function RegisterPw() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

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
            onPress={ () => {
                console.log('회원가입 완료')
                router.push('/Login/login')
            }}
        />
        </View>
    </SafeAreaView>
    );
}
