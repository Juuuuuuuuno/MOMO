//app/MainPage/PayPage.js
import React, { useEffect } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import DoubleButtonRowIndividualDisable from '../Components/Button/DoubleButtonRowIndividualDisable';
import { useRoute } from '@react-navigation/native';
import styles from '../Styles/PayPageStyle';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PayPage = () => {
    const route = useRoute();
    const {
        product_id,
        price,
        name,
        totalPrice,
        quantity,
        recipient,
        address,
        phone,
        requestNote,
        orderNumber,
        deadline,
    } = route.params;
    const [canClose, setCanClose] = useState(false); //닫기 버튼 상태
    const [canSubmit, setCanSubmit] = useState(true); // 입금완료 버튼 상태

    const [modalVisible, setModalVisible] = useState(false);

    const router = useRouter();

    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const storedId = await AsyncStorage.getItem('user_id');
            setUserId(Number(storedId)); // 반드시 숫자로 변환
        };
        fetchUserId();
    }, []);

    return (
        <View style={styles.container}>
        <Text style={styles.title}>주문완료</Text>
        <Text style={styles.orderNumber}>주문번호 : {orderNumber}</Text>
        <Text style={styles.infoText}>
            아래 계좌로 입금해 주시면 입금 확인 후 정상적으로 결제 완료처리가 됩니다.
        </Text>

        <View style={styles.box}>
            <Text style={styles.label}>계좌 정보</Text>
            <Text style={styles.account}>• 농협 356-1416-3712-53</Text>
            <Text style={styles.account}>• 예금주 : 이준호</Text>
            <Text style={styles.accountHint2}>
            입금자 명은 이름+휴대폰 뒷번호로 입금해 주세요.{'\n'}
            예시 : 홍길동1234
            </Text>

            <Text style={styles.label}>결제 금액</Text>
            <Text style={styles.value}>{totalPrice.toLocaleString()}원</Text>

            <Text style={styles.label}>입금 기한</Text>
            <Text style={styles.value}>{deadline} 까지</Text>
            <Text style={styles.accountHint}>
            입금 기한이 지나면 자동으로 취소처리 됩니다.
            </Text>
        </View>

        <Text style={styles.footerHint}>
            입금 후 [입금 완료] 버튼을 눌러주시면 주문이 정상 접수됩니다.
        </Text>


        <DoubleButtonRowIndividualDisable
            leftLabel="닫기"
            rightLabel="입금 완료"
            leftDisabled={!canClose}
            rightDisabled={!canSubmit}
            onLeftPress={() => {
                if (canClose) router.replace('MainPage/ProductList');
                //router.replace('MainPage/ProductList');
            }}
            onRightPress={() => {
                if (canSubmit) setModalVisible(true);
            }}
        />
            <Modal
                transparent
                visible={modalVisible}
                animationType="fade"
                >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>입금 확인 알림을 전송했습니다.</Text>
                    <Text style={styles.modalContent}>예금주에게 입금 사실이 전달되었습니다.</Text>
                    <Pressable
                        style={styles.modalButton}
                        onPress={async () => {
                            if (!userId) {
                                alert('사용자 정보를 불러오고 있습니다. 잠시 후 다시 시도해 주세요.');
                                return;
                            }
                            try {
                            const res = await fetch('http://192.168.35.144:3001/api/orders', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                user_id : userId,
                                recipient,
                                recipient_address: address,
                                recipient_phone: phone,
                                request_note: requestNote,
                                total_price: totalPrice,
                                status: '입금대기',
                                order_number: orderNumber,
                                items: [
                                    {
                                    product_id, // OrderPage.js 에서 받아온 값 ( ProductList.js -> ProductDetail.js -> OrderPage.js 로 값 이동)
                                    quantity, //수량 OrderPage.js에서 받아옴
                                    price_each: Number(price), //단일 상품 products table에 있음
                                    },
                                ],
                                }),
                            });
                            console.log('✅ 보낼 상품 : ',product_id)

                            const data = await res.json();

                            if (res.ok) {
                                console.log('✅ 주문 저장 성공:', data);

                                // ✅ 문자 발송 요청
                                await fetch('http://192.168.35.144:3001/api/send-payment-alert', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                    orderNumber,
                                    name,
                                    totalPrice,
                                    quantity,
                                    user_id : userId,
                                    orderId:data.order_id
                                    }),
                                });

                                setCanSubmit(false); //입금완료 비활성화
                                setModalVisible(false);
                                setCanClose(true); //닫기 활성화
                                

                            } else {
                                console.error('❌ 주문 저장 실패:', data.message);
                                alert('주문 저장에 실패했습니다.');
                            }
                            } catch (err) {
                            console.error('❌ 주문 요청 오류:', err);
                            alert('서버와 연결할 수 없습니다.');
                            }
                        }}
                        >
                        <Text style={styles.modalButtonText}>확인</Text>
                    </Pressable>

                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default PayPage;
