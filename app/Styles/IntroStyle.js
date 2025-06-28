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
    color: '#FFB6B6',
    },
    subtitle: {
    fontSize: 15,
    color: '#FFB6B6',
    marginBottom: 150,
    },
    signupText: {
    color: '#888',
    marginTop: 20,
    textDecorationLine: 'underline',
    fontSize: 15,
    },
});
