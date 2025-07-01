// app/Styles/MainPageStyle.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12,  // ✅ 하단 왼쪽도 둥글게
        borderBottomRightRadius: 12, // ✅ 하단 오른쪽도 둥글게
    },
    infoContainer: {
        padding: 15,
    },
    title: {
        fontSize: 45, // ✅ 크게 변경
        fontWeight: 'bold',
        marginBottom: 4,
    },
    metaWrapper: {
        flexDirection: 'column', // ✅ 두 줄로 배치
        marginBottom: 5,
    },
    owner: {
        fontSize: 20,
        color: '#000',
        marginBottom:5,
        fontWeight: 'bold',
    },
    location: {
        fontSize: 14,
        color: '#666',
    },
    description: {
        fontSize: 18,
        marginTop: 8,
        marginBottom: 12,
        fontWeight: 'bold',
    },
    detailBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
    },
    detail: {
        fontSize: 14,
        marginBottom: 10,
    },
    notice: {
        fontSize: 12,
        color: '#999',
        marginTop: 0,
    },
    titleRow: {
    flexDirection: 'row',              // 가로 배치
    justifyContent: 'space-between',  // 좌측 제목 / 우측 정보
    alignItems: 'flex-start',         // 상단 정렬
    flexWrap: 'wrap',                 // 줄바꿈 허용
    marginBottom: 8,
    },
    farmerMeta: {
    flexDirection: 'column',   // 위아래 두 줄
    alignItems: 'flex-start',    // 좌측 정렬
    maxWidth: '70%',           // 너무 길어지지 않게 제한
    },
});
