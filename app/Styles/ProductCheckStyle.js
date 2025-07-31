// app/Styles/ProductCheckStyle.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        alignSelf: 'center',
    },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
    },
    date: {
        fontSize: 18,
        color: '#000',
        fontWeight:'bold'
    },
    orderNumber: {
        fontSize: 13,
        textAlign: 'right',
        color: '#555',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusIcon: {
        fontSize: 16,
        marginRight: 4,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2e7d32',
    },
    contentContainer: {
        flexDirection: 'row',
        marginTop: 8,
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        color: 'red',
        marginBottom: 2,
    },
    quantity: {
        fontSize: 13,
        color: '#666',
    },
    // ⬆️ 상단 헤더
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        //paddingHorizontal: 16,
        //paddingTop: 12,
        //paddingBottom: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        flex: 1,
        marginLeft: -24, // 중앙 정렬 보정 (BackButton 크기 고려)
    },
});

export default styles;
