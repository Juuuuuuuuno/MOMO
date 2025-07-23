// app/MainPage/admin_main.js
import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import FarmInfoCard from '../Components/FarmInfo/FarmInfoCard';
import DoubleButtonRow from '../Components/Button/DoubleButtonRow';
import styles from '../Styles/MainStyle';

export default function AdminMainPage() {
    const router = useRouter();

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
                    onLeftPress={() => router.push('/admin/status')}
                    onRightPress={() => router.push('/admin/AddProduct')}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
