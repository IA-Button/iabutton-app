import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import BottomBar from '../../components/BottomBar/BottomBar';
import styles from './styles';

export default function SettingsScreen() {
  const [name, setName] = useState('Carlos Linares');
  const [email] = useState('clinares@edutecno.com');
  const [plan] = useState('Básico');
  const [model] = useState('KeyAI Sophia EDX-021');
  const [mac, setMac] = useState('XN123-7894');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#0b0a2a", "#24124a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient} />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.topSpacer} />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Datos generales</Text>
            <View style={styles.sectionLine} />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput style={[styles.input, styles.inputDisabled]} value={email} editable={false} placeholderTextColor="#98A2B3" />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Tu nombre" placeholderTextColor="#98A2B3" />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Plan</Text>
            <View style={styles.row}>
              <TextInput style={[styles.input, styles.rowInput]} value={plan} editable={false} placeholderTextColor="#98A2B3" />
              <Pressable style={({ pressed }) => [styles.smallBtn, pressed && { opacity: 0.95 }]} onPress={() => Alert.alert('Plan', 'Cambiar plan')}>
                <Text style={styles.smallBtnText}>Cambiar Plan</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dispositivo</Text>
            <View style={styles.sectionLine} />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Modelo</Text>
            <Pressable style={styles.dropdown} onPress={() => Alert.alert('Modelo', 'Seleccionar modelo')}>
              <Text style={styles.dropdownText}>{model}</Text>
              <MaterialIcons name="arrow-drop-down" size={22} color="#E4E7EC" />
            </Pressable>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Número MAC</Text>
            <Text style={styles.helper}>Verifique el embalaje de su dispositivo para encontrar este número</Text>
            <TextInput style={styles.input} value={mac} onChangeText={setMac} placeholder="XX000-0000" placeholderTextColor="#98A2B3" />
          </View>

          <Pressable
            style={({ pressed }) => [styles.smallBtn, { alignSelf: 'flex-start', marginTop: 8 }, pressed && { opacity: 0.95 }]}
            onPress={() => (navigation as any).reset({ index: 0, routes: [{ name: 'SignIn' }] })}
          >
            <Text style={styles.smallBtnText}>Cerrar sesión</Text>
          </Pressable>
        </ScrollView>

        <BottomBar />
      </View>
    </SafeAreaView>
  );
}
