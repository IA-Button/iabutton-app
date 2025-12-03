import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import styles from './styles';
import BottomBar from '../../components/BottomBar/BottomBar';
import { getBaseUrl, ensureBaseUrlHealthy } from '../../lib/api';

 type Message =
  | { id: string; role: 'user' | 'assistant'; type?: 'text'; text: string }
  | { id: string; role: 'assistant'; type: 'weather'; tempC: number; condition: string; city: string; tip?: string };

function Bubble({ m, speakingId, onToggleSpeak }: { m: Message; speakingId: string | null; onToggleSpeak: (m: Message) => void }) {
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
  const isAssistantText = m.role === 'assistant' && (m as any).text !== undefined;
  return (
    <View style={[styles.row, isUser ? styles.right : styles.left]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi]}>
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{(m as any).text}</Text>
      </View>
      {!isUser && (
        <View style={styles.actionsRow}>
          <Pressable style={styles.actionBtn}><Ionicons name="heart-outline" size={16} color="#E4E7EC" /></Pressable>
          <Pressable style={styles.actionBtn}><Ionicons name="add-circle-outline" size={16} color="#E4E7EC" /></Pressable>
          {isAssistantText && (
            <Pressable style={styles.actionBtn} onPress={() => onToggleSpeak(m)} hitSlop={8}>
              <Ionicons name={speakingId === m.id ? 'stop-circle-outline' : 'volume-high-outline'} size={16} color="#E4E7EC" />
            </Pressable>
          )}
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
  const [speakingId, setSpeakingId] = useState<string | null>(null);

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

  const toggleSpeakFor = async (m: Message) => {
    if (m.role !== 'assistant' || (m as any).text === undefined) return;
    const text = String((m as any).text || '').trim();
    if (!text) return;

    // Si ya está leyendo este mismo mensaje, detener.
    if (speakingId === m.id) {
      try { Speech.stop(); } catch {}
      setSpeakingId(null);
      return;
    }

    // Detener cualquier lectura previa.
    try { Speech.stop(); } catch {}

    // Seleccionar voz en español si existe; si no, usar por defecto sin forzar idioma.
    let voiceId: string | undefined;
    let voiceLang: string | undefined;
    try {
      const voices: any[] = (await Speech.getAvailableVoicesAsync()) || [];
      const es = voices.find(v => String(v?.language || '').toLowerCase().startsWith('es'));
      if (es?.identifier) {
        voiceId = es.identifier;
        voiceLang = es.language;
      }
    } catch {}

    // Mostrar cambio de icono inmediatamente.
    setSpeakingId(m.id);

    const optsBase: any = {
      rate: 1.0,
      pitch: 1.0,
      onStart: () => setSpeakingId(m.id),
      onDone: () => setSpeakingId(null),
      onError: () => setSpeakingId(null),
    };

    const opts = { ...optsBase } as any;
    if (voiceId) {
      opts.voice = voiceId;
      if (voiceLang) opts.language = voiceLang;
    }

    Speech.speak(text, opts);

    // Verificar que realmente comenzó a hablar; si no, hacer fallback y avisar.
    setTimeout(async () => {
      try {
        const speaking = await Speech.isSpeakingAsync();
        if (!speaking) {
          setSpeakingId(null);
          // Fallback: intentar sin ninguna opción (voz/idioma por defecto)
          Speech.speak(text, {
            rate: 1.0,
            pitch: 1.0,
            onDone: () => setSpeakingId(null),
            onError: () => setSpeakingId(null),
          } as any);
        }
      } catch {}
    }, 600);
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
            <Bubble key={m.id} m={m} speakingId={speakingId} onToggleSpeak={toggleSpeakFor} />
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
