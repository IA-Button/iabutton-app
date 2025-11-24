import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b0a2a' },
  gradient: { ...StyleSheet.absoluteFillObject },
  container: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 180, flexGrow: 1 },
  topSpacer: { height: 48 },

  sectionHeader: { marginTop: 8, marginBottom: 12 },
  sectionTitle: { color: '#E4E7EC', fontSize: 16, fontWeight: '800' },
  sectionLine: { height: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginTop: 6 },

  fieldBlock: { marginBottom: 16 },
  label: { color: '#E4E7EC', fontSize: 12, marginBottom: 6 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  inputDisabled: { opacity: 0.75 },

  row: { flexDirection: 'row', alignItems: 'center' },
  rowInput: { flex: 1, marginRight: 10 },
  smallBtn: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  smallBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 12 },

  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownText: { color: '#FFFFFF', fontSize: 14 },

  helper: { color: '#98A2B3', fontSize: 11, marginBottom: 6 },
});

export default styles;
