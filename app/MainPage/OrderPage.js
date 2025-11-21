// app/MainPage/OrderPage.js
import React, { useState, useEffect } from 'react'; // ✅ useEffect 추가
import {
    View,
    Text,
    Image,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackButton from '../Components/Button/BackButton';
import FullWidthButton from '../Components/Button/FullWidthButton';
import AgreementBox from '../Components/Agreement/AgreementBox';
import AgreementModal from '../Components/Agreement/AgreementModal';
import InputField from '../Components/InputField/InputField';
import styles from '../Styles/OrderPageStyle';
import { SERVER_DOMAIN } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ 추가

export default function OrderPage() {
    const router = useRouter();

    const {
        product_id,
        name,
        price,
        image_url,
        quantity,
        deliveryFee,
        recipient,
        address,
        phone,
        cart,
    } = useLocalSearchParams();

    const parsedCart = cart ? JSON.parse(cart) : [];
    const isCart = parsedCart.length > 0;

    const parsedPrice = Number(price) || 0;
    const parsedQuantity = Number(quantity) || 0;
    const parsedDeliveryFee = Number(deliveryFee) || 0;
    const totalPriceSingle = parsedPrice * parsedQuantity + parsedDeliveryFee;

    const getTotalPriceCart = () => parsedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const getDeliveryFeeCart = () => {
        const totalQuantity = parsedCart.reduce((sum, item) => sum + item.quantity, 0);
        return totalQuantity <= 1 ? 5000 : 6000;
    };
    const totalPriceCart = getTotalPriceCart() + getDeliveryFeeCart();

    const [agreed, setAgreed] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [requestNote, setRequestNote] = useState('');

    // ✅ 저장된 주소 불러오기
    useEffect(() => {
        const loadSavedAddress = async () => {
            if (!recipient || !address || !phone) {
                const saved = await AsyncStorage.getItem('savedAddress');
                if (saved) {
                    const { name, address, phone } = JSON.parse(saved);
                    router.setParams({
                        recipient: name,
                        address,
                        phone,
                    });
                }
            }
        };
        loadSavedAddress();
    }, []);

    const handleAgree = () => {
        setAgreed(true);
        setModalVisible(false);
    };

    const handleToggleCheck = () => {
        setAgreed((prev) => !prev);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <BackButton onPress={() => router.back()} />
                <Text style={styles.headerTitle}>주문 / 결제</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollView}>
                {/* 배송지 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>배송지</Text>
                    <View style={styles.addressBox}>
                        {recipient && address && phone ? (
                            <>
                                <View style={styles.addressRow}>
                                    <Text style={styles.addressText}>받으시는 분 : {recipient}</Text>
                                    <TouchableOpacity
                                        style={styles.editAddressBtn}
                                        onPress={() =>
                                            router.push({
                                                pathname: '/MainPage/SetAddress',
                                                params: {
                                                    cart: JSON.stringify(cart),
                                                    product_id,
                                                    name,
                                                    price,
                                                    image_url,
                                                    quantity,
                                                    deliveryFee,
                                                },
                                            })
                                        }
                                    >
                                        <Text style={styles.editAddressText}>배송지 변경</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.addressText}>주소 : {address}</Text>
                                <Text style={styles.addressText}>전화번호 : {phone}</Text>
                                <InputField
                                    placeholder="요청사항을 입력해 주세요."
                                    value={requestNote}
                                    onChangeText={setRequestNote}
                                    keyboardType="default"
                                />
                            </>
                        ) : (
                            <>
                                <Text style={styles.addressText}>배송지를 먼저 등록해주세요</Text>
                                <TouchableOpacity
                                    style={styles.registerBtn}
                                    onPress={() =>
                                        router.push({
                                            pathname: '/MainPage/SetAddress',
                                            params: {
                                                cart: JSON.stringify(cart),
                                                product_id,
                                                name,
                                                price,
                                                image_url,
                                                quantity,
                                                deliveryFee,
                                            },
                                        })
                                    }
                                >
                                    <Text style={styles.registerText}>등록하기</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
                
                {/* 주문 상품 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>주문 상품</Text>

                    {isCart ? (
                        parsedCart.map((item, index) => (
                            <View key={index} style={[styles.productBox, { marginBottom: 12 }]}>
                                <Image source={{ uri: item.image_url }} style={styles.productImage} />
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <View style={styles.productInfoRow}>
                                        <Text style={styles.productDetail}>수량: {item.quantity}개</Text>
                                        <Text style={styles.productPrice}>
                                            {(item.price * item.quantity).toLocaleString()}원
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={[styles.productBox, { marginBottom: 12 }]}>
                            <Image source={{ uri: `${SERVER_DOMAIN}${image_url}` }} style={styles.productImage} />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{name}</Text>
                                <View style={styles.productInfoRow}>
                                    <Text style={styles.productDetail}>수량: {parsedQuantity}개</Text>
                                    <Text style={styles.productPrice}>
                                        {(parsedPrice * parsedQuantity).toLocaleString()}원
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    <Text style={styles.shippingNote}>
                        입금 확인 → 상품 준비 → 택배 발송 순으로 처리됩니다.
                    </Text>
                </View>

                {/* 배송비 표시 */}
                <View style={styles.totalBox}>
                    <Text style={styles.totalLabel}>배송비</Text>
                    <Text style={styles.totalPrice}>
                        {(isCart ? getDeliveryFeeCart() : parsedDeliveryFee).toLocaleString()}원
                    </Text>
                </View>

                {/* 총 주문 금액 */}
                <View style={styles.totalBox}>
                    <Text style={styles.totalLabel}>총 주문금액</Text>
                    <Text style={styles.totalPrice}>
                        {(isCart ? totalPriceCart : totalPriceSingle).toLocaleString()}원
                    </Text>
                </View>

                <AgreementBox
                    agreed={agreed}
                    onToggleCheck={handleToggleCheck}
                    onShowTerms={() => setModalVisible(true)}
                />
            </ScrollView>

            {/* 결제 버튼 */}
            <View style={styles.bottomBar}>
            <FullWidthButton
                label="결제하기"
                disabled={!agreed}
                onPress={() => {
                    const today = new Date();
                    const deadline = new Date(today);
                    deadline.setDate(today.getDate() + 2);
                    deadline.setHours(23, 59, 0, 0);

                    const yyyymmdd = today.toISOString().slice(0, 10).replace(/-/g, '');
                    const randomNum = Math.floor(Math.random() * 9000) + 1000;
                    const orderNumber = `${yyyymmdd}${randomNum}`;

                    // ✅ push → replace 변경 (스택에 OrderPage 안 남게)
                    router.replace({
                        pathname: 'MainPage/PayPage',
                        params: {
                            orderNumber,
                            requestNote,
                            recipient,
                            address,
                            phone,
                            cart: JSON.stringify(parsedCart),
                            product_id,
                            name,
                            price,
                            quantity,
                            deliveryFee,
                            totalPrice: isCart ? totalPriceCart : totalPriceSingle,
                            deadline: deadline.toISOString().slice(0, 10) + ' 23:59',
                        },
                    });
                }}
            />
            </View>

            {modalVisible && (
                <AgreementModal
                    visible={modalVisible}
                    onAgree={handleAgree}
                    onClose={() => setModalVisible(false)}
                />
            )}
        </SafeAreaView>
    );
}
