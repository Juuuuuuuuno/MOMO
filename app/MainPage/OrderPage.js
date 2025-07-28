// app/MainPage/OrderPage.js
import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    SafeAreaView,
    ScrollView,
    Modal,
    TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BackButton from '../Components/Button/BackButton';
import FullWidthButton from '../Components/Button/FullWidthButton';
import AgreementBox from '../Components/Agreement/AgreementBox';
import AgreementModal from '../Components/Agreement/AgreementModal';
import InputField from '../Components/InputField/InputField'; // ✅ 요청사항 입력 필드 추가
import styles from '../Styles/OrderPageStyle';

export default function OrderPage() {
    const router = useRouter();

    // 전달받은 파라미터
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
    } = useLocalSearchParams();

    console.log('✅ 받아온 product_id:', product_id);  // 이거 추가

    const parsedPrice = Number(price) || 0;
    const parsedQuantity = Number(quantity) || 0;
    const parsedDeliveryFee = Number(deliveryFee) || 0;
    const totalPrice = parsedPrice * parsedQuantity + parsedDeliveryFee;

    const [agreed, setAgreed] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [requestNote, setRequestNote] = useState(''); // ✅ 요청사항 상태 추가

    const handleAgree = () => {
        setAgreed(true);
        setModalVisible(false);
    };

    const handleToggleCheck = () => {
        setAgreed((prev) => !prev);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 상단 헤더 */}
            <View style={styles.headerRow}>
                <BackButton onPress={() => router.back()} />
                <Text style={styles.headerTitle}>주문 / 결제</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollView}>
                {/* 배송지 영역 */}
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

                                {/* ✅ 요청사항 입력 필드 */}
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

                {/* 주문 상품 영역 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>주문 상품</Text>
                    <View style={styles.productBox}>
                        <Image
                            source={{ uri: `http://192.168.35.144:3001${image_url}` }}
                            style={styles.productImage}
                        />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{name}</Text>
                            <View style={styles.productInfoRow}>
                                <Text style={styles.productDetail}>수량: {parsedQuantity}개</Text>
                                <Text style={styles.productPrice}>
                                    {(parsedPrice * parsedQuantity).toLocaleString()}원
                                </Text>
                            </View>
                            <Text style={styles.productDetail}>
                                배송비: {parsedDeliveryFee.toLocaleString()}원
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.shippingNote}>
                        입금 확인 → 상품 준비 → 택배 발송 순으로 처리됩니다.
                    </Text>
                </View>

                {/* 총 주문 금액 */}
                <View style={styles.totalBox}>
                    <Text style={styles.totalLabel}>총 주문금액</Text>
                    <Text style={styles.totalPrice}>{totalPrice.toLocaleString()}원</Text>
                </View>

                {/* 안내 사항 */}
                <AgreementBox
                    agreed={agreed}
                    onToggleCheck={handleToggleCheck}
                    onShowTerms={() => setModalVisible(true)}
                />
            </ScrollView>

            {/* 결제하기 버튼 */}
            <View style={styles.bottomBar}>
                <FullWidthButton
                    label="결제하기"
                    disabled={!agreed}
                    onPress={() => {
                        console.log('✅ 결제 시도');
                        console.log('요청사항:', requestNote);

                        const today = new Date();
                        const deadline = new Date(today);
                        deadline.setDate( today.getDate() + 2 );
                        deadline.setHours( 23, 59, 0, 0 );

                        const yyyymmdd = today.toISOString().slice(0,10).replace(/-/g,'');
                        const randomNum = Math.floor(Math.random() * 9000) + 1000;
                        const orderNumber = `${yyyymmdd}${randomNum}`; 

                        router.push({
                                pathname: 'MainPage/PayPage',
                                params: {
                                    product_id,
                                    name,
                                    price,
                                    totalPrice,
                                    quantity,
                                    recipient,
                                    address,
                                    phone,
                                    requestNote,
                                    orderNumber,
                                    deadline: deadline.toISOString().slice(0, 10) + ' 23:59',
                                },
                            });
                    }}
                />
            </View>

            {/* 약관 모달 */}
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
