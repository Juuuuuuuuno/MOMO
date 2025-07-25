import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    iconGroup: {
        flexDirection: 'row',
        gap: 16,
        alignItems:'center',
        justifyContent:'center'
    },
    listContent: {
        paddingHorizontal: 16,
    },
    productCard: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderColor: '#eee',
        paddingBottom: 12,
    },
    productImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    productName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
    },
    productPrice: {
        fontSize: 20,
        color: '#FF0000',
        marginTop: 4,
    },
        headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        alignItems:'center',
        justifyContent:'center'
        },
});
