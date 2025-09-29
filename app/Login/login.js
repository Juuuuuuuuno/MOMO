// app/Login/login.js
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import InputField from '../Components/InputField/InputField';
import InputFieldpw from '../Components/InputField/InputFieldpw';
import FullWidthButton from '../Components/Button/FullWidthButton';
import { useRouter } from 'expo-router';
import styles from '../Styles/IntroStyle';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_DOMAIN } from '@env';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const isValid = /^\d{10,11}$/.test(phone) && password.length >= 8;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 키보드 내리기용 터치 */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1, paddingHorizontal: 30, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.emoji}>🍑</Text>
              <Text style={styles.title}>MOMO</Text>
              <Text style={styles.subtitle2}>농부의 손에서 당신의 집까지, 모모</Text>

              <View style={{ width: '100%' }}>
                <InputField
                  placeholder="전화번호"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="numeric"
                />
              </View>

              <View style={{ width: '100%' }}>
                <InputFieldpw
                  placeholder="비밀번호"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={{ width: '100%', marginBottom: 20 }}
                />
              </View>

              <FullWidthButton
                label="로그인"
                disabled={!isValid}
                onPress={async () => {
                  //console.log('📱 phone:', phone);
                  //console.log('🔑 password:', password);
                  try {
                    const response = await axios.post(`${SERVER_DOMAIN}/api/login`, {
                      phone,
                      pw: password
                    });

                    if (response.data.success) {
                      const { user_id, is_admin, name } = response.data

                      // ✅ 관리자 여부 저장 (ProductList.js 등에서 사용할 수 있도록)
                      await AsyncStorage.setItem('is_admin',is_admin.toString())
                      await AsyncStorage.setItem('user_id',user_id.toString())
                      await AsyncStorage.setItem('is_logged_in','true')     // ✅ 로그인 상태 저장
                      await AsyncStorage.setItem('phone', phone);           // ✅ 전화번호 저장 (로그아웃 시 사용)
                      
                      //누가 어떤 로그인 했는지
                      const role = is_admin === 1 ? '관리자' : '사용자';
                      console.log(`${name} ${role} 로그인 성공`);

                      if(is_admin === 1 ) {
                        router.push('/admin/main');
                      } else {

                        router.push('/MainPage/main')
                      }
                    } else {
                      Alert.alert('로그인 실패', '전화번호 또는 비밀번호를 확인해주세요.');
                    }
                  } catch (error) {
                    console.error('❌ 로그인 요청 실패:', error.response?.data || error.message);
                    Alert.alert('로그인 실패', error.response?.data?.message || '서버 오류');
                  }
                }}
              />

              <TouchableOpacity
                onPress={async () => {
                  if (!phone || !/^\d{10,11}$/.test(phone)) {
                    Alert.alert('오류', '올바른 전화번호를 입력해주세요.');
                    return;
                  }

                  Alert.alert(
                    '비밀번호 변경',
                    `${phone} 번호로 인증번호를 전송하시겠습니까?`,
                    [
                      { text: '취소', style: 'cancel' },
                      {
                        text: '확인',
                        onPress: async () => {
                          try {
                            const res = await axios.post(`${SERVER_DOMAIN}/api/send-auth-code`, {
                              phone,
                            });

                            if (res.data.success) {
                              Alert.alert('성공', '인증번호가 전송되었습니다.');
                              router.push({ pathname: '/Login/ChangePW', params: { phone } }); // 전화번호 넘기기
                            }
                          } catch (error) {
                            console.error('인증번호 전송 실패:', error);
                            Alert.alert('실패', '문자 전송에 실패했습니다.');
                          }
                        }
                      }
                    ]
                  );
                }}
              >
                <Text style={{ color: '#888', marginTop: 15, marginBottom: 15 }}>
                  비밀번호 변경
                </Text>
              </TouchableOpacity>


              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
                <Text style={{ marginHorizontal: 10, color: '#888' }}>또는</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
              </View>

              <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/Login/register')}>
                <Text style={styles.signupTextStrong}>회원가입</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
