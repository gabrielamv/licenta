import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Image } from 'react-native';

export default function SpiralaAnimata() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000, // durata unei rotații (în milisecunde)
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.Image
      source={require('../assets/Soare2.png')}
      style={[styles.image, { transform: [{ rotate: spin }] }]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 60, // ajustează dimensiunea
    height: 60,
  },
});
