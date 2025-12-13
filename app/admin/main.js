// app/MainPage/admin_main.js
import React from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native'; // ✅ Alert, TouchableOpacity 추가
import { useRouter } from 'expo-router';
import FarmInfoCard from '../Components/FarmInfo/FarmInfoCard';
import DoubleButtonRow from '../Components/Button/DoubleButtonRow';
import ColoredFullWidthButton from '../Components/Button/ColoredFullWidthButton';
import styles from '../Styles/MainStyle';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ 추가
import { EXPO_PUBLIC_SERVER_DOMAIN } from '@env';

export default function AdminMainPage() {
    const router = useRouter();

    // ✅ 로그아웃 처리 함수
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
                        await AsyncStorage.clear(); // 모든 저장 데이터 초기화
                        router.replace('/Login/intro'); // 인트로 화면으로 이동
                        console.log(`👋 로그아웃 완료 / 관리자 전화번호: ${phone || '알 수 없음'}`);
                    } 
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* 상단 제목 */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign:'center' }}>관리자 페이지</Text>
                </View>

                {/* 농장 카드 */}
                <FarmInfoCard />

                {/* 버튼 2개 */}
                <DoubleButtonRow
                    leftLabel="상태 관리"
                    rightLabel="상품 추가"
                    onLeftPress={() => {router.push('/admin/SetStatus'), console.log("🛠 상태변경")}}
                    onRightPress={() => {router.push('/admin/AddProduct'), console.log("🍑 상품추가")}}
                />

                <ColoredFullWidthButton
                    label="상품 목록"
                    onPress={()=> {router.push('/MainPage/ProductList'), console.log("📜상품목록")}}
                    backgroundColor={"#888"}
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
