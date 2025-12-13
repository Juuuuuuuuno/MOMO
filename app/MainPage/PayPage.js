// app/MainPage/PayPage.js
import React, { useEffect } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import DoubleButtonRowIndividualDisable from '../Components/Button/DoubleButtonRowIndividualDisable';
import { useRoute } from '@react-navigation/native';
import styles from '../Styles/PayPageStyle';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXPO_PUBLIC_SERVER_DOMAIN } from '@env';

// ✅ 추가: 피드백 모달 & axios
import FeedbackModal from '../Components/Feedback/FeedbackModal';
import axios from 'axios';

// ✅ 추가: 피드백(A, 주문과정) 노출 정책
// 최초 1회 + 4주(28일) 쿨타임 후 재노출
const FEEDBACK_A_MODE = 'first_plus_cooldown'; // 'first_only'면 최초 1회만
const FEEDBACK_A_COOLDOWN_DAYS = 28;           // 4주 쿨타임

const [canClose, setCanClose] = useState(false);   // 닫기 버튼 상태
const [canSubmit, setCanSubmit] = useState(true);  // 입금완료 버튼 상태

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
    const [canClose, setCanClose] = useState(false);   //닫기 버튼 상태
    const [canSubmit, setCanSubmit] = useState(true);  //입금완료 버튼 상태

    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();
    const [userId, setUserId] = useState(null);

    // ✅ 추가: 피드백 모달 상태 (구매과정)
    const [showFeedback, setShowFeedback] = useState(false);
    const [lastOrderId, setLastOrderId] = useState(null); // 주문 ID 저장

    // 장바구니 목록
    const cartData = route.params.cart ? JSON.parse(route.params.cart) : null;

    useEffect(() => {
        const fetchUserId = async () => {
        const storedId = await AsyncStorage.getItem('user_id');
        setUserId(Number(storedId));
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
            }}
            onRightPress={() => {
            if (canSubmit) setModalVisible(true);
            }}
        />

 {/* ✅ 입금완료 모달 */}
        <Modal transparent visible={modalVisible} animationType="fade">
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>입금 확인 알림을 전송했습니다.</Text>
                    <Text style={styles.modalContent}>예금주에게 입금 사실이 전달되었습니다.</Text>

                    <Pressable
                        style={styles.modalButton}
                        onPress={async () => {
                            // ✅ 중복 주문 방지: 이미 처리 중이면 바로 종료
                            if (!canSubmit) {
                                return;
                            }

                            // ✅ 첫 클릭에서 바로 비활성화해서 여러 번 눌러도 한 번만 처리
                            setCanSubmit(false);

                            if (!userId) {
                                alert('사용자 정보를 불러오고 있습니다. 잠시 후 다시 시도해 주세요.');
                                // 사용자 정보를 못 불러왔으면 다시 시도할 수 있게 복구
                                setCanSubmit(true);
                                return;
                            }

                            try {
                                const res = await fetch(`${EXPO_PUBLIC_SERVER_DOMAIN}/api/orders`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        user_id: userId,
                                        recipient,
                                        recipient_address: address,
                                        recipient_phone: phone,
                                        request_note: requestNote,
                                        total_price: totalPrice,
                                        status: '입금대기',
                                        order_number: orderNumber,
                                        items:
                                            Array.isArray(cartData) && cartData.length > 0
                                                ? cartData
                                                      .filter((item) => item.product_id)
                                                      .map((item) => ({
                                                          product_id: item.product_id,
                                                          quantity: item.quantity,
                                                          price_each: Number(item.price),
                                                      }))
                                                : [
                                                      {
                                                          product_id: Number(product_id),
                                                          quantity: Number(quantity),
                                                          price_each: Number(price),
                                                      },
                                                  ],
                                    }),
                                });

                                const data = await res.json();

                                if (res.ok) {
                                    // ✅ 문자 발송
                                    await fetch(`${EXPO_PUBLIC_SERVER_DOMAIN}/api/send-payment-alert`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            orderNumber,
                                            name,
                                            totalPrice,
                                            quantity,
                                            user_id: userId,
                                            orderId: data.order_id,
                                        }),
                                    });

                                    // ✅ 장바구니 비우기 + 모달 닫기 + 뒤로가기 허용
                                    await AsyncStorage.removeItem('cart');
                                    setModalVisible(false);
                                    setCanClose(true);
                                    // canSubmit은 false 유지 → 이 화면에서는 더 이상 중복 주문 불가

                                    // ✅ A 피드백 (최초 1회 + 4주 쿨타임)
                                    try {
                                        const firstKey = `fbA_first_${userId}`;
                                        const lastKey = `fbA_last_shown_${userId}`;
                                        const firstShown = await AsyncStorage.getItem(firstKey);
                                        const lastShown = Number(
                                            (await AsyncStorage.getItem(lastKey)) || '0',
                                        );
                                        const now = Date.now();
                                        const cooldownMs =
                                            FEEDBACK_A_COOLDOWN_DAYS *
                                            24 *
                                            60 *
                                            60 *
                                            1000;

                                        let shouldShow = false;

                                        if (!firstShown) {
                                            shouldShow = true;
                                        } else if (
                                            FEEDBACK_A_MODE === 'first_plus_cooldown'
                                        ) {
                                            if (now - lastShown >= cooldownMs) {
                                                shouldShow = true;
                                            }
                                        }

                                        if (shouldShow) {
                                            setLastOrderId(data.order_id);
                                            setShowFeedback(true);
                                            if (!firstShown) {
                                                await AsyncStorage.setItem(firstKey, '1');
                                            }
                                        }
                                    } catch (freqErr) {
                                        console.warn('피드백 빈도 로직 오류:', freqErr);
                                    }
                                } else {
                                    console.error('❌ 주문 저장 실패:', data.message);
                                    alert('주문 저장에 실패했습니다.');
                                    // ✅ 실패 시 다시 누를 수 있도록 복구
                                    setCanSubmit(true);
                                }
                            } catch (err) {
                                console.error('❌ 주문 요청 오류:', err);
                                alert('서버와 연결할 수 없습니다.');
                                // ✅ 네트워크 오류 시에도 재시도 가능하도록 복구
                                setCanSubmit(true);
                            }
                        }}
                    >
                        <Text style={styles.modalButtonText}>확인</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>

        {/* ✅ 결제 직후(구매과정) 피드백 모달 */}
        <FeedbackModal
            visible={showFeedback}
            title="결제까지 과정은 어떠셨나요?"
            description="상품 선택부터 결제 완료까지의 경험을 평가해 주세요."
            onClose={async () => {
            setShowFeedback(false);
            try {
                if (userId) {
                await AsyncStorage.setItem(`fbA_last_shown_${userId}`, String(Date.now()));
                }
            } catch (e) {
                console.warn('fbA_last_shown 저장 실패:', e);
            }
            }}
            onCancel={() => {
            // A는 별도 스누즈 없음
            }}
            onSubmit={async (rating, comment) => {
            try {
                const payload = {
                user_id: Number(userId) || 1,
                order_id: lastOrderId,
                type: '구매과정',
                rating,
                comment,
                };
                await axios.post(`${EXPO_PUBLIC_SERVER_DOMAIN}/api/feedback`, payload);
            } catch (e) {
                console.warn('피드백 저장 실패:', e?.response?.data || e.message);
            }
            }}
        />
        </View>
    );
};

export default PayPage;
