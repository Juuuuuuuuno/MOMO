// app/Login/login.js
import React, { useState } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import InputField from '../Components/InputField/InputField';
import FullWidthButton from '../Components/Button/FullWidthButton';
import BackButton from '../Components/Button/BackButton';
import { useRouter } from 'expo-router';
import styles from '../Styles/IntroStyle';

export default function Login() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const isValid = /^\d{10,11}$/.test(phone) && password.length >= 8;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flex: 1, paddingHorizontal: 30 }}>

        {/* 뒤로가기 버튼 */}
        <View style={{ marginTop: 10 }}>
            <BackButton />
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* 로고 */}
            <Text style={styles.emoji}>🍑</Text>
            <Text style={styles.title}>MOMO</Text>
            <Text style={styles.subtitle2}>농부의 손에서 당신의 집까지, 모모</Text>

          {/* 전화번호 */}
        <View style ={{width:'100%'}}>
            <InputField
                placeholder="전화번호"
                value={phone}
                onChangeText={setPhone}
                keyboardType="numeric"
            />
        </View>

          {/* 비밀번호 */}
        <View style ={{width:'100%'}}>
            <InputField
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ width: '100%', marginBottom: 20 }}
            />
        </View>

          {/* 로그인 버튼 */}
            <FullWidthButton
                label="로그인"
                disabled={!isValid}
                onPress={() => console.log('로그인 시도')}
            />

          {/* 비밀번호 변경 */}
            <TouchableOpacity onPress={() => console.log('비밀번호 변경')}>
                <Text style={{ color: '#888', marginTop: 15, marginBottom: 15 }}>비밀번호 변경</Text>
            </TouchableOpacity>

          {/* 구분선 */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
            <Text style={{ marginHorizontal: 10, color: '#888' }}>또는</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
            </View>

          {/* 회원가입 */}
        <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/Login/register')}>
            <Text style={styles.signupTextStrong}>회원가입</Text>
        </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
    );
}
