//app/MainPage/ProductDetail.js
import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import BackButton from '../Components/Button/BackButton';
import IconButton from '../Components/Button/IconButton';
import DoubleButtonRowDisable from '../Components/Button/DoubleButtonRowDisable';
import styles from '../Styles/ProductDetailStyle';

export default function ProductDetail() {
    const router = useRouter();
    const { name, price, image_url } = useLocalSearchParams(); // ProductList에서 전달됨

    const [quantity, setQuantity] = useState(1); // ✅ 이 줄이 누락됨
    const getDeliveryFee = (quantity) => {
    return quantity === 1 ? 5000 : 6000;
    };

    const isOverWeight = (quantity) => {
    const weightPerUnit = 4.5; // kg
    return (quantity * weightPerUnit) >= 20;
    };

    const parsedPrice = Number(price);
    const parsedQuantity = Number(quantity);
    const deliveryFee = getDeliveryFee(parsedQuantity);
    const totalPrice = parsedPrice * parsedQuantity + deliveryFee;
    const overweight = isOverWeight(parsedQuantity);



    const increase = () => setQuantity(prev => prev + 1);
    const decrease = () => setQuantity(prev => Math.max(1, prev - 1));

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            >
                <SafeAreaView style={styles.safeArea}>
                    {/* 상단 헤더 */}
                    <View style={styles.headerRow}>
                        <BackButton onPress={() => router.back()} />
                        <Text style={styles.headerTitle}>상품 구매</Text>
                        <View style={styles.iconGroup}>
                            <IconButton iconSource={require('../../assets/15050.png')} onPress={() => {}} />
                        </View>
                    </View>

                    {/* 본문 */}
                    <ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom : 200 }]}>
                        <Image source={{ uri: `http://192.168.35.144:3001${image_url}` }} style={styles.image} />

                        <Text style={styles.productName}>{name}</Text>
                        <Text style={styles.price}>
                            ₩{Number(price).toLocaleString()} <Text style={styles.deliveryIncluded}>배송비 미포함</Text>
                        </Text>



                        {/* 안내문구 */}
                        <View style={styles.descriptionBox}>
                            <Text style={styles.bullet}>※ 복숭아는 수확 직후 딱딱한 상태로 배송되며, 보관 상태에 따라 말랑해집니다.</Text>
                            <Text style={styles.bullet}>※ 상품에 문제가 있을 시 010-3462-3100에 문의 주세요.</Text>
                            <Text style={styles.bullet}>농장 직송 우체국 택배 2~3일 후 도착</Text>
                            <Text style={styles.bullet}>판매자 : 참농원 (이재석)</Text>
                        </View>
                    </ScrollView>

                    {/* 하단 고정 버튼 */}
                    <View style={styles.fixedBottom}>
                        {/* 💡 상품 가격/수량/합계 */}
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

                                {/* 중량 초과시 택배 불가 */}
                                {overweight && (
                                    <Text style={[styles.overweightWarning, {flex:1, flexWrap:'wrap'}]}>
                                    총 중량이 20kg을 초과하여 배송이 불가합니다.
                                    </Text>
                                )}
                                </View>

                                {/* 중량 초과가 아닐 경우만 배송비/총 가격 표시 */}
                                {!overweight && (
                                <View>
                                    <Text style={styles.label2}>배송비: ₩{deliveryFee.toLocaleString()}</Text>
                                    <Text style={styles.total}>총 {totalPrice.toLocaleString()}원</Text>
                                </View>
                                )}
                            </View>
                        </View>

                        <DoubleButtonRowDisable
                            leftLabel="장바구니 담기"
                            rightLabel="바로구매"
                            onLeftPress={() => {
                                console.log('🛒 장바구니 담기');
                            }}
                            onRightPress={() => {
                                console.log('✅ 바로구매');
                                router.push({
                                    pathname : 'MainPage/OrderPage',
                                    params: {
                                        name,
                                        price,
                                        image_url,
                                        quantity,
                                        deliveryFee,
                                    }
                                })
                            }}
                            disabled={overweight} // ✅ 중량 초과 시 버튼 비활성화
                        />
                    </View>
                </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
