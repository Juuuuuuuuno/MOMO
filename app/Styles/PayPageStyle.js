import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    orderNumber: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    infoText: {
        color: '#888',
        marginBottom: 16,
    },
    box: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 12,
    },
    account: {
        fontSize: 16,
        marginTop: 4,
    },
    accountHint: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    value: {
        fontSize: 16,
        marginTop: 4,
        color:'#FF0000',
        fontWeight: 'bold',
    },
    footerHint: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
    //모달
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalContent: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#FF8A8A',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },

});

export default styles;
