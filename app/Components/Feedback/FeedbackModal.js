// app/Components/Feedback/FeedbackModal.js
// ✔️ 공용 피드백 모달 (rating: 'b' | 'q'로 저장, UI는 👍/👎 표시)
// ✔️ 스타일은 분리: app/Styles/FeedbackModalStyle.js
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import styles from './FeedbackModalStyle';

export default function FeedbackModal({
    visible,
    title = '피드백을 남겨주세요',
    description = '간단한 의견도 큰 도움이 됩니다.',
    onSubmit,   // (rating, comment) => Promise<void> | void
    onClose,    // 닫기 콜백
    }) {
    // ▶︎ 선택된 평가값: 'b'(👍) 또는 'q'(👎)
    const [rating, setRating] = useState(null);
    // ▶︎ 코멘트(선택 입력)
    const [comment, setComment] = useState('');

    const handleSelect = (val) => setRating(val);

    const handleSubmit = async () => {
        // ▶︎ 유효성: rating 필수
        if (!rating) return;
        await onSubmit?.(rating, comment.trim());
        // ▶︎ 제출 후 초기화
        setRating(null);
        setComment('');
        onClose?.();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.backdrop}>
            <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.desc}>{description}</Text>

            {/* ▶︎ 평가 선택 (DB: b/q, UI: 👍/👎) */}
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

            {/* ▶︎ 간단 의견 입력 (선택) */}
            <TextInput
                style={styles.input}
                placeholder="간단한 의견을 적어주세요 (선택)"
                value={comment}
                onChangeText={setComment}
                multiline
            />

            {/* ▶︎ 버튼 영역 */}
            <View style={styles.btnRow}>
                <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={onClose}>
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
