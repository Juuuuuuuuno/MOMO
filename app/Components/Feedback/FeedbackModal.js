// app/Components/Feedback/FeedbackModal.js

import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import styles from './FeedbackModalStyle';

export default function FeedbackModal({
    visible,
    title = '피드백을 남겨주세요',
    description = '간단한 의견도 큰 도움이 됩니다.',
    onSubmit,   // (rating, comment) => Promise<void> | void
    onClose,    // 모달 닫기 공용
    onCancel,   // ✨ 추가: "제출 없이 닫기" 전용 콜백 (스누즈 등)
    }) {
    const [rating, setRating] = useState(null);  // 'b' | 'q'
    const [comment, setComment] = useState('');  // 선택 입력

    // 👍 / 👎 선택 처리
    const handleSelect = (val) => setRating(val);

    // 제출 처리
    const handleSubmit = async () => {
        if (!rating) return; // 선택 필수
        await onSubmit?.(rating, comment.trim());
        setRating(null);
        setComment('');
        onClose?.(); // 제출 후 닫기
    };

    // 닫기(제출 없이)
    const handleClose = () => {
        onCancel?.(); // 부모에게 "제출 없이 닫힘" 알림 (스누즈 등)
        onClose?.();  // 모달 닫기
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.backdrop}>
            <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.desc}>{description}</Text>

            {/* 👍 / 👎 선택 */}
            <View style={styles.row}>
                <TouchableOpacity
                style={[styles.choice, rating === 'b' && styles.choiceActive]}
                onPress={() => handleSelect('b')}
                >
                <Text style={styles.choiceText}>👍</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.choice, rating === 'q' && styles.choiceActive]}
                onPress={() => handleSelect('q')}
                >
                <Text style={styles.choiceText}>👎</Text>
                </TouchableOpacity>
            </View>

            {/* 텍스트 입력(선택) */}
            <TextInput
                style={styles.input}
                placeholder="간단한 의견을 적어주세요 (선택)"
                value={comment}
                onChangeText={setComment}
                multiline
            />

            {/* 하단 버튼 */}
            <View style={styles.btnRow}>
                <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={handleClose}>
                <Text style={[styles.btnText, { color: '#666' }]}>닫기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.btn, !rating ? styles.btnDisabled : styles.btnPrimary]}
                onPress={handleSubmit}
                disabled={!rating}
                >
                <Text style={styles.btnText}>제출</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
        </Modal>
    );
}
