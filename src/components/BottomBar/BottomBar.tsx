import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import styles from './styles';

export default function BottomBar() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <View style={styles.separator} />
      <View style={styles.bar}>
        <Pressable style={styles.btn} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="book-outline" size={28} color="#E4E7EC" />
        </Pressable>
        <Pressable style={styles.btn} onPress={() => navigation.navigate('Bluetooth')}>
          <MaterialIcons name="bluetooth" size={28} color="#E4E7EC" />
        </Pressable>
        <Pressable style={styles.btn} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={28} color="#E4E7EC" />
        </Pressable>
      </View>
    </View>
  );
}
