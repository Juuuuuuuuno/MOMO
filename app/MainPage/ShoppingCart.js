// app/MainPage/ShoppingCart.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackButton from '../Components/Button/BackButton';
import MainButton from '../Components/Button/MainButton';
import FullWidthButton from '../Components/Button/FullWidthButton';
import styles from '../Styles/ShoppingCartStyle';
import { EXPO_PUBLIC_SERVER_DOMAIN } from '@env';

export default function ShoppingCart() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const updateCartWithParams = async () => {
            try {
                const stored = await AsyncStorage.getItem('cart');
                const prevItems = stored ? JSON.parse(stored) : [];

                if (params.name && params.product_id) {
                    const newItem = {
                        product_id: params.product_id,
                        name: params.name,
                        price: Number(params.price),
                        quantity: Number(params.quantity),
                        image_url: `${EXPO_PUBLIC_SERVER_DOMAIN}${params.image_url}`,
                        deliveryFee: Number(params.deliveryFee),
                    };

                    const existsIndex = prevItems.findIndex(item => item.product_id === newItem.product_id);

                    if (existsIndex !== -1) {
                        // 이미 장바구니에 있으면 수량 증가
                        prevItems[existsIndex].quantity += newItem.quantity;
                        setCartItems(prevItems);
                        await AsyncStorage.setItem('cart', JSON.stringify(prevItems));
                    } else {
                        const updated = [...prevItems, newItem];
                        setCartItems(updated);
                        await AsyncStorage.setItem('cart', JSON.stringify(updated));
                    }
                } else {
                    setCartItems(prevItems); // params 없으면 불러오기만
                }
            } catch (err) {
                console.error('장바구니 불러오기 오류:', err);
            }
        };

        updateCartWithParams();
    }, [params.name, params.product_id]);

    const increase = (index) => {
        const updated = [...cartItems];
        updated[index].quantity += 1;
        setCartItems(updated);
        AsyncStorage.setItem('cart', JSON.stringify(updated));
    };

    const decrease = (index) => {
        const updated = [...cartItems];
        if (updated[index].quantity === 1) {
            updated.splice(index, 1);
        } else {
            updated[index].quantity -= 1;
        }
        setCartItems(updated);
        AsyncStorage.setItem('cart', JSON.stringify(updated));
    };

    const clearCart = () => {
        setCartItems([]);
        AsyncStorage.removeItem('cart');
    };

    const getTotalPrice = () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const getDeliveryFee = () => {
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        if (totalQuantity === 0) return 0;
        return totalQuantity === 1 ? 5000 : 6000;
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Image source={require('../../assets/15050.png')} style={styles.emptyImage} />
            <Text style={[styles.emptyText1, { textAlign: 'center' }]}>장바구니에</Text>
            <Text style={[styles.emptyText, { textAlign: 'center' }]}>담긴 상품이 없습니다.</Text>
            <Text style={styles.emptyText2}>마음에 드는 상품을 장바구니에 담아보세요.</Text>
            <MainButton title="상품 보러가기" onPress={() => router.push('/MainPage/ProductList')} />
        </View>
    );

    const renderCart = () => (
        <>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>주문 상품</Text>
                    {cartItems.map((item, index) => (
                        <View key={index} style={styles.productBox}>
                            <Image source={{ uri: item.image_url }} style={styles.productImage} resizeMode='cover' /*짜부 방지*/ />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{item.name}</Text>
                                <View style={styles.productInfoRow}>
                                    <View style={styles.quantityBox}>
                                        <TouchableOpacity onPress={() => decrease(index)} style={styles.quantityButton}>
                                            <Text style={styles.quantityText}>-</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.quantityNumber}>{item.quantity}</Text>
                                        <TouchableOpacity onPress={() => increase(index)} style={styles.quantityButton}>
                                            <Text style={styles.quantityText}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.productPrice}>
                                        {(item.price * item.quantity).toLocaleString()}원
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* 하단 고정 바 */}
            <View style={styles.fixedBottom}>
                <View style={styles.priceBox}>
                    <View style={styles.row}>
                        <Text style={styles.label}>총 상품금액</Text>
                        <Text style={styles.value}>{getTotalPrice().toLocaleString()}원</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>총 배송비</Text>
                        <Text style={styles.value}>{getDeliveryFee().toLocaleString()}원</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>총 결제 예상금액</Text>
                        <Text style={styles.total}>
                            {(getTotalPrice() + getDeliveryFee()).toLocaleString()}원
                        </Text>
                    </View>
                </View>

                <View style={{ height: 12 }} />
                <FullWidthButton
                    label="구매하기"
                    onPress={() => {
                        console.log('💰 결제페이지 이동');
                        // ✅ push → replace 변경 (스택에 ShoppingCart 안 남게)
                        router.replace({
                            pathname: '/MainPage/OrderPage',
                            params: {
                                cart: JSON.stringify(cartItems),
                            },
                        });
                    }}
                />
            </View>
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <View style={{ width: 70 }}>
                    <BackButton onPress={() => router.back()} />
                </View>
                <Text style={styles.headerTitle}>장바구니</Text>
                {cartItems.length > 0 ? (
                    <TouchableOpacity onPress={clearCart} style={{ width: 70 }}>
                        <Text style={styles.clearText}>전체 삭제</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 70 }} />
                )}
            </View>
            {cartItems.length === 0 ? renderEmpty() : renderCart()}
        </SafeAreaView>
    );
}
