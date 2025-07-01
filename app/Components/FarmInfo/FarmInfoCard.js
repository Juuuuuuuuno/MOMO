// Components/FarmInfoCard.js
import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../../Styles/MainStyle';

const FarmInfoCard = () => {
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
                <Text style={styles.location}>📍 충북 음성군 음성읍 용산리 ▶</Text>
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
