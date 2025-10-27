// app/MainPage/ProductList.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Image } from 'expo-image'; // ✅ expo-image로 교체 (디스크 캐시)
import { useLocalSearchParams, useRouter } from 'expo-router';
import BackButton from '../Components/Button/BackButton';
import IconButton from '../Components/Button/IconButton';
import styles from '../Styles/ProductListStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_DOMAIN } from '@env';

export default function ProductList() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // 로그인에서 받은 어드민 여부
  const { from } = useLocalSearchParams();

  useEffect(() => {
    fetch(`${SERVER_DOMAIN}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => {
        console.error('❌ 상품 불러오기 실패:', err);
      });

    AsyncStorage.getItem('is_admin').then(value => {
      setIsAdmin(Number(value) === 1);
    });
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
      {/* ✅ 디스크 캐시 + 절대/상대 URL 안전 처리 */}
      <Image
        source={{ uri: item.image_url?.startsWith('http') ? item.image_url : `${SERVER_DOMAIN}${item.image_url}` }}
        cachePolicy="disk"
        contentFit="cover"
        transition={200}
        style={styles.productImage}
      />

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
          <BackButton
            onPress={() => {
              // ✅ from 값 통일: 'admin/AddProduct' 로 비교 수정
              if (from === 'admin/AddProduct') {
                router.replace('/admin/Home'); // 어드민 추가 후 복귀는 홈으로
              } else {
                router.back(); // 일반 사용자는 원래 화면으로
              }
            }}
          />
        </View>
        <Text style={styles.headerTitle}>상품 목록</Text>
        <View style={styles.iconGroup}>
          <IconButton
            iconSource={require('../../assets/receipt.png')}
            onPress={() => {
              router.push('/MainPage/ProductCheck');
              console.log('🧾 주문목록');
            }}
          />
          <IconButton
            iconSource={require('../../assets/15050.png')}
            onPress={() => {
              router.push('/MainPage/ShoppingCart');
              console.log('🛒 장바구니');
            }}
          />
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
