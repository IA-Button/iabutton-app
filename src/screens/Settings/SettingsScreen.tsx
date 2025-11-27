import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import BottomBar from '../../components/BottomBar/BottomBar';
import styles from './styles';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export default function SettingsScreen() {
  const { user, setUser, signOut, isUserProfileComplete } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [plan] = useState(user?.plan ?? 'Básico');
  const [model, setModel] = useState(user?.model ?? '');
  const [mac, setMac] = useState(user?.mac ?? '');
  const [attempted, setAttempted] = useState(false);
  const [modelPickerVisible, setModelPickerVisible] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    // Prellenar si cambia el usuario
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setMac(user?.mac ?? '');
    setModel(user?.model ?? '');
  }, [user]);

  const emailError = attempted && (!email || !email.trim());
  const nameError = attempted && (!name || !name.trim());
  const planError = attempted && (!plan || String(plan).trim().length === 0);
  const modelError = attempted && (!model || !String(model).trim());
  const macError = attempted && (!mac || !mac.trim());

  const onSave = async () => {
    setAttempted(true);
    const payload = { name: name?.trim?.() ?? '', mac: mac?.trim?.() ?? '', model, plan };
    try {
      // Persistir en backend y usar la respuesta como fuente de verdad
      const res = await api.updateProfile(payload, user?.id);
      const serverUser = (res && (res.user || res.data?.user)) ? (res.user || res.data?.user) : res;
      const updated = { ...(user ?? {}), ...payload, ...(serverUser || {}) } as any;
      setUser(updated);
      // Revisa completitud y navega o muestra errores.
      if (isUserProfileComplete(updated)) {
        Alert.alert('Guardado', 'Tus datos han sido actualizados.');
        (navigation as any).reset({ index: 0, routes: [{ name: 'chat' }] });
      } else {
        Alert.alert('Faltan datos', 'Completa todos los campos para continuar.');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'No se pudieron guardar los cambios');
      console.log('updateProfile error:', err?.status, err?.message, err?.data);
    }
  };

  const onSignOut = () => {
    signOut();
    (navigation as any).reset({ index: 0, routes: [{ name: 'SignIn' }] });
  };

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
            <TextInput style={[styles.input, styles.inputDisabled, emailError && styles.inputError]} value={email} editable={false} placeholderTextColor="#98A2B3" />
            {emailError && <Text style={styles.errorText}>El e-mail es requerido</Text>}
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput style={[styles.input, nameError && styles.inputError]} value={name} onChangeText={setName} placeholder="Tu nombre" placeholderTextColor="#98A2B3" />
            {nameError && <Text style={styles.errorText}>El nombre es requerido</Text>}
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Plan</Text>
            <View style={styles.row}>
              <TextInput style={[styles.input, styles.rowInput, planError && styles.inputError]} value={plan} editable={false} placeholderTextColor="#98A2B3" />
              <Pressable style={({ pressed }) => [styles.smallBtn, pressed && { opacity: 0.95 }]} onPress={() => Alert.alert('Plan', 'Cambiar plan')}>
                <Text style={styles.smallBtnText}>Cambiar Plan</Text>
              </Pressable>
            </View>
            {planError && <Text style={styles.errorText}>El plan es requerido</Text>}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dispositivo</Text>
            <View style={styles.sectionLine} />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Modelo</Text>
            <Pressable style={[styles.dropdown, modelError && styles.dropdownError]} onPress={() => setModelPickerVisible(true)}>
              <Text style={styles.dropdownText}>{model || 'Selecciona un modelo'}</Text>
              <MaterialIcons name="arrow-drop-down" size={22} color="#E4E7EC" />
            </Pressable>
            {modelError && <Text style={styles.errorText}>El modelo es requerido</Text>}
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Número MAC</Text>
            <Text style={styles.helper}>Verifique el embalaje de su dispositivo para encontrar este número</Text>
            <TextInput style={[styles.input, macError && styles.inputError]} value={mac} onChangeText={setMac} placeholder="XX000-0000" placeholderTextColor="#98A2B3" />
            {macError && <Text style={styles.errorText}>El número MAC es requerido</Text>}
          </View>

          <Pressable
            style={({ pressed }) => [styles.smallBtn, { alignSelf: 'flex-start', marginTop: 8 }, pressed && { opacity: 0.95 }]}
            onPress={onSave}
          >
            <Text style={styles.smallBtnText}>Guardar cambios</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.smallBtn, { alignSelf: 'flex-start', marginTop: 8 }, pressed && { opacity: 0.95 }]}
            onPress={onSignOut}
          >
            <Text style={styles.smallBtnText}>Cerrar sesión</Text>
          </Pressable>
        </ScrollView>

        <BottomBar />
      </View>

      <Modal transparent visible={modelPickerVisible} animationType="fade" onRequestClose={() => setModelPickerVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setModelPickerVisible(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Selecciona un modelo</Text>
            <Pressable style={styles.modalOption} onPress={() => { setModel('KeyAI Sophia EDX-021'); setModelPickerVisible(false); }}>
              <Text style={styles.modalOptionText}>KeyAI Sophia EDX-021</Text>
            </Pressable>
            <Pressable style={styles.modalOption} onPress={() => { setModel('KeyAI Sophia EDX-022'); setModelPickerVisible(false); }}>
              <Text style={styles.modalOptionText}>KeyAI Sophia EDX-022</Text>
            </Pressable>
            <Pressable style={[styles.modalOption, styles.modalCancel]} onPress={() => setModelPickerVisible(false)}>
              <Text style={styles.modalOptionText}>Cancelar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
