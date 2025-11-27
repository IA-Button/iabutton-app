import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b0a2a' },
  gradient: { ...StyleSheet.absoluteFillObject },
  container: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 240, flexGrow: 1 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  topSpacer: { height: 48 },
  headerTitle: { color: '#E4E7EC', fontSize: 18, fontWeight: '700' },
  pill: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)'
  },
  pillText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12, letterSpacing: 0.5 },
  headerColon: { color: '#E4E7EC', fontSize: 18, marginLeft: 8 },

  list: { marginTop: 8 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 12,
    marginBottom: 12,
  },
  itemPressed: { opacity: 0.9 },
  itemActive: { backgroundColor: 'rgba(255,255,255,0.10)' },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#5B5FC7',
    marginRight: 12,
  },
  thumbActive: { backgroundColor: '#7A5AF8' },
  itemBody: { flex: 1 },
  itemTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  itemTitleActive: { color: '#FFFFFF' },
  itemMeta: { color: '#D0D5DD', fontSize: 11 },
  itemRight: { marginLeft: 12, alignItems: 'flex-end' },
  itemDate: { color: '#E4E7EC', fontSize: 12 },
  itemTime: { color: '#98A2B3', fontSize: 11 },

  bottomInfo: {
    marginTop: 16,
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  countText: { color: '#98A2B3', fontSize: 12 },

  navbarSeparator: {
    position: 'absolute',
    left: 6,
    right: 6,
    bottom: 72,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)'
  },

  navbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 28,
    backgroundColor: 'transparent'
  },
  navBtn: { padding: 12 },
});

export default styles;
