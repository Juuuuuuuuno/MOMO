// app/Styles/FeedbackModalStyle.js
// ✔️ FeedbackModal 전용 스타일 분리
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 20 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 18 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
    desc: { fontSize: 14, color: '#444', marginBottom: 12 },
    row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
    choice: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
    choiceActive: { borderColor: '#FF8A8A', backgroundColor: '#FFF2F2' },
    choiceText: { fontSize: 24 },
    input: { minHeight: 84, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, textAlignVertical: 'top', marginBottom: 12 },
    btnRow: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
    btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
    btnPrimary: { backgroundColor: '#FF8A8A' },
    btnGhost: { backgroundColor: '#eee' },
    btnDisabled: { backgroundColor: '#ccc' },
    btnText: { color: '#fff', fontWeight: 'bold' },
});
