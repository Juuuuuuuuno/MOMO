// Components/FarmInfoCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'; // ✅ TouchableOpacity, Alert 추가
import styles from '../../Styles/MainStyle';
import * as Clipboard from 'expo-clipboard'; // ✅ 복사 기능 추가

const FarmInfoCard = () => {
    // ✅ 주소 복사 함수
    const copyAddress = async () => {
        const fullAddress = "충북 음성군 음성읍 용광로 186";
        await Clipboard.setStringAsync(fullAddress);
        Alert.alert("주소 복사 완료", `${fullAddress} 이(가) 복사되었습니다.`);
        console.log(`📋 주소 복사됨: ${fullAddress}`);
    };

    return (
        <View style={styles.card}>
            <Image
                source={require('../../../assets/farm.jpg')}
                style={styles.image}
            />
            <View style={styles.infoContainer}>

                {/* ✅ 제목과 농부정보 행 구성 */}
                <View style={styles.titleRow}>
                    <Text style={styles.title}>참농원</Text>
                    <View style={styles.farmerMeta}>
                        <Text style={styles.owner}>🍑 이재석 농부</Text>

                        {/* ✅ 주소를 TouchableOpacity로 감싸기 */}
                        <TouchableOpacity onPress={copyAddress}>
                            <Text style={[styles.location, { textDecorationLine: 'underline' }]}>
                                📋충북 음성군 음성읍 용산리
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.description}>햇살과 정성으로 키운 복숭아 참농원 입니다.</Text>

                <View style={styles.detailBox}>
                    <Text style={styles.detail}>💡 정품 : 선물용으로도 손색없는 고품질 복숭아</Text>
                    <Text style={styles.detail}>💡 비품 : 외형 흠집 있는 상품</Text>
                    <Text style={styles.detail}>📅 수확 시기 : 7월 초 ~ 9월 말</Text>
                    <Text style={styles.detail}>📞 문의 : 010 - 3462 - 3100</Text>
                    <Text style={styles.detail}>🚛 택배 발송 : 월 ~ 금 (우체국 택배)</Text>
                    <Text style={styles.notice}>택배 발송 중 상품이 손상될 수 있습니다.</Text>
                </View>
            </View>
        </View>
    );
};

export default FarmInfoCard;
