// Styles/RegisterStyle.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
    flex: 1,
    padding: 20,
    //paddingTop: 60,
    backgroundColor: '#fff',
    },
    title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    lineHeight: 34,
    }, //Register.js에서 사용
    inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    height: 50,
    },
    input: {
    flex: 1,
    fontSize: 16,
    },
    timer: {
    marginLeft: 10,
    color: '#666',
    },
    footerText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
    },
});
