import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b0a2a' },
  gradient: { ...StyleSheet.absoluteFillObject },
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 260, flexGrow: 1 },
  topSpacer: { height: 8 },

  // Chat rows
  row: { marginVertical: 8 },
  left: { alignSelf: 'flex-start', maxWidth: '84%' },
  right: { alignSelf: 'flex-end', maxWidth: '84%' },

  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleAi: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)'
  },
  bubbleUser: {
    backgroundColor: '#FFFFFF',
  },
  bubbleText: { color: '#E4E7EC', fontSize: 14, lineHeight: 20 },
  bubbleTextUser: { color: '#0b0a2a' },

  actionsRow: { flexDirection: 'row', marginTop: 6, marginLeft: 8 },
  actionBtn: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    marginRight: 6,
  },

  // Weather card
  weatherCard: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 16,
    width: 220,
  },
  weatherTemp: { color: '#FFFFFF', fontSize: 36, fontWeight: '800' },
  weatherCond: { color: '#E4E7EC', fontSize: 14, marginTop: 4 },
  weatherCity: { color: '#98A2B3', fontSize: 12, marginTop: 2 },

  // Input
  inputWrap: {
    position: 'absolute',
    left: 16, right: 16,
    bottom: 110, // por encima de la BottomBar
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: { flex: 1, color: '#FFFFFF', fontSize: 14, minHeight: 36, maxHeight: 96 },
  sendBtn: {
    marginLeft: 8,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(122,90,248,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
});

export default styles;
