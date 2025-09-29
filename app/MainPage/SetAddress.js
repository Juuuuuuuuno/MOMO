// app/MainPage/SetAddress.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import CheckBox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import BackButton from '../Components/Button/BackButton';
import { useLocalSearchParams } from 'expo-router';
import styles from '../Styles/SetAddressStyle';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ 추가

export default function SetAddress() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [saveAddress, setSaveAddress] = useState(false);

    const { name: productname, price, image_url, quantity, deliveryFee, product_id, cart } = useLocalSearchParams();

    // ✅ 저장된 주소 불러오기
    useEffect(() => {
        const loadSavedAddress = async () => {
            const saved = await AsyncStorage.getItem('savedAddress');
            if (saved) {
                const { name, address, phone } = JSON.parse(saved);
                setName(name);
                setAddress(address);
                setPhone(phone);
                setSaveAddress(true);
            }
        };
        loadSavedAddress();
    }, []);

    const handleSubmit = async () => {
        if (!name || !address || !phone) {
            Alert.alert('모든 항목을 입력해주세요.');
            return;
        }

        console.log('[주소 등록] 이름 : ', name, '/ 주소 : ', address, '/ 번호 : ', phone);
        console.log('✅ 주소 등록 완료');

        // ✅ 체크박스가 true라면 AsyncStorage에 저장
        if (saveAddress) {
            await AsyncStorage.setItem('savedAddress', JSON.stringify({ name, address, phone }));
            console.log('💾 주소 저장 완료');
        }

        router.replace({
            pathname: 'MainPage/OrderPage',
            params: {
                product_id,
                name: productname,
                price,
                image_url,
                quantity,
                deliveryFee,
                recipient: name,
                address,
                phone,
                cart: cart || '',
            },
        });
    };

    return (
        <View style={styles.container}>
            {/* 상단 헤더 */}
            <View style={styles.headerRow}>
                <BackButton onPress={() => router.back()} />
                <Text style={styles.headerTitle}>배송지 추가</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* 배송지 입력칸 */}
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholder="🙋 받는 사람"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="📍 상세 주소"
                    value={address}
                    onChangeText={setAddress}
                />
                <TextInput
                    style={styles.input}
                    placeholder="📞 휴대폰 번호"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
            </View>

            {/* 체크박스 */}
            <View style={styles.checkboxRow}>
                <CheckBox value={saveAddress} onValueChange={setSaveAddress} />
                <Text style={styles.checkboxLabel}>다음에도 같은 주소 사용하기</Text>
            </View>

            {/* 등록하기 버튼 */}
            <TouchableOpacity
                style={[
                    styles.submitBtn,
                    !(name && address && phone) && { backgroundColor: '#ccc' },
                ]}
                onPress={handleSubmit}
                disabled={!(name && address && phone)}
            >
                <Text style={styles.submitBtnText}>등록하기</Text>
            </TouchableOpacity>
        </View>
    );
}
