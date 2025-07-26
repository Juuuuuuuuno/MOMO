// app/Components/Agreement/AgreementBox.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CheckBox from 'expo-checkbox';
import styles from '../../Styles/OrderPageStyle';

export default function AgreementBox({ agreed, onToggleCheck, onShowTerms }) {
    return (
        <View style={styles.agreementBox}>
            <Text style={styles.agreementText}>※ 결제는 계좌이체로 진행됩니다.</Text>
            <Text style={styles.agreementText}>입금 확인 후 상품을 정성껏 준비해 우체국 택배로 발송해 드리겠습니다.</Text>
            <Text style={styles.agreementText}>※ 입력하신 개인정보는 상품 배송 및 문의 응대 목적으로 사용되며, 제 3자에게 제공되지 않습니다.</Text>
            <Text style={styles.agreementText}>※ 상품에 문제가 있는 경우 판매자 혹은 관리자에게 연락 부탁드립니다.</Text>
            <Text style={styles.agreementText}>※ 주문 내용을 확인하였으며, 개인정보 제공 및 구매 조건에 동의 합니다.</Text>

            {/* ✅ 한 줄로 정렬된 약관 동의 */}
            <View style={styles.agreementRow}>
                <CheckBox value={agreed} onValueChange={onToggleCheck} style={styles.checkbox} />
                <Text style={styles.agreementTextInline}>
                    개인정보 수집 및 이용에 동의 합니다.
                    <Text style={styles.linkText} onPress={onShowTerms}> (내용 보기)</Text>
                </Text>
            </View>
        </View>
    );
}
