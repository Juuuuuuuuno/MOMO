// app/admin/AddProduct.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import InputField from '../Components/InputField/InputField';
import ColoredFullWidthButton from '../Components/Button/ColoredFullWidthButton';
import BackButton from '../Components/Button/BackButton';
import styles from '../Styles/AddProductStyle';
import { SERVER_DOMAIN } from '@env';

export default function AddProduct() {
    const router = useRouter();

    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [base64Image, setBase64Image] = useState(null);

    const isFormValid = productName && price && base64Image;

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
        quality: 0.7,
        base64: true,
        });

        if (!result.canceled) {
        setImage(result.assets[0].uri);
        setBase64Image(result.assets[0].base64);
        }
    };

    const handleSubmit = async () => {
        const payload = {
        name: productName,
        price: parseInt(price),
        base64: base64Image,
        };

        console.log('📦 [상품추가] 업로드 데이터:', {
        name: productName,
        price: parseInt(price),
        base64_preview: base64Image?.substring(0, 30),
        });

        try {
        const res = await fetch(`${SERVER_DOMAIN}/api/add-product-base64`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('❌ 서버 오류 응답:', data);
            Alert.alert('상품 등록 실패', data.message || '서버 오류가 발생했습니다.');
            return;
        }

        console.log('✅ 등록 성공:', data);
        Alert.alert(
            '상품 등록 완료',
            '상품이 성공적으로 등록되었습니다.\n상품 목록 페이지로 이동하시겠습니까?',
            [
            {
                text: '아니요',
                onPress: () => {
                setProductName('');
                setPrice('');
                setImage(null);
                setBase64Image(null);
                },
                style: 'cancel',
            },
            {
                text: '예',
                onPress: () => {
                router.replace({
                    pathname: '/MainPage/ProductList',
                    params: { from: 'admin/AddProduct' },
                });
                },
            },
            ]
        );
        } catch (err) {
        console.error('❌ 업로드 실패:', err);
        Alert.alert('네트워크 오류', '서버와 통신하지 못했습니다.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            {/* 상단 헤더 */}
            <View style={styles.headerRow}>
                <View style={styles.leftBox}>
                <BackButton onPress={() => router.back()} />
                </View>
                <View style={styles.centerBox}>
                <Text style={styles.title}>상품 추가</Text>
                </View>
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

            {/* 상품명 입력 */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>상품명</Text>
                <InputField
                placeholder="상품명을 입력해 주세요."
                value={productName}
                onChangeText={setProductName}
                />
                <Text style={styles.exampleText}>예시: 정품 백도 4.5kg 12과</Text>
            </View>

            {/* 가격 입력 */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>가격</Text>
                <InputField
                placeholder="₩ 가격을 입력해 주세요."
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                />
                <Text style={styles.exampleText}>배송비를 제외한 가격을 적어 주세요.</Text>
            </View>
        </ScrollView>

            {/* 등록 버튼 */}
            <ColoredFullWidthButton
                label="추가하기"
                onPress={handleSubmit}
                disabled={!isFormValid}
                backgroundColor={isFormValid ? '#FF8A8A' : '#888'}
            />
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
