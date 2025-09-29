// app/MainPage/main.js
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import FarmInfoCard from '../Components/FarmInfo/FarmInfoCard';
import FullWidthButton from '../Components/Button/FullWidthButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../Styles/MainStyle';

export default function MainPage() {
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert(
            "로그아웃",
            "정말 로그아웃 하시겠습니까?",
            [
                { text: "취소", style: "cancel" },
                { 
                    text: "확인", 
                    onPress: async () => {
                        const phone = await AsyncStorage.getItem('phone'); // ✅ 저장된 전화번호 불러오기
                        await AsyncStorage.clear(); // 모든 데이터 초기화
                        router.replace('/Login/intro');
                        console.log(`👋 로그아웃 완료 / 사용자 전화번호: ${phone || '알 수 없음'}`);
                    } 
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* 농장 카드 컴포넌트 */}
                <FarmInfoCard />

                {/* 주문하기 버튼 */}
                <FullWidthButton
                    label="주문하기"
                    onPress={() => {
                        console.log('📜 주문하기');
                        router.push('MainPage/ProductList');
                    }}
                />

                {/* ✅ 로그아웃 버튼 (빨간 글씨) */}
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={{ 
                        color: 'red', 
                        marginTop: 20, 
                        textAlign: 'center', 
                        fontSize: 16, 
                        fontWeight: 'bold' 
                    }}>
                        로그아웃
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
