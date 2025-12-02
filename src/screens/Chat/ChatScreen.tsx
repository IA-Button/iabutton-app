import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import styles from './styles';
import BottomBar from '../../components/BottomBar/BottomBar';
import { getBaseUrl, ensureBaseUrlHealthy } from '../../lib/api';

 type Message =
  | { id: string; role: 'user' | 'assistant'; type?: 'text'; text: string }
  | { id: string; role: 'assistant'; type: 'weather'; tempC: number; condition: string; city: string; tip?: string };

function Bubble({ m }: { m: Message }) {
  if (m.type === 'weather') {
    return (
      <View style={[styles.row, styles.left]}>
        <View style={styles.weatherCard}>
          <Text style={styles.weatherTemp}>{m.tempC}°</Text>
          <Text style={styles.weatherCond}>{m.condition}</Text>
          <Text style={styles.weatherCity}>{m.city}</Text>
        </View>
      </View>
    );
  }

  const isUser = m.role === 'user';
  return (
    <View style={[styles.row, isUser ? styles.right : styles.left]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi]}>
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{m.text}</Text>
      </View>
      {!isUser && (
        <View style={styles.actionsRow}>
          <Pressable style={styles.actionBtn}><Ionicons name="heart-outline" size={16} color="#E4E7EC" /></Pressable>
          <Pressable style={styles.actionBtn}><Ionicons name="add-circle-outline" size={16} color="#E4E7EC" /></Pressable>
        </View>
      )}
    </View>
  );
}

