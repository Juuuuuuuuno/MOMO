import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function AgreementModal({ visible, onClose, onAgree }) {
    return (
        <Modal animationType="slide" transparent visible={visible}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
            <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
            <ScrollView>
                <Text style={styles.modalTitle}>■ 개인정보 수집 및 이용에 대한 안내</Text>
                <Text style={styles.modalParagraph}>1. 수집 항목</Text>
                <Text style={styles.modalParagraph}>- 성명, 연락처(휴대폰 번호), 배송지 주소</Text>

                <Text style={styles.modalParagraph}>2. 수집 목적</Text>
                <Text style={styles.modalParagraph}>- 상품 주문 확인, 배송지 확인, 배송 안내 및 고객 응대</Text>

                <Text style={styles.modalParagraph}>3. 보유 및 이용 기간</Text>
                <Text style={styles.modalParagraph}>- 수집일로부터 1년간 보관하며, 이후 즉시 파기됩니다.</Text>

                <Text style={styles.modalParagraph}>4. 동의 거부 시 안내</Text>
                <Text style={[styles.modalParagraph, styles.modalHighlight]}>
                - 개인정보 수집·이용에 동의하지 않으실 경우, 상품 주문 및 배송이 불가능합니다.
                </Text>

                <TouchableOpacity onPress={onAgree} style={{ marginTop: 20 }}>
                <Text style={styles.agreeButton}>동의합니다</Text>
                </TouchableOpacity>
            </ScrollView>
            </TouchableOpacity>
        </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalParagraph: {
        fontSize: 14,
        marginBottom: 8,
        lineHeight: 20,
    },
    modalHighlight: {
        color: 'red',
        fontWeight: 'bold',
    },
    agreeButton: {
        backgroundColor: '#FF8A8A',
        color: 'white',
        textAlign: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        fontWeight: 'bold',
    },
});
