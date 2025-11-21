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

    // ✅ 배송비 계산만 유지 (수량 제한/중량제한 제거)
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
                    <BackButton onPress={() => router.back()} />
                    <Text style={styles.headerTitle}>상품 구매</Text>
                    <View style={styles.iconGroup}>
                        <IconButton
                            iconSource={require('../../assets/15050.png')}
                            onPress={() => { router.push('/MainPage/ShoppingCart'); }}
                        />
                    </View>
                </View>

                {/* 본문 */}
                <ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom: 200 }]}>
                    <Image
                        source={{ uri: `${SERVER_DOMAIN}${image_url}` }}
                        style={styles.image}
                        resizeMode="cover" // ✅ 웹에서 이미지 찌부 방지
                    />

                    <Text style={styles.productName}>{name}</Text>
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

                {/* 하단 가격/수량/합계 */}
                <View style={styles.fixedBottom}>
                    <View style={styles.priceBox}>
                        <View style={styles.row}>
                            <Text style={styles.label}>{name}</Text>
                            <Text style={styles.value}>₩{Number(price).toLocaleString()}</Text>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.quantityBox}>
                                <TouchableOpacity onPress={decrease} style={styles.quantityButton}>
                                    <Text style={styles.quantityText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.quantityNumber}>{quantity}</Text>
                                <TouchableOpacity onPress={increase} style={styles.quantityButton}>
                                    <Text style={styles.quantityText}>+</Text>
                                </TouchableOpacity>
                            </View>

                            {/* ✅ 항상 배송비/총합 표시 (중량 초과 조건 제거) */}
                            <View>
                                <Text style={styles.label2}>배송비: ₩{deliveryFee.toLocaleString()}</Text>
                                <Text style={styles.total}>총 {totalPrice.toLocaleString()}원</Text>
                            </View>
                        </View>
                    </View>

                    {/* 버튼 (disabled 제거) */}
                    <DoubleButtonRowDisable
                        leftLabel="장바구니 담기"
                        rightLabel="바로구매"
                        onLeftPress={async () => {
                            try {
                                const existing = await AsyncStorage.getItem('cart');
                                const prevItems = existing ? JSON.parse(existing) : [];

                                const newItem = {
                                    product_id,
                                    name,
                                    price: Number(price),
                                    image_url: `${SERVER_DOMAIN}${image_url}`,
                                    quantity,
                                    deliveryFee,
                                };

                                const index = prevItems.findIndex(item => item.name === name);
                                if (index > -1) {
                                    prevItems[index].quantity += quantity;
                                    await AsyncStorage.setItem('cart', JSON.stringify(prevItems));
                                } else {
                                    const updated = [...prevItems, newItem];
                                    await AsyncStorage.setItem('cart', JSON.stringify(updated));
                                }

                                Alert.alert('알림', '장바구니에 상품을 담았습니다.');
                            } catch (e) {
                                console.error('장바구니 저장 오류:', e);
                            }
                        }}

                        // ✅ 라우터 문제 해결: push → replace 로 변경 (아래에서 상세 설명)
                        onRightPress={() => {
                            router.replace({
                                pathname: 'MainPage/OrderPage',
                                params: {
                                    product_id,
                                    name,
                                    price,
                                    image_url,
                                    quantity,
                                    deliveryFee,
                                },
                            });
                        }}
                    />
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
