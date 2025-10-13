// app/MainPage/ProductCheck.js
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, SectionList, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../Styles/ProductCheckStyle';
import BackButton from '../Components/Button/BackButton';
import IconButton from '../Components/Button/IconButton';
import { SERVER_DOMAIN } from '@env';

// ✅ 피드백 모달 & axios
import FeedbackModal from '../Components/Feedback/FeedbackModal';
import axios from 'axios';

const statusIcons = {
    '입금대기': '💰',
    '배송중': '🚚',
    '배송완료': '📦',
    };

    const ProductCheck = () => {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [userId, setUserId] = useState(null);

    // ✅ 배송완료 피드백 모달 상태
    const [showDeliveryFeedback, setShowDeliveryFeedback] = useState(false);
    const [deliveredOrderId, setDeliveredOrderId] = useState(null);

    useEffect(() => {
        const fetchUserIdAndOrders = async () => {
        const storedId = await AsyncStorage.getItem('user_id');
        if (storedId) {
            setUserId(Number(storedId));
            try {
            const res = await fetch(`${SERVER_DOMAIN}/api/user-orders/${storedId}`);
            const data = await res.json();
            if (res.ok) {
                setOrders(data);

                /**
                 * ✅ 변경 요지 (중요)
                 * - 동일 주문(order_id)에 여러 아이템(row)이 있어도 피드백은 "주문별 1회"만 노출해야 함.
                 * - 따라서 row(아이템) 단위가 아닌 order_id 단위로 고유화하여 후보를 만든 뒤,
                 *   "아직 피드백 안 한 주문"을 최신(created_at) 순으로 1건만 선택해서 모달을 띄움.
                 */

                // 1) 배송완료인 row만 모아 order_id별 "가장 최신 created_at"을 기록
                const latestByOrder = {}; // { [order_id]: { created_at, ...row } }
                for (const it of (Array.isArray(data) ? data : [])) {
                if (it.status !== '배송완료') continue;
                const k = it.order_id;
                // created_at 최신값으로 갱신
                if (!latestByOrder[k] || (it.created_at || '') > (latestByOrder[k].created_at || '')) {
                    latestByOrder[k] = it;
                }
                }

                // 2) order_id 목록을 최신 created_at 기준 내림차순 정렬
                const orderedIds = Object.keys(latestByOrder)
                .map(id => Number(id))
                .sort((a, b) =>
                    (latestByOrder[b]?.created_at || '').localeCompare(latestByOrder[a]?.created_at || '')
                );

                // 3) 아직 피드백 안 한 주문(order_id) 1건만 선택 → 모달 표시
                for (const oid of orderedIds) {
                const guardKey = `feedback_delivery_${oid}`;
                // 이미 처리(닫기/제출)했던 주문은 스킵
                const done = await AsyncStorage.getItem(guardKey);
                if (!done) {
                    setDeliveredOrderId(oid);
                    setShowDeliveryFeedback(true);
                    break;
                }
                }
            } else {
                console.error('❌ 주문 목록 조회 실패:', data.message);
            }
            } catch (err) {
            console.error('❌ 서버 요청 실패:', err);
            }
        }
        };

        fetchUserIdAndOrders();
    }, []);

    // ✅ 날짜와 주문번호 기준으로 그룹화 (기존 유지)
    const groupedData = useMemo(() => {
        const grouped = {};
        orders.forEach((item) => {
        const date = item.created_at?.slice(0, 10);
        const orderNumber = item.order_number;
        if (!grouped[date]) grouped[date] = {};
        if (!grouped[date][orderNumber]) grouped[date][orderNumber] = [];
        grouped[date][orderNumber].push(item);
        });
        return Object.entries(grouped).map(([date, ordersByNumber]) => ({
        title: date,
        data: Object.entries(ordersByNumber).map(([orderNumber, items]) => ({
            orderNumber,
            date,
            items,
        })),
        }));
    }, [orders]);

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
            <BackButton onPress={() => router.back()} />
            <Text style={styles.headerTitle}>주문 목록</Text>
            <View style={{ width: 24 }} />
        </View>

        {groupedData.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#888' }}>주문한 상품이 없습니다. 지금 바로 구매해보세요!</Text>
            </View>
        ) : (
            <SectionList
            sections={groupedData}
            keyExtractor={(item, index) => item.orderNumber + index}
            stickySectionHeadersEnabled={false}
            renderSectionHeader={({ section: { title } }) => (
                <View style={styles.sectionCard}>
                <Text style={styles.date}>{title} 주문</Text>
                </View>
            )}
            renderItem={({ item }) => (
                <View style={styles.cardGroup}>
                <Text style={styles.orderNumber}>주문번호 : {item.orderNumber}</Text>
                {item.items.map((product) => {
                    const deliveryFee = product.quantity > 1 ? 6000 : 5000;
                    const totalPrice = Number(product.price_each) * product.quantity + deliveryFee;

                    return (
                    <View key={product.order_item_id} style={styles.card}>
                        <View style={styles.contentContainer}>
                        <Image
                            source={{ uri: `${SERVER_DOMAIN}${product.image_url}` }}
                            style={styles.image}
                        />
                        <View style={styles.info}>
                            <View style={styles.statusContainer}>
                            <Text style={styles.statusIcon}>{statusIcons[product.status] || ''}</Text>
                            <Text style={styles.statusText}>{product.status}</Text>
                            </View>
                            <Text style={styles.name}>{product.product_name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.price}>
                                {(product.price_each * product.quantity).toLocaleString()}원
                                <Text style={{ fontSize: 13, color: '#888' }}>
                                {' '}+ 배송비 {deliveryFee.toLocaleString()}원
                                </Text>
                            </Text>
                            <Text style={styles.quantity}>  {product.quantity}개</Text>
                            </View>
                        </View>
                        </View>
                    </View>
                    );
                })}
                </View>
            )}
            />
        )}

        {/* ✅ 배송완료(앱/배송 관련) 피드백 모달 — “주문별 1회”만 노출 */}
        <FeedbackModal
            visible={showDeliveryFeedback}
            title="상품/앱 사용은 어떠셨나요?"
            description="배송 및 상품 품질, 앱 사용성에 대해 평가해 주세요."
            onClose={async () => {
            setShowDeliveryFeedback(false);
            // ✅ 닫기만 해도 해당 주문은 다시 안 뜨도록 플래그 저장
            // (같은 주문에서 반복 노출 방지. “매번” = 매 ‘배송완료 주문’마다 1회)
            try {
                if (deliveredOrderId) {
                await AsyncStorage.setItem(`feedback_delivery_${deliveredOrderId}`, '1');
                }
            } catch (e) {
                console.warn('feedback_delivery flag 저장 실패(onClose):', e);
            }
            }}
            onCancel={async () => {
            // ※ onClose에서 이미 처리하므로 별도 로직 불필요
            }}
            onSubmit={async (rating, comment) => {
            try {
                const payload = {
                user_id: Number(userId) || 1, // 로그인 연동 전 임시
                order_id: deliveredOrderId,
                type: '배송완료',
                rating,        // 'b' | 'q'
                comment,
                };
                await axios.post(`${SERVER_DOMAIN}/api/feedback`, payload);
                // ✅ 제출 성공 시에도 해당 주문은 재노출 금지
                await AsyncStorage.setItem(`feedback_delivery_${deliveredOrderId}`, '1');
            } catch (e) {
                console.warn('배송완료 피드백 저장 실패:', e?.response?.data || e.message);
            } finally {
                setShowDeliveryFeedback(false);
            }
            }}
        />
        </SafeAreaView>
    );
};

export default ProductCheck;
