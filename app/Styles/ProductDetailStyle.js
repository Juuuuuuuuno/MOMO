import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    iconGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 100,
    },
    image: {
        width: '100%',
        height: 240,
        resizeMode: 'cover',
        borderRadius: 12,
        marginBottom: 16,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    price: {
        fontSize: 16,
        color: '#FF0000',
        marginBottom: 8,
    },
    deliveryIncluded: {
        fontSize: 14,
        color: '#666',
    },
    descriptionBox: {
        marginTop: 16,
    },
    bullet: {
        fontSize: 14,
        marginBottom: 6,
        color: '#444',
    },
    fixedBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    //하단 스타일 시트
    priceBox: {
        paddingHorizontal: 16, // ← 좌우만 패딩 주기
        paddingTop: 0,          // ← 위 패딩 제거
        paddingBottom: 0,       // ← 아래 패딩 제거
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 1,
        gap: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 24,
        color: '#333',
        fontWeight:'bold',
    },
    //배송비
    labe2l: {
        fontSize: 10,
        color: '#333',
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold',
        color:'#FF0000'
    },
    quantityBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    quantityButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 4,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    quantityNumber: {
        fontSize: 16,
        marginHorizontal: 4,
    },
    total: {
        marginTop: 8,
        fontWeight: 'bold',
        color: '#d00',
        alignSelf:'flex-end'
    },
    //중량초과
    overweightWarning: {
        color: 'red',
        fontSize: 13,
        fontWeight: '600',
        marginTop: 8,
        marginRight: 0, // ✅ 오른쪽 여백 제거
        flexShrink: 1,
    },

});
