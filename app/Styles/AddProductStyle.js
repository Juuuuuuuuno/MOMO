import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        marginTop:10,
    },
    imageBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    cameraIcon: {
        width: 40,
        height: 40,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    imageText: {
        fontSize: 14,
        color: '#666',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    exampleText: {
    fontSize: 12,
    color: '#888',
    },
    selectedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'cover',
    },
    headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    },
    leftBox: {
    width: 40, // BackButton 너비에 맞게
    alignItems: 'flex-start',
    },
    centerBox: {
    flex: 1,
    alignItems: 'center',
    },
    rightBox: {
    width: 40, // 왼쪽 BackButton과 균형 맞추기 위한 공간
    },
});

export default styles;