export default function ChatScreen() {
  const initial: Message[] = [];

  const [messages, setMessages] = useState<Message[]>(initial);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const fallbackTimerRef = useRef<any>(null);
  const gotFirstChunkRef = useRef<boolean>(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  type UserTextMsg = { id: string; role: 'user'; type?: 'text'; text: string };
  const isUserText = (m: Message): m is UserTextMsg => m.role === 'user' && (m as any).text !== undefined;

  const ensureSocket = async () => {
    // Asegura base saludable antes de abrir WS
    await ensureBaseUrlHealthy();
    const base = getBaseUrl() || 'http://localhost:5000';
    const wsUrl = base.replace('https://', 'wss://').replace('http://', 'ws://') + '/ws/chat';
    if (wsRef.current && (wsRef.current.readyState === 1 || wsRef.current.readyState === 0)) return wsRef.current;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    return ws;
  };

  const sendToLLM = async (conversation: Message[]) => {
    const ws = await ensureSocket();
    if (!ws) return;
    const sanitized: UserTextMsg[] = conversation.filter(isUserText).filter((m) => (m.text || '').trim().length > 0);
    const payload = {
      type: 'chat',
      messages: sanitized.map((m) => ({ role: 'user', text: m.text })),
    };
    if (ws.readyState === 1) {
      ws.send(JSON.stringify(payload));
    } else {
      ws.onopen = () => ws.send(JSON.stringify(payload));
    }
  };

  const restFallback = async (aid: string, conversation: Message[]) => {
    try {
      await ensureBaseUrlHealthy();
      const base: string = getBaseUrl() || 'http://localhost:5000';
      const res = await fetch(base + '/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversation.filter(isUserText).map((m) => ({ role: 'user', text: m.text })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data && (data.message || data.error)) || res.statusText);
      const content = data?.content || '';
      if (content) setMessages((prev) => prev.map((m) => (m.id === aid ? { ...m, text: content } : m)));
    } catch (e: any) {
      const msg = String(e?.message || 'fallback');
      // En error de red, reintenta una vez forzando discovery
      if (/Network request failed|Failed to fetch|Timeout/i.test(msg)) {
        try {
          await ensureBaseUrlHealthy();
          const base: string = getBaseUrl() || 'http://localhost:5000';
          const res2 = await fetch(base + '/chat', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: conversation.filter(isUserText).map((m) => ({ role: 'user', text: m.text })) }),
          });
          const data2 = await res2.json();
          if (res2.ok && data2?.content) {
            setMessages((prev) => prev.map((m) => (m.id === aid ? { ...m, text: data2.content } : m)));
            return;
          }
        } catch {}
      }
      setMessages((prev) => prev.map((m) => (m.id === aid ? { ...m, text: `Error: ${msg}` } : m)));
    }
  };

  const onSend = async () => {
    const text = input.trim();
    if (!text) return;
    const uid = `u-${Date.now()}`;
    const aid = `a-${Date.now()}`;
    const newMsgs: Message[] = [
      ...messages,
      { id: uid, role: 'user', type: 'text', text },
      { id: aid, role: 'assistant', type: 'text', text: '' },
    ];
    setMessages(newMsgs);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    // Iniciar streaming
    const ws = await ensureSocket();
    gotFirstChunkRef.current = false;
    if (ws) {
      // Escucha temporal para este turno
      const onMessage = (ev: any) => {
        try {
          const data = JSON.parse(ev.data);
          if (data.type === 'chunk' && data.content) {
            gotFirstChunkRef.current = true;
            if (fallbackTimerRef.current) { clearTimeout(fallbackTimerRef.current); fallbackTimerRef.current = null; }
            setMessages((prev) => prev.map((m) => (m.id === aid ? { ...(m as any), text: ((m as any).text || '') + data.content } : m)));
          } else if (data.type === 'error') {
            if (fallbackTimerRef.current) { clearTimeout(fallbackTimerRef.current); fallbackTimerRef.current = null; }
            setMessages((prev) => prev.map((m) => (m.id === aid ? { ...m, text: `Error: ${data?.message || 'no puedo responder ahora.'}` } : m)));
          }
          if (data.type === 'done' || data.type === 'error') {
            if ((ws as any)?.removeEventListener) (ws as any).removeEventListener('message', onMessage as any);
            else (ws as any).onmessage = null;
          }
        } catch (_) {}
      };
      if ((ws as any)?.addEventListener) (ws as any).addEventListener('message', onMessage as any);
      else (ws as any).onmessage = onMessage as any;
    }
    // Fallback si no llega ningún chunk en 3s
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    fallbackTimerRef.current = setTimeout(() => {
      if (!gotFirstChunkRef.current) restFallback(aid, newMsgs);
    }, 3000);
    sendToLLM(newMsgs);
  };

  const sendTextAsChat = (text: string) => {
    if (!text?.trim()) return;
    setInput(text);
    // reutiliza el flujo de enviar
    setTimeout(() => onSend(), 0);
  };

  const startRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permiso requerido', 'Necesitamos acceso al micrófono para grabar audio.');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
      setIsRecording(true);
    } catch (e: any) {
      Alert.alert('Error al grabar', e?.message || 'No se pudo iniciar la grabación');
    }
  };

  const stopRecording = async () => {
    try {
      const rec = recording;
      if (!rec) return;
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      setRecording(null);
      setIsRecording(false);
      if (!uri) return;
      await ensureBaseUrlHealthy();
      const base = getBaseUrl() || 'http://localhost:5000';
      const form = new FormData();
      form.append('audio', { uri, name: `voice-${Date.now()}.m4a`, type: 'audio/m4a' } as any);
      const res = await fetch(base + '/transcribe', { method: 'POST', body: form });
      let data: any = null;
      try {
        const raw = await res.text();
        data = raw ? JSON.parse(raw) : null;
      } catch (_) {
        data = null;
      }
      if (!res.ok) {
        const msg = data?.message || data?.error?.message || res.statusText || 'Transcripción falló';
        throw new Error(msg);
      }
      const text = data?.text || '';
      if (text) sendTextAsChat(text);
    } catch (e: any) {
      Alert.alert('Error de transcripción', e?.message || 'No fue posible transcribir el audio');
    }
  };

  const toggleRecord = async () => {
    if (isRecording) await stopRecording(); else await startRecording();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#0b0a2a", "#24124a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient} />
      <View style={styles.container}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          <View style={styles.topSpacer} />
          {messages.map((m) => (
            <Bubble key={m.id} m={m} />
          ))}
        </ScrollView>

        <View style={styles.inputWrap}>
          <View style={styles.inputInner}>
            <Pressable onPress={toggleRecord} style={{ marginRight: 8 }} hitSlop={8}>
              <Ionicons name={isRecording ? 'stop-circle' : 'mic-outline'} size={22} color={isRecording ? '#EF4444' : '#E4E7EC'} />
            </Pressable>
            <TextInput
              style={styles.input}
              placeholder="Message"
              placeholderTextColor="#98A2B3"
              value={input}
              onChangeText={setInput}
              multiline
            />
            <Pressable onPress={onSend} style={styles.sendBtn} hitSlop={8}>
              <Ionicons name="send" size={18} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        <BottomBar />
      </View>
    </SafeAreaView>
  );
}
