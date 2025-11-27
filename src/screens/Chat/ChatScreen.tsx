import React, { useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import BottomBar from '../../components/BottomBar/BottomBar';

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
  const initial: Message[] = useMemo(() => [
    { id: 'u1', role: 'user', type: 'text', text: "I'm feeling burned out.\nAny suggestions for recharging?" },
    { id: 'a1', role: 'assistant', type: 'text', text: "How about a rejuvenating walk outside? It's a great way to refresh your mind and uplift your spirits." },
    { id: 'u2', role: 'user', type: 'text', text: 'What is the weather?' },
    { id: 'w1', role: 'assistant', type: 'weather', tempC: 22, condition: 'Rain Showers', city: 'San Francisco', tip: 'It will rain in 1 hour, I recommend taking an umbrella' },
    { id: 'a2', role: 'assistant', type: 'text', text: 'It will rain in 1 hour, I recommend taking an umbrella' },
  ], []);

  const [messages, setMessages] = useState<Message[]>(initial);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const onSend = () => {
    const text = input.trim();
    if (!text) return;
    const newMsgs: Message[] = [
      ...messages,
      { id: `u-${Date.now()}`, role: 'user', type: 'text', text },
      { id: `a-${Date.now()}`, role: 'assistant', type: 'text', text: 'Recibido. Estoy aquí para ayudar.' },
    ];
    setMessages(newMsgs);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
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
