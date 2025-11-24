import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import BottomBar from '../../components/BottomBar/BottomBar';
import styles from './searchingStyles';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

export default function SearchingScreen() {
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (val, delay) => Animated.loop(
      Animated.sequence([
        Animated.timing(val, { toValue: 1, duration: 1200, delay, useNativeDriver: true }),
        Animated.timing(val, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
    loop(pulse1, 0);
    loop(pulse2, 250);
    loop(pulse3, 500);
  }, [pulse1, pulse2, pulse3]);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#0b0a2a', '#24124a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      <View style={styles.container}>
        <View style={styles.topSpacer} />
        <View style={styles.headerIcon}><MaterialIcons name="bluetooth" size={28} color="#FFFFFF" /></View>
        <Text style={styles.title}>Buscando dispositivo...</Text>

        <View style={styles.centerAbsolute} pointerEvents="none">
          <Svg style={styles.glow} width={260} height={260} viewBox="0 0 260 260">
            <Defs>
              <RadialGradient id="g" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#9f8afa" stopOpacity="0.55" />
                <Stop offset="60%" stopColor="#9f8afa" stopOpacity="0.18" />
                <Stop offset="100%" stopColor="#9f8afa" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx="130" cy="130" r="128" fill="url(#g)" />
          </Svg>

          <View style={styles.scanArcs}>
            <Animated.View style={[styles.arc, styles.arc1, { opacity: pulse1 }]} />
            <Animated.View style={[styles.arc, styles.arc2, { opacity: pulse2 }]} />
            <Animated.View style={[styles.arc, styles.arc3, { opacity: pulse3 }]} />
          </View>

          <Image source={require('../../../assets/button.png')} style={styles.deviceImage} resizeMode="contain" />
        </View>

        <BottomBar />
      </View>
    </SafeAreaView>
  );
}
