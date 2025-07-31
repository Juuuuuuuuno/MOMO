// app/Styles/ShoppingCartStyle.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
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
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyImage: {
        width: 180,
        height: 180,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    emptyText: {
        fontSize: 20,
        color: '#000',
        marginBottom: 20,
        fontWeight:'bold',
        justifyContent:'center'
    },
        emptyText1: {
        fontSize: 20,
        color: '#000',
        //marginBottom: 20,
        fontWeight:'bold',
        justifyContent:'center'
    },
    emptyText2: {
        fontSize: 16,
        color: '#555',
        fontWeight:'bold'
    },
    scrollView: {
        paddingBottom: 180,
        paddingHorizontal: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#000',
    },
    productBox: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
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
        marginTop: 8,
    },
    productName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    productPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
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
    totalText: {
        fontSize: 14,
        color: '#000',
        marginBottom: 4,
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF0000',
        marginBottom: 12,
    },
    //하단 금액
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

    priceBox: {
        paddingHorizontal: 16,
        paddingBottom: 0,
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
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },

    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },

    total: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF0000',
        alignSelf: 'flex-end',
    },
    //전체 삭제
    clearText: {
        color: '#FF5555',
        fontWeight: 'bold',
        fontSize: 14,
    }, 

});
