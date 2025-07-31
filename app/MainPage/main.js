// app/MainPage/main.js
import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import FarmInfoCard from '../Components/FarmInfo/FarmInfoCard';
import FullWidthButton from '../Components/Button/FullWidthButton';
import styles from '../Styles/MainStyle';

export default function MainPage() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
            {/* 농장 카드 컴포넌트 */}
            <FarmInfoCard />

            {/* 주문하기 버튼 */}
            <FullWidthButton
            label="주문하기"
            onPress={() => {
                console.log('📜 주문하기')
                router.push('MainPage/ProductList')
                    }
                }
            />
        </ScrollView>
        </SafeAreaView>
    );
}
