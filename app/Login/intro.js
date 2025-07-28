// app/Login/login.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // 화면 이동을 위해 추가
import styles from '../Styles/IntroStyle';
import MainButton from '../Components/Button/MainButton';

const Intro = () => {
  const router = useRouter(); // 라우터 인스턴스

    const handleStart = () => {
    //router.push('/Login/login')
    router.push('admin/main')
    };

    const handleSignup = () => {
    router.push('/Login/register'); // 회원가입 화면으로 이동
    };

    return (
    <View style={styles.container}>
        <Text style={[styles.emoji, {marginTop : 3 }]}>🍑</Text>

        <Text style={styles.title}>MOMO</Text>
        <Text style={styles.subtitle}>농부의 손에서 당신의 집까지, 모모</Text>

        <MainButton title="시작하기" onPress={handleStart} />

        <TouchableOpacity onPress={handleSignup}>
          <Text style={styles.signupText}>회원가입</Text>
        </TouchableOpacity>
    </View>
    );
};

export default Intro;
