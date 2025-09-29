// app/Login/intro.js
import React, { useEffect } from 'react'; // ✅ 추가 : useEffect 사용
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // 화면 이동을 위해 추가
import styles from '../Styles/IntroStyle';
import MainButton from '../Components/Button/MainButton';
import { SERVER_DOMAIN } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ 추가 : AsyncStorage 불러오기

const Intro = () => {
  const router = useRouter(); // 라우터 인스턴스
  console.log("📡 서버 도메인 : ", SERVER_DOMAIN)

  // ✅ 추가 : 자동 로그인 체크
  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await AsyncStorage.getItem('is_logged_in');
      const isAdmin = await AsyncStorage.getItem('is_admin');

      // 자동 로그인 상태라면 메인 페이지로 이동 (관리자/사용자 구분)
      if (loggedIn === 'true') {
        if (Number(isAdmin) === 1) {
          router.replace('/admin/main'); // ✅ 관리자 자동 이동
        } else {
          router.replace('/MainPage/main'); // ✅ 사용자 자동 이동
        }
      }
    };

    checkLogin();
  }, []);

  const handleStart = () => {
    router.push('/Login/login')
    //router.push('admin/main')
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
