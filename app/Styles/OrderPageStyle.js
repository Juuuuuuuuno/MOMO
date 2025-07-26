// app/Styles/OrderPageStyle.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    // ⬆️ 상단 헤더
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        flex: 1,
        marginLeft: -24, // 중앙 정렬 보정 (BackButton 크기 고려)
    },

    scrollView: {
        paddingBottom: 120,
        paddingHorizontal: 16,
    },

    // 📦 섹션 공통
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#000',
    },

    // 🏠 배송지
    addressBox: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 12,
        padding: 16,
        backgroundColor: '#fff',
    },
    addressText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 12,
        fontWeight:'bold'
    },
    registerBtn: {
        borderWidth: 1.5,
        borderColor: '#FF8A8A',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: 'center',
    },
    registerText: {
        color: '#FF8A8A',
        fontWeight: 'bold',
        fontSize: 16,
    },

    // 🛒 주문 상품
    productBox: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        gap: 12,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    productInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    productInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    productName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        alignSelf:'flex-end'
    },
    productPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    productDetail: {
        fontSize: 13,
        color: '#333',
        marginTop: 2,
        textAlign: 'right',
    },
    shippingNote: {
        marginTop: 8,
        fontSize: 14,
        color: '#333',
        textAlign: 'left',
        marginBottom: 4,
    },

    // 💰 총 금액 박스
    totalBox: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF0000',
    },

    // 📝 약관 박스
    agreementBox: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
    },
    agreementRow: {
        flexDirection: 'row',         // 가로 정렬
        alignItems: 'center',         // 수직 가운데 정렬
        marginTop: 8,
        flexWrap: 'nowrap',           // 한 줄로 고정
    },

    checkbox: {
        marginRight: 8,
    },

    agreementTextInline: {
        fontSize: 14,
        color: '#000',
    },

    linkText: {
        fontSize: 14,
        color: '#FF8A8A',
    },


    // ⬇️ 하단 고정 버튼 영역
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },

    // 배송지 변경 버튼을 위한 스타일 추가
    editAddressBtn: {
        borderWidth: 1.5,
        borderColor: '#FF8A8A',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginLeft: 8,
        justifyContent: 'center',
        height: 26,
    },
    editAddressText: {
        color: '#FF8A8A',
        fontWeight: 'bold',
        fontSize: 13,
    },
    addressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // 🔄 버튼을 오른쪽 끝으로 밀기 위해 추가
        alignItems: 'flex-start',        // 🔄 텍스트 기준으로 정렬 제거
        marginBottom: 4,
    }
});
