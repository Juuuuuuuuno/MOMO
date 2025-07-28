//app/admin/ProductDetail.js
import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import BackButton from '../Components/Button/BackButton';
import IconButton from '../Components/Button/IconButton';
import DoubleButtonRowDisable from '../Components/Button/DoubleButtonRowDisable';
import styles from '../Styles/ProductDetailStyle';

export default function ProductDetail() {
    const router = useRouter();
    const { product_id, name, price, image_url } = useLocalSearchParams();

    const [quantity, setQuantity] = useState(1);

    const getDeliveryFee = (quantity) => {
        return quantity === 1 ? 5000 : 6000;
    };

    const isOverWeight = (quantity) => {
        const weightPerUnit = 4.5;
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
            style={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerRow}>
                    <BackButton onPress={() => router.back()} />
                    <Text style={styles.headerTitle}>상품 구매 (관리자)</Text>
                    <View style={styles.iconGroup}>
                        <IconButton iconSource={require('../../assets/15050.png')} onPress={() => {}} />
                    </View>
                </View>

                <ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom: 200 }]}>
                    <Image source={{ uri: `http://192.168.35.144:3001${image_url}` }} style={styles.image} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.productName}>{name}</Text>
                        <TouchableOpacity
                            onPress={() => router.push({
                                pathname: 'admin/ModifyProduct',
                                params: {
                                    product_id,
                                    name,
                                    price,
                                    image_url,
                                }
                            })}
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
                                {overweight && (
                                    <Text style={[styles.overweightWarning, { flex: 1, flexWrap: 'wrap' }]}>총 중량이 20kg을 초과하여 배송이 불가합니다.</Text>
                                )}
                            </View>
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
                        onLeftPress={() => console.log('🛒 장바구니 담기')}
                        onRightPress={() => {
                            console.log('✅ 바로구매');
                            router.push({
                                pathname: 'MainPage/OrderPage',
                                params: {
                                    product_id,
                                    name,
                                    price,
                                    image_url,
                                    quantity,
                                    deliveryFee,
                                }
                            })
                        }}
                        disabled={overweight}
                    />
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
