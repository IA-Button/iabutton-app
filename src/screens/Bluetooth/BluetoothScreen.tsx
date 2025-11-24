import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import BottomBar from '../../components/BottomBar/BottomBar';
import styles from './styles';

const mockDevices = [
  { id: '1', name: 'ia button', status: 'Disponible' },
];

export default function BluetoothScreen({ navigation }) {
  const [devices, setDevices] = useState(mockDevices);
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#0b0a2a', '#24124a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.topSpacer} />
          <Text style={styles.title}>Conectar por Bluetooth</Text>
          {/* <Text style={styles.subtitle}>Elige un dispositivo para emparejar</Text> */}

          <Pressable style={({ pressed }) => [styles.scanBtn, pressed && { opacity: 0.9 }]}
            onPress={() => navigation.navigate('BluetoothSearching')}
          >
            <MaterialIcons name="bluetooth-searching" size={20} color="#ffffff" />
            <Text style={styles.scanText}>Buscar ia button</Text>
          </Pressable>

          <View style={styles.list}>
            {devices.map(d => (
              <Pressable
                key={d.id}
                style={({ pressed }) => [styles.device, pressed && { opacity: 0.95 }]}
                onPress={() => setDevices(prev => prev.map(x => x.id === d.id ? { ...x, status: x.status === 'Conectado' ? 'Disponible' : 'Conectado' } : x))}
              >
                <View style={styles.deviceIcon}><MaterialIcons name="bluetooth" size={18} color="#ffffff" /></View>
                <View style={styles.deviceBody}>
                  <Text style={styles.deviceName}>{d.name}</Text>
                  <Text style={styles.deviceStatus}>{d.status}</Text>
                </View>
                <Text style={styles.deviceAction}>{d.status === 'Conectado' ? 'Desconectar' : 'Conectar'}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <BottomBar />
      </View>
    </SafeAreaView>
  );
}
