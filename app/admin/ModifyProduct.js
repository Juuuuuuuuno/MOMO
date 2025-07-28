//app/admin/ModifyProduct.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import InputField from '../Components/InputField/InputField';
import DoubleButtonRow from '../Components/Button/DoubleButtonRow';
import BackButton from '../Components/Button/BackButton';
import styles from '../Styles/AddProductStyle';

export default function ModifyProduct() {
    const router = useRouter();
    const { product_id, name, price, image_url } = useLocalSearchParams();

    const [productName, setProductName] = useState(name);
    const [productPrice, setProductPrice] = useState(price);
    const [image, setImage] = useState(`http://192.168.35.144:3001${image_url}`);
    const [base64Image, setBase64Image] = useState(null);

    const isFormValid = productName && productPrice;

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('이미지 접근 권한이 필요합니다.');
            }
        })();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setBase64Image(result.assets[0].base64);
        }
    };

    const handleUpdate = async () => {
        const payload = {
            product_id,
            name: productName,
            price: parseInt(productPrice),
            base64: base64Image,
        };

        try {
            const res = await fetch(`http://192.168.35.144:3001/api/update-product`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                Alert.alert('수정 실패', data.message || '서버 오류');
                return;
            }

            Alert.alert('수정 완료', '상품 정보가 수정되었습니다.');
            router.push('/MainPage/ProductList');
        } catch (err) {
            Alert.alert('오류', '서버에 연결할 수 없습니다.');
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`http://192.168.35.144:3001/api/delete-product/${product_id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const data = await res.json();
                Alert.alert('삭제 실패', data.message || '서버 오류');
                return;
            }

            Alert.alert('삭제 완료', '상품이 삭제되었습니다.');
            router.push('/MainPage/ProductList');
        } catch (err) {
            Alert.alert('오류', '서버에 연결할 수 없습니다.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <View style={styles.headerRow}>
                    <View style={styles.leftBox}><BackButton onPress={() => router.back()} /></View>
                    <View style={styles.centerBox}><Text style={styles.title}>상품 수정</Text></View>
                    <View style={styles.rightBox} />
                </View>

                <ScrollView contentContainerStyle={styles.container}>
                    <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.selectedImage} />
                        ) : (
                            <>
                                <Image source={require('../../assets/camera.png')} style={styles.cameraIcon} />
                                <Text style={styles.imageText}>사진 추가</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>상품명</Text>
                        <InputField
                            placeholder="상품명을 입력해 주세요."
                            value={productName}
                            onChangeText={setProductName}
                        />
                        <Text style={styles.exampleText}>예시: 정품 백도 4.5kg 12과</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>가격</Text>
                        <InputField
                            placeholder="₩ 가격을 입력해 주세요."
                            value={productPrice}
                            onChangeText={setProductPrice}
                            keyboardType="numeric"
                        />
                        <Text style={styles.exampleText}>배송비를 제외한 가격을 적어 주세요.</Text>
                    </View>
                </ScrollView>

                <DoubleButtonRow
                    leftLabel="삭제하기"
                    rightLabel="수정하기"
                    onLeftPress={handleDelete}
                    onRightPress={handleUpdate}
                    disabled={!isFormValid}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
