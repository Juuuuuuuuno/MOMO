// app/MainPage/ProductDetail.js
import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import BackButton from '../Components/Button/BackButton';
import IconButton from '../Components/Button/IconButton';
import DoubleButtonRowDisable from '../Components/Button/DoubleButtonRowDisable';
import styles from '../Styles/ProductDetailStyle';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_DOMAIN } from '@env';

export default function ProductDetail() {
    const router = useRouter();
    const { product_id, name, price, image_url } = useLocalSearchParams();

    const [quantity, setQuantity] = useState(1);

    // ✅ 배송비 계산 로직 (현재 화면에서는 사용하지 않지만, 기존 코드 유지)
    const getDeliveryFee = (quantity) => {
        return quantity === 1 ? 5000 : 6000;
    };

    const parsedPrice = Number(price);
    const parsedQuantity = Number(quantity);
    const deliveryFee = getDeliveryFee(parsedQuantity);
    const totalPrice = parsedPrice * parsedQuantity + deliveryFee;

    const increase = () => setQuantity(prev => prev + 1);
    const decrease = () => setQuantity(prev => Math.max(1, prev - 1));

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* 헤더 */}
                <View style={styles.headerRow}>
                    {/* 왼쪽: 뒤로가기 버튼 고정 폭 */}
                    <View style={{ width: 70 }}>
                        <BackButton onPress={() => router.back()} />
                    </View>

                    {/* 가운데: 제목 중앙 정렬 */}
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={styles.headerTitle}>상품 관리</Text>
                    </View>

                    {/* 오른쪽: 자리 맞추기용 null 아이콘 */}
                    <View style={{ width: 70, alignItems: 'flex-end' }}>
                        <IconButton
                            iconSource={require('../../assets/null.png')}
                            // 동작 없음, 레이아웃용
                            onPress={() => {}}
                        />
                    </View>
                </View>

                {/* 본문 */}
                <ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom: 40 }]}>
                    <Image
                        source={{ uri: `${SERVER_DOMAIN}${image_url}` }}
                        style={styles.image}
                        resizeMode="cover" // 웹에서 이미지 찌부 방지
                    />

                    {/* 상품명 + 수정 버튼 (관리자용 수정 기능 유지) */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.productName}>{name}</Text>
                        <TouchableOpacity
                            // 관리자 수정 페이지로 이동
                            onPress={() =>
                                router.push({
                                    pathname: 'admin/ModifyProduct',
                                    params: {
                                        product_id,
                                        name,
                                        price,
                                        image_url,
                                    },
                                })
                            }
                        >
                            <Text style={{ color: 'blue', fontSize: 16, marginRight: 10 }}>수정</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.price}>
                        ₩{Number(price).toLocaleString()} <Text style={styles.deliveryIncluded}>배송비 미포함</Text>
                    </Text>

                    <View style={styles.descriptionBox}>
                        <Text style={styles.bullet}>※ 복숭아는 수확 직후 딱딱한 상태로 배송되며, 보관 상태에 따라 말랑해집니다.</Text>
                        <Text style={styles.bullet}>※ 상품에 문제가 있을 시 010-3462-3100에 문의 주세요.</Text>
                        <Text style={styles.bullet}>농장 직송 우체국 택배 2~3일 후 도착</Text>
                        <Text style={styles.bullet}>판매자 : 참농원 (이재석)</Text>
                    </View>
                </ScrollView>

                {/* ✅ 하단 가격/수량/합계 + 장바구니/바로구매 푸터 전체 삭제 */}
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
