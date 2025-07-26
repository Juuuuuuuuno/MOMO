// app/MainPage/OrderPage.js

// 여기서 상품 수정/삭제 만들어야 함
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
import styles from '../Styles/OrderPageStyle';

export default function OrderPage() {
    const router = useRouter();
    const { name, price, image_url, quantity, deliveryFee } = useLocalSearchParams();

    const parsedPrice = Number(price);
    const parsedQuantity = Number(quantity);
    const parsedDeliveryFee = Number(deliveryFee);
    const totalPrice = parsedPrice * parsedQuantity + parsedDeliveryFee;

    const [agreed, setAgreed] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleAgree = () => {
        console.log('✅ 개인정보 수집 및 이용에 동의하였습니다');
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
                <Text style={styles.addressText}>배송지를 먼저 등록해주세요</Text>
                <TouchableOpacity style={styles.registerBtn}>
                <Text style={styles.registerText}>등록하기</Text>
                </TouchableOpacity>
            </View>
            </View>

            {/* 주문 상품 영역 */}
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>주문 상품</Text>
            <View style={styles.productBox}>
                <Image source={{ uri: `http://192.168.35.144:3001${image_url}` }} style={styles.productImage} />
                <View style={styles.productInfo}>
                <Text style={styles.productName}>{name}</Text>
                    <View style={styles.productInfoRow}>
                        <Text style={styles.productDetail}>수량: {parsedQuantity}개</Text>
                        <Text style={styles.productPrice}>{(parsedPrice * parsedQuantity).toLocaleString()}원</Text>
                    </View>
                <Text style={styles.productDetail}>배송비: {parsedDeliveryFee.toLocaleString()}원</Text>
                </View>
            </View>
            <Text style={styles.shippingNote}>입금 확인 → 상품 준비 → 택배 발송 순으로 처리됩니다.</Text>
            </View>

            {/* 총 주문 금액 */}
            <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>총 주문금액</Text>
            <Text style={styles.totalPrice}>{totalPrice.toLocaleString()}원</Text>
            </View>

            {/* 안내 사항 */}
            <AgreementBox agreed={agreed} onToggleCheck={handleToggleCheck} onShowTerms={() => setModalVisible(true)} />
        </ScrollView>

        {/* 결제하기 버튼 */}
        <View style={styles.bottomBar}>
            <FullWidthButton
            label="결제하기"
            disabled={!agreed}
            onPress={() => console.log('결제 시도')}
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
