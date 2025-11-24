import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b0a2a' },
  gradient: { ...StyleSheet.absoluteFillObject },
  container: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 180, flexGrow: 1 },

  topSpacer: { height: 48 },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#E4E7EC', marginTop: 6, marginBottom: 16 },

  scanBtn: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  scanText: { color: '#ffffff', fontWeight: '700', marginLeft: 8 },

  list: {},
  device: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  deviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#7A5AF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  deviceBody: { flex: 1 },
  deviceName: { color: '#FFFFFF', fontWeight: '700' },
  deviceStatus: { color: '#D0D5DD', fontSize: 12, marginTop: 2 },
  deviceAction: { color: '#22d3ee', fontWeight: '700' },
});

export default styles;
