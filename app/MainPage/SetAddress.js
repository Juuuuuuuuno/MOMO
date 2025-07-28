// app/MainPage/SetAddress.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import CheckBox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import BackButton from '../Components/Button/BackButton';
import { useLocalSearchParams } from 'expo-router';
import styles from '../Styles/SetAddressStyle';

export default function SetAddress() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [saveAddress, setSaveAddress] = useState(false);

    const { name : productname, price, image_url, quantity, deliveryFee, product_id } = useLocalSearchParams();
    

    const handleSubmit = () => {
        if (!name || !address || !phone) {
            Alert.alert('모든 항목을 입력해주세요.');
            return;
        }

        console.log('[주소 등록] 이름 : ', name,'/ 주소 : ', address, '/ 번호 : ',phone);
        console.log('✅ 주소 등록 완료');

        // 이후 DB 저장 로직은 이곳에 추가 예정
        // 현재는 OrderPage로 전달
        router.replace({
        pathname: 'MainPage/OrderPage',
            params: {
                product_id,
                name : productname,
                price,
                image_url,
                quantity,
                deliveryFee,
                recipient: name,
                address,
                phone,
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
                <Text style={styles.checkboxLabel}>주소 저장하기</Text>
            </View>

            {/* 등록하기 버튼 */}
            <TouchableOpacity style={[styles.submitBtn, !(name && address && phone) && { backgroundColor : '#ccc'}, ]} onPress={handleSubmit} disabled={!(name && address && phone) }>
                <Text style={styles.submitBtnText}>등록하기</Text>
            </TouchableOpacity>
        </View>
    );
}
