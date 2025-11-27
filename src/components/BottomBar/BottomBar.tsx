import React from 'react';
import { View, Pressable, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import styles from './styles';
import { useAuth } from '../../context/AuthContext';

export default function BottomBar() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isProfileComplete } = useAuth();

  const guard = (target: keyof RootStackParamList) => {
    if (!isProfileComplete && target !== 'Settings') {
      Alert.alert('Completa tu perfil', 'Por favor completa tus datos en Configuración.');
      navigation.navigate('Settings');
      return;
    }
    navigation.navigate(target);
  };

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <View style={styles.separator} />
      <View style={styles.bar}>
        <Pressable style={styles.btn} onPress={() => guard('chat')}>
          <Ionicons name="chatbubble-ellipses-outline" size={28} color="#E4E7EC" />
        </Pressable>
        <Pressable style={styles.btn} onPress={() => guard('generatedFiles')}>
          <Ionicons name="book-outline" size={28} color="#E4E7EC" />
        </Pressable>
        <Pressable style={styles.btn} onPress={() => guard('Bluetooth')}>
          <MaterialIcons name="bluetooth" size={28} color="#E4E7EC" />
        </Pressable>
        <Pressable style={styles.btn} onPress={() => guard('Settings')}>
          <Ionicons name="settings-outline" size={28} color="#E4E7EC" />
        </Pressable>
      </View>
    </View>
  );
}
