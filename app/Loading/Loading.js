import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

export default function WaitingScreen() {
  const fruits = ["🍑", "🍎", "🍊", "🍇", "🍉"];
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [dots, setDots] = useState(".");

  // ✅ 과일 추가 함수
  const addFruit = () => {
    const fruit = fruits[Math.floor(Math.random() * fruits.length)];
    const randX = Math.random() * (width - 60);
    const randY = Math.random() * (height - 200);
    setItems(prev => [
      ...prev,
      { id: Date.now() + Math.random(), fruit, x: randX, y: randY, createdAt: Date.now() }
    ]);
  };

  // ✅ 처음 7개 뿌리기
  const generateInitialFruits = () => {
    for (let i = 0; i < 7; i++) {
      addFruit();
    }
  };

  // ✅ 이후 7개 세트 따따딱 생성
  const generateFruitSet = () => {
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        addFruit();
      }, i * 500); // 500ms 간격으로 소환
    }
  };

  // ✅ 마운트 시 초기화 + 주기적 세트 소환
  useEffect(() => {
    generateInitialFruits();
    const interval = setInterval(generateFruitSet, 3000); // 3초마다 세트 소환
    return () => clearInterval(interval);
  }, []);

  // ✅ 오래된 과일 제거 (3초 뒤 자동 제거)
  useEffect(() => {
    const cleanup = setInterval(() => {
      setItems(prev => prev.filter(item => Date.now() - item.createdAt < 3000));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  // ✅ "대기 중입니다..." 점 변환
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => (prev === "..." ? "." : prev + "."));
    }, 500);
    return () => clearInterval(dotInterval);
  }, []);

  // ✅ 클릭 이벤트
  const handlePress = (id, fruit) => {
    if (fruit === "🍑") {
      setScore(score + 1);
    } else {
      setScore(Math.max(0, score - 1));
    }
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>접속 대기 중입니다{dots}</Text>

      {items.map(item => (
        <TouchableOpacity
          key={item.id}
          onPress={() => handlePress(item.id, item.fruit)}
          style={[styles.fruit, { top: item.y, left: item.x }]}
        >
          <Text style={styles.emoji}>{item.fruit}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.subText}>점수: {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop: 40 },
  fruit: { position: "absolute" },
  emoji: { fontSize: 40 },
  subText: { position: "absolute", bottom: 40, alignSelf: "center", fontSize: 16, color: "#333" }
});
