import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    statusFilterRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
    },
    statusFilterButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: '#eaeaea',
    },
    statusFilterText: {
        fontSize: 13,
        color: '#333',
    },
    dateSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    dateText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#444',
    },
    orderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        paddingVertical: 10,
        paddingHorizontal: 8,
        marginBottom: 6,
        borderRadius: 8,
    },
    cell: {
        flex: 1,
        fontSize: 12,
        textAlign: 'center',
        color: '#222',
    },
    expandedBox: {
        backgroundColor: '#fff',
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    expandedText: {
        fontSize: 13,
        marginBottom: 4,
        color: '#333',
    },
    statusButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    statusButton: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 8,
        backgroundColor: '#fff0f0',
        borderColor: '#ff4d4f',
        borderWidth: 1,
        borderRadius: 6,
        alignItems: 'center',
    },
    statusButtonText: {
        fontSize: 13,
        color: '#ff4d4f',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#222',
    },
    modalContent: {
        fontSize: 13,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtonRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    modalConfirmButton: {
        flex: 1,
        backgroundColor: '#ff4d4f',
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
        marginRight: 5,
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: '#e0e0e0',
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
        marginLeft: 5,
    },
    modalButtonText: {
        fontSize: 14,
        color: '#fff',
    },
});

export default styles;
