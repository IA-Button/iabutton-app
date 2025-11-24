import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Pressable, TextInput, Linking, Image, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import appConfig from '../../../app.json';
import styles from './styles';
import { api } from '../../lib/api';

const PLANETS = require('../../../assets/auth_header.png');
const LOGO = require('../../../assets/logo2025white.png');

export default function SignInScreen({ navigation }) {
  const version = appConfig.expo?.version ?? '1.0.0';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignIn = async () => {
    setAttempted(true);
    if (!email && !password) {
      Alert.alert('Datos incompletos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }
    if (!email) {
      Alert.alert('Correo requerido', 'Ingresa tu correo.');
      return;
    }
    if (!password) {
      Alert.alert('Contraseña requerida', 'Ingresa tu contraseña.');
      return;
    }
    try {
      setLoading(true);
      const data = await api.signIn(email.trim(), password);
      // Si tu API retorna un token, podrías guardarlo aquí.
      Alert.alert('Éxito', 'Inicio de sesión correcto');
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Error de inicio de sesión', err?.message || 'No fue posible iniciar sesión');
    } finally {
      setLoading(false);
    }
  };
  const onGoogle = () => navigation.navigate('Home');
  const onEmail = () => navigation.navigate('Home');
  const onSignUpLink = () => navigation.navigate('SignUp');
  const openTerms = () => Linking.openURL('https://example.com/terms');

  const emailError = attempted && email.trim() === '';
  const passwordError = attempted && password.trim() === '';

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#0b0a2a', '#24124a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.container}>
        <View style={styles.heroWrap}>
          <Image source={PLANETS} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(11,10,42,0.0)', 'rgba(11,10,42,0.6)', 'rgba(11,10,42,1)']}
            style={styles.heroFade}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
          <View style={[styles.topbar, styles.topbarOverlay]}>
            <Image source={LOGO} style={styles.brandLogo} />
            <Pressable onPress={onSignUpLink} hitSlop={8} style={styles.topbarRight}>
              <Text style={styles.signInText}>¿No tienes una cuenta? <Text style={styles.link}>Regístrate</Text></Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.topSpacer} />
        <Text style={styles.hero}>ENTRAR</Text>
        <Text style={styles.caption}>Inicia sesión con tu cuenta de correo:</Text>

        <View style={[styles.inputBox, emailError && styles.inputBoxError]}>
          <Ionicons name="mail-outline" size={20} color="#D0D5DD" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="tuemail@correo.com"
            placeholderTextColor="#98A2B3"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>
        {emailError && <Text style={styles.errorText}>El correo es requerido</Text>}

        <View style={[styles.inputBox, { marginTop: 12 }, passwordError && styles.inputBoxError]}>
          <Ionicons name="lock-closed-outline" size={20} color="#D0D5DD" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#98A2B3"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#D0D5DD" />
          </Pressable>
        </View>
        {passwordError && <Text style={styles.errorText}>La contraseña es requerida</Text>}

        <Pressable onPress={onSignIn} disabled={loading} style={({ pressed }) => [styles.primaryWrap, (pressed || loading) && { opacity: 0.95 }]}>
          <LinearGradient
            style={styles.primary}
            colors={['#6a5ae0', '#7a5af8', '#22d3ee']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.primaryText}>Sign in</Text>
          </LinearGradient>
        </Pressable>

        <View style={styles.separator} />
        <Text style={styles.continue}>O continúa con:</Text>

        <View style={styles.row}>
          <Pressable onPress={onGoogle} style={({ pressed }) => [styles.social, pressed && styles.socialPressed]}>
            <Ionicons name="logo-google" size={18} color="#ffffff" />
            <Text style={styles.socialText}>Google</Text>
          </Pressable>
          <Pressable onPress={onEmail} style={({ pressed }) => [styles.social, pressed && styles.socialPressed]}>
            <MaterialIcons name="email" size={18} color="#ffffff" />
            <Text style={styles.socialText}>e-mail</Text>
          </Pressable>
        </View>

        <Text style={styles.terms}>
          Al continuar, aceptas nuestros <Text style={styles.link} onPress={openTerms}>Términos y Condiciones</Text>
        </Text>

        <View style={{ flex: 1 }} />
        <Text style={styles.copyright}>COPYRIGHT BY EDUTECNO · v{version}</Text>
        <StatusBar style="light" />
      </View>
    </SafeAreaView>
  );
}
