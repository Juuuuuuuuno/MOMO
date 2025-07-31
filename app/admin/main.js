// app/MainPage/admin_main.js
import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import FarmInfoCard from '../Components/FarmInfo/FarmInfoCard';
import DoubleButtonRow from '../Components/Button/DoubleButtonRow';
import ColoredFullWidthButton from '../Components/Button/ColoredFullWidthButton';
import styles from '../Styles/MainStyle';
import { ImageBackground } from 'react-native-web';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

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
                    onLeftPress={() => {router.push('/admin/SetStatus'), console.log("🛠 상태변경")}}
                    onRightPress={() => {router.push('/admin/AddProduct'), console.log("🍑 상품추가")}}
                />

                <ColoredFullWidthButton
                    label="상품 목록"
                    onPress={()=> {router.push('/MainPage/ProductList'), console.log("📜상품목록")}}
                    backgroundColor={"#888"}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
