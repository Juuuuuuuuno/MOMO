// app/admin/SetStatus.js

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Pressable,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import styles from '../Styles/SetStatusStyle';
import BackButton from '../Components/Button/BackButton';

export default function SetStatus() {
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('입금대기');
    const [orders, setOrders] = useState({});
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const sortedDates = Object.keys(orders).sort((a, b) => b.localeCompare(a));

    useEffect(() => {
        axios.get(`http://192.168.35.144:3001/api/order-status?status=${selectedFilter}`)
            .then(res => setOrders(res.data))
            .catch(err => console.error('주문 불러오기 실패:', err));
    }, [selectedFilter]);

    const toggleExpand = (orderId) => {
        setExpandedOrder(prev => (prev === orderId ? null : orderId));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <BackButton onPress={() => {}} />
                <Text style={styles.title}>상태관리</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.statusFilterRow}>
                {['입금대기', '배송중', '배송완료'].map((label) => (
                    <TouchableOpacity
                        key={label}
                        onPress={() => setSelectedFilter(label)}
                        style={[
                            styles.statusFilterButton,
                            selectedFilter === label && styles.statusFilterButtonActive,
                        ]}
                    >
                        <Text
                            style={[
                                styles.statusFilterText,
                                selectedFilter === label && styles.statusFilterTextActive,
                            ]}
                        >
                            {label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {sortedDates.map(date => (
                    <View key={date} style={styles.dateSection}>
                        <Text style={styles.dateText}>{date}</Text>
                        {Object.entries(orders[date]).map(([order_number, details]) => (
                            <View key={order_number}>
                                <TouchableOpacity
                                    style={styles.orderRow}
                                    onPress={() => toggleExpand(order_number)}
                                >
                                    <Text style={styles.cell}>{order_number}</Text>
                                    <Text style={styles.cell}>{details.user_name}</Text>
                                    <Text style={styles.cell}>
                                        {details.items.map(p => p.product_name).join(', ')}
                                    </Text>
                                    <Text style={styles.cell}>
                                        {details.items.map(p => p.price_each.toLocaleString()).join(', ')}
                                    </Text>
                                    <Text style={styles.cell}>
                                        {details.items.map(p => p.quantity).join(', ')}
                                    </Text>
                                    <Text style={styles.cell}>{details.status}</Text>
                                </TouchableOpacity>

                                {expandedOrder === order_number && (
                                    <View style={styles.expandedBox}>
                                        {details.items.map((product, idx) => (
                                            <View key={idx}>
                                                <Text style={styles.expandedText}>상품명: {product.product_name}</Text>
                                                <Text style={styles.expandedText}>
                                                    가격: {product.price_each.toLocaleString()}원 × {product.quantity}개
                                                </Text>
                                            </View>
                                        ))}

                                        <Text style={styles.expandedText}>주문자: {details.user_name}</Text>

                                        {/* ✅ 총 금액 및 배송비 표시 */}
                                        <Text style={styles.expandedText}>
                                            총 금액: {details.total_price.toLocaleString()}원
                                        </Text>
                                        <Text style={styles.expandedText}>
                                            배송비: {(
                                                details.total_price -
                                                details.items.reduce((sum, p) => sum + p.price_each * p.quantity, 0)
                                            ).toLocaleString()}원
                                        </Text>

                                        <View style={styles.statusButtonRow}>
                                            {['입금대기','배송중', '배송완료'].map((status) => (
                                                <Pressable
                                                    key={status}
                                                    style={styles.statusButton}
                                                    onPress={() => {
                                                        setSelectedStatus(status);
                                                        setSelectedOrderId(order_number);
                                                        setConfirmModalVisible(true);
                                                    }}
                                                >
                                                    <Text style={styles.statusButtonText}>{status}</Text>
                                                </Pressable>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>

            <Modal
                transparent
                visible={confirmModalVisible}
                animationType="fade"
                onRequestClose={() => setConfirmModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>정말 상태를 변경하시겠습니까?</Text>
                        <Text style={styles.modalContent}>한 번 변경하면 되돌릴 수 없습니다.</Text>
                        <View style={styles.modalButtonRow}>
                            <Pressable
                                style={styles.modalConfirmButton}
                                onPress={() => {
                                    setConfirmModalVisible(false);

                                    // ✅ 상태 변경 API 호출
                                    axios.post('http://192.168.35.144:3001/api/update-order-status', {
                                        order_number: selectedOrderId,
                                        new_status: selectedStatus,
                                    })
                                    .then(() => {
                                        // ✅ 상태 변경 후, 다시 주문 목록 새로고침
                                        axios.get(`http://192.168.35.144:3001/api/order-status?status=${selectedFilter}`)
                                            .then(res => setOrders(res.data))
                                            .catch(err => console.error('주문 다시 불러오기 실패:', err));
                                    })
                                    .catch(err => {
                                        console.error('상태 변경 실패:', err);
                                    });
                                }}
                            >
                                <Text style={styles.modalButtonText}>변경하기</Text>
                            </Pressable>
                            <Pressable
                                style={styles.modalCancelButton}
                                onPress={() => setConfirmModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>닫기</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
