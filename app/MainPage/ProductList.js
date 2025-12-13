//app/MainPage/ProductList.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BackButton from '../Components/Button/BackButton';
import IconButton from '../Components/Button/IconButton';
import styles from '../Styles/ProductListStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXPO_PUBLIC_SERVER_DOMAIN } from '@env';

export default function ProductList() {
    const router = useRouter();
    const [products, setProducts] = useState([]);

    //login에서 받아온 어드민인지 아닌지
    const[isAdmin, setIsAdmin] = useState(false)

    const { from } = useLocalSearchParams();

    useEffect(() => {
        fetch(`${EXPO_PUBLIC_SERVER_DOMAIN}/api/products`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => {
                console.error('❌ 상품 불러오기 실패:', err);
            });

        AsyncStorage.getItem('is_admin').then(value => {
            setIsAdmin(Number(value) === 1 );
        })
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() =>
                router.push({
                    pathname: isAdmin ? 'admin/ProductDetail' : 'MainPage/ProductDetail',
                    params: {
                        name: item.name,
                        price: item.price,
                        image_url: item.image_url,
                        product_id: item.id,
                    },
                })
            }
        >
            <Image source={{ uri: `${EXPO_PUBLIC_SERVER_DOMAIN}${item.image_url}` }} style={styles.productImage}resizeMode="cover"  /*✅ 비율 유지*/ />
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
                <View style={{ width: 70 }}>
                    <BackButton onPress={()=>{
                        if (from === 'adminAdd') {
                            router.replace('/admin/Home'); // 어드민 추가 후 복귀는 홈으로
                        } else {
                            router.back(); // 일반 사용자는 원래대로
                        }
                    }} />
                </View>

                <Text style={styles.headerTitle}>상품 목록</Text>

                <View style={styles.iconGroup}>
                    {isAdmin ? (
                        <>
                            
                            {/* ✅ 첫 번째 아이콘: 자리만 채우는 null.png (onPress 없음) */}
                            <IconButton
                                iconSource={require('../../assets/null.png')} // 투명 이미지
                                onPress={() => { /* 자리 맞추기용, 동작 없음 */ }}
                            />

                            {/* ✅ 어드민: 두 번째 아이콘은 피드백 리스트 */}
                            <IconButton
                                iconSource={require('../../assets/receipt.png')}
                                onPress={() => {
                                    router.push('/admin/FeedbackList');
                                    console.log('📝 피드백 리스트');
                                }}
                            />


                        </>
                    ) : (
                        <>
                            {/* 일반 유저: 주문목록 + 장바구니 기존 그대로 */}
                            <IconButton
                                iconSource={require('../../assets/receipt.png')}
                                onPress={() => {
                                    router.push('/MainPage/ProductCheck'),
                                    console.log('🧾 주문목록');
                                }}
                            />
                            <IconButton
                                iconSource={require('../../assets/15050.png')}
                                onPress={() => {
                                    router.push('/MainPage/ShoppingCart'),
                                    console.log('🛒 장바구니');
                                }}
                            />
                        </>
                    )}
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
