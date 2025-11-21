// app/admin/FeedbackList.js
import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import axios from 'axios';
import styles from '../Styles/SetStatusStyle'; // ✅ 상태관리와 동일 스타일 사용
import BackButton from '../Components/Button/BackButton';
import { useRouter } from 'expo-router';
import { SERVER_DOMAIN } from '@env';

export default function FeedbackList() {
    const router = useRouter();

    // ✅ 서버에서 가져온 원본 피드백 데이터
    const [feedbacks, setFeedbacks] = useState([]);

    // ✅ 선택된 타입 필터: '전체' | '구매과정' | '배송완료'
    const [selectedType, setSelectedType] = useState('전체');

    // ✅ 피드백 타입 필터 목록
    const typeFilters = ['전체', '구매과정', '배송완료'];

    // ✅ 피드백 목록 불러오기
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                // ⚠️ 서버에서 이 URL을 구현해야 함: /api/admin/feedback
                const res = await axios.get(
                    `${SERVER_DOMAIN}/api/admin/feedback`,
                );

                // 예상 형태:
                // [
                //   {
                //     id,
                //     created_at,
                //     user_name,
                //     order_number,
                //     type,         // '구매과정' | '배송완료'
                //     rating,       // 'b' | 'q'
                //     comment,
                //   },
                //   ...
                // ]
                setFeedbacks(res.data || []);
            } catch (err) {
                console.error('❌ 피드백 목록 불러오기 실패:', err);
            }
        };

        fetchFeedbacks();
    }, []);

    // ✅ 타입 필터 적용된 데이터
    const filtered = useMemo(() => {
        if (selectedType === '전체') {
            return feedbacks;
        }
        return feedbacks.filter((fb) => fb.type === selectedType);
    }, [feedbacks, selectedType]);

    // ✅ 날짜별 그룹핑 (YYYY-MM-DD 기준)
    const groupedByDate = useMemo(() => {
        const grouped = {};

        filtered.forEach((fb) => {
            const date = fb.created_at?.slice(0, 10) || '날짜 없음';

            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(fb);
        });

        // 날짜 역순 정렬 (최근 날짜 먼저)
        const sorted = {};
        Object.keys(grouped)
            .sort((a, b) => b.localeCompare(a))
            .forEach((d) => {
                // 같은 날짜 안에서는 created_at 기준 역순
                sorted[d] = grouped[d].sort((a, b) =>
                    (b.created_at || '').localeCompare(a.created_at || ''),
                );
            });

        return sorted;
    }, [filtered]);

    return (
        <SafeAreaView style={styles.container}>
            {/* 상단 헤더 (상품 관리 헤더와 동일 레이아웃) */}
            <View style={styles.header}>
                {/* 왼쪽: 뒤로가기 버튼 고정 폭 */}
                <View style={{ width: 70 }}>
                    <BackButton onPress={() => router.back()} />
                </View>

                {/* 가운데: 제목 중앙 정렬 */}
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.headerTitle}>피드백 리스트</Text>
                </View>

                {/* 오른쪽: 현재는 아이콘 없음, 균형용 빈 영역 */}
                <View style={{ width: 70 }} />
            </View>

            {/* 타입 필터 버튼 (SetStatus 스타일 재사용) */}
            <View style={styles.statusFilterRow}>
                {typeFilters.map((label) => (
                    <TouchableOpacity
                        key={label}
                        style={[
                            styles.statusFilterButton,
                            selectedType === label &&
                                styles.statusFilterButtonActive,
                        ]}
                        onPress={() => setSelectedType(label)}
                    >
                        <Text
                            style={[
                                styles.statusFilterText,
                                selectedType === label &&
                                    styles.statusFilterTextActive,
                            ]}
                        >
                            {label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 날짜별 피드백 목록 */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {Object.keys(groupedByDate).length === 0 ? (
                    <View
                        style={{
                            padding: 20,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: '#888' }}>
                            아직 등록된 피드백이 없습니다.
                        </Text>
                    </View>
                ) : (
                    Object.entries(groupedByDate).map(([date, list]) => (
                        <View key={date} style={styles.dateSection}>
                            {/* 날짜 제목 */}
                            <Text style={styles.dateText}>{date}</Text>

                            {/* 헤더 행 (주문번호 / 이름 / 타입 / 평가) */}
                            <View style={styles.orderRow}>
                                <Text style={styles.cell}>주문번호</Text>
                                <Text style={styles.cell}>이름</Text>
                                <Text style={styles.cell}>구분</Text>
                                <Text style={styles.cell}>평가</Text>
                            </View>

                            {/* 실제 피드백 행 */}
                            {list.map((fb) => (
                                <View
                                    key={fb.id || fb.feedback_id}
                                    style={styles.orderRow}
                                >
                                    <Text style={styles.cell}>
                                        {fb.order_number || fb.order_id}
                                    </Text>
                                    <Text style={styles.cell}>
                                        {fb.user_name || '-'}
                                    </Text>
                                    <Text style={styles.cell}>{fb.type}</Text>
                                    <Text style={styles.cell}>
                                        {fb.rating === 'b'
                                            ? '좋아요'
                                            : fb.rating === 'q'
                                            ? '별로예요'
                                            : fb.rating}
                                    </Text>
                                </View>
                            ))}

                            {/* 코멘트는 한 줄로 보여주고 싶으면 아래처럼 추가해도 됨
                                (추가 스타일이 필요하면 SetStatusStyle에 text 스타일 하나만 더 선언) */}
                            {list.map((fb) =>
                                fb.comment ? (
                                    <View
                                        key={`c_${fb.id || fb.feedback_id}`}
                                        style={{
                                            paddingHorizontal: 12,
                                            paddingVertical: 4,
                                        }}
                                    >
                                        <Text style={{ fontSize: 13, color: '#555' }}>
                                            - {fb.comment}
                                        </Text>
                                    </View>
                                ) : null,
                            )}
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
