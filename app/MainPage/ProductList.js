//app/MainPage/ProductList.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import BackButton from '../Components/Button/BackButton';
import IconButton from '../Components/Button/IconButton';
import styles from '../Styles/ProductListStyle';

export default function ProductList() {
    const router = useRouter();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://192.168.35.144:3001/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => {
                console.error('❌ 상품 불러오기 실패:', err);
            });
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() =>
                router.push({
                    pathname: 'MainPage/ProductDetail',
                    params: {
                        name: item.name,
                        price: item.price,
                        image_url: item.image_url,
                    },
                })
            }
        >
            <Image source={{ uri: `http://192.168.35.144:3001${item.image_url}` }} style={styles.productImage} />
            <View style={styles.infoRow}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>₩{item.price.toLocaleString()}</Text>
            </View>
            <Text style={styles.deliveryNotice}>배송비 미포함</Text>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={styles.container}>
            {/* 상단 헤더 */}
            <View style={styles.headerRow}>
                <BackButton onPress={() => router.back()} />
                <Text style={styles.headerTitle}>상품 목록</Text>
                <View style={styles.iconGroup}>
                    <IconButton iconSource={require('../../assets/13267.png')} onPress={() => {}} />
                    <IconButton iconSource={require('../../assets/15050.png')} onPress={() => {}} />
                </View>
            </View>

            {/* 상품 목록 */}
            <FlatList
                data={products}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
}
