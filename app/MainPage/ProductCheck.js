// app/MainPage/ProductCheck.js
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, SectionList, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../Styles/ProductCheckStyle';
import BackButton from '../Components/Button/BackButton';
import IconButton from '../Components/Button/IconButton';
import { SERVER_DOMAIN } from '@env';

// ✅ 추가: 피드백 모달 & axios
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

    // ✅ 추가: 배송완료 피드백 모달 상태
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

                // ✅ 추가: 배송완료 주문이 있는지 확인하고, 최초 1회만 모달 표시
                // data 형태: 서버가 반환하는 배열(주문+아이템 join). 최신 배송완료 주문 1건을 추출
                const delivered = Array.isArray(data)
                ? data
                    .filter(it => it.status === '배송완료')
                    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))[0]
                : null;

                if (delivered && delivered.order_id) {
                const guardKey = `feedback_delivery_${delivered.order_id}`;
                const done = await AsyncStorage.getItem(guardKey);
                if (!done) {
                    setDeliveredOrderId(delivered.order_id);
                    setShowDeliveryFeedback(true);
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
            stickySectionHeadersEnabled={false} // ✅ 고정 해제하여 스크롤 시 따라오도록 변경
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

        {/* ✅ 추가: 배송완료(앱/배송 관련) 피드백 모달 — 최초 1회만 */}
        <FeedbackModal
            visible={showDeliveryFeedback}
            title="상품/앱 사용은 어떠셨나요?"
            description="배송 및 상품 품질, 앱 사용성에 대해 평가해 주세요."
            onClose={() => setShowDeliveryFeedback(false)}
            onSubmit={async (rating, comment) => {
            try {
                const payload = {
                user_id: Number(userId) || 1,     // 로그인 연동 전 임시
                order_id: deliveredOrderId,       // 배송완료 주문 ID
                type: '배송완료',                  // 트리거 2 고정
                rating,                           // 'b' | 'q'
                comment,
                };
                await axios.post(`${SERVER_DOMAIN}/api/feedback`, payload);
                // ▶︎ 중복 방지 플래그 저장
                await AsyncStorage.setItem(`feedback_delivery_${deliveredOrderId}`, '1');
            } catch (e) {
                console.warn('배송완료 피드백 저장 실패:', e?.response?.data || e.message);
            }
            }}
        />
        </SafeAreaView>
    );
};

export default ProductCheck;
