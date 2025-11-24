import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';
import BottomBar from '../../components/BottomBar/BottomBar';

const items = [
  { id: '1', title: 'sora-ai-blue.png', kind: 'image / png', size: '240 Kbytes', date: '15/04/2025', time: '7:41am', active: true },
  { id: '2', title: 'sora-3d-boy.jpeg', kind: 'image / png', size: '283 Kbytes', date: '16/04/2025', time: '9:31am' },
  { id: '3', title: 'leonardo-mamut…', kind: 'Video / mp4', size: '12 Mbytes', date: '16/04/2025', time: '11:18am' },
  { id: '4', title: 'resumen-la-iliada…', kind: 'Documento / pdf', size: '1 Mbyte', date: '16/04/2025', time: '01:28pm' },
  { id: '5', title: 'sesión-sophia-0054', kind: 'chat / mp3', size: '1.5 Mbytes', date: '16/04/2025', time: '04:14pm' },
];

function ItemRow({ item }) {
  return (
    <Pressable style={({ pressed }) => [styles.item, item.active && styles.itemActive, pressed && styles.itemPressed]}>
      <View style={[styles.thumb, item.active && styles.thumbActive]} />
      <View style={styles.itemBody}>
        <Text style={[styles.itemTitle, item.active && styles.itemTitleActive]} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.itemMeta} numberOfLines={1}>{item.kind}</Text>
        <Text style={styles.itemMeta}>{item.size}</Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.itemDate}>{item.date}</Text>
        <Text style={styles.itemTime}>{item.time}</Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
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

          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Archivos generados</Text>
            <View style={styles.pill}><Text style={styles.pillText}>hoy</Text></View>
            <Text style={styles.headerColon}>:</Text>
          </View>

          <View style={styles.list}>
            {items.map((it) => (
              <ItemRow key={it.id} item={it} />
            ))}
          </View>

          <View style={styles.bottomInfo}>
            <Text style={styles.countText}>5 archivos generados hoy</Text>
          </View>
        </ScrollView>

        <BottomBar />
      </View>
    </SafeAreaView>
  );
}
