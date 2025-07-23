// app/Styles/IntroStyle.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    },
    emoji: {
    fontSize: 100, // 🍑 크게 표시
    marginBottom: 20,
    },
    title: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#FF8A8A',
    },
    subtitle: {
    fontSize: 15,
    color: '#FF8A8A',
    marginBottom: 150,
    },
    signupText: {
    color: '#888',
    marginTop: 20,
    textDecorationLine: 'underline',
    fontSize: 15,
    },// Intro.js에 사용
    subtitle2: {
    fontSize: 15,
    color: '#FF8A8A',
    marginBottom: 30,
    },// Login.js의 서브 타이틀
    signupButton: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FF8A8A',
        alignItems: 'center',
        marginTop: 10,
    },
    signupTextStrong: {
        color: '#FF8A8A',
        fontSize: 16,
        fontWeight: 'bold',
    }, //Login.js의 회원가입 버튼
});
