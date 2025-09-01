//app/Login/ChangePW.js
import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import InputField from '../Components/InputField/InputField';
import InputFieldpw from '../Components/InputField/InputFieldpw';
import FullWidthButton from '../Components/Button/FullWidthButton';
import BackButton from '../Components/Button/BackButton';
import { useRouter } from 'expo-router';
import styles from '../Styles/RegisterStyle';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { SERVER_DOMAIN } from '@env';

export default function ChangePassword() {
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const router = useRouter();

    // Login에서 비밀번호 변경시 받아온 phone 정보
    const { phone } = useLocalSearchParams();

    const isValid = /^\d{6}$/.test(code) && password.length >= 8;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                <BackButton />
                <Text style={styles.title}>
                    문자로 발송된 인증번호와{'\n'}새로운 비밀번호를 입력해 주세요
                </Text>

                <InputField
                    placeholder="인증번호 6자리 숫자 입력"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="numeric"
                />

                <InputFieldpw
                    placeholder="8자 이상 입력"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPw}
                />

                <TouchableOpacity
                    onPress={() => setShowPw(!showPw)}
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
                >
                    <View
                    style={{
                        width: 18,
                        height: 18,
                        borderWidth: 1,
                        borderColor: '#999',
                        marginRight: 6,
                        backgroundColor: showPw ? '#999' : '#fff',
                    }}
                    />
                    <Text style={{ color: '#333' }}>비밀번호 표시</Text>
                </TouchableOpacity>

                <FullWidthButton
                    label="변경하기"
                    disabled={!isValid}
                    onPress={async () => {
                    try {
                        const response = await axios.post(`${SERVER_DOMAIN}/api/reset-password`, {
                        code,
                        newPw: password,
                        });

                        if (response.data.success) {
                        Alert.alert('변경 완료', '비밀번호가 변경되었습니다.');
                        router.replace('/Login/login');
                        } else {
                        Alert.alert('실패', response.data.message || '변경에 실패했습니다.');
                        }
                    } catch (error) {
                        console.error('❌ 비밀번호 변경 실패:', error.response?.data || error.message);
                        Alert.alert('오류', error.response?.data?.message || '서버 오류');
                    }
                    }}
                />
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
