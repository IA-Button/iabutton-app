import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b0a2a' },
  gradient: { ...StyleSheet.absoluteFillObject },
  container: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 240, flexGrow: 1 },
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
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#FCA5A5', fontSize: 11, marginTop: 6 },

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
  dropdownError: { borderColor: '#EF4444' },
  dropdownText: { color: '#FFFFFF', fontSize: 14 },

  helper: { color: '#98A2B3', fontSize: 11, marginBottom: 6 },

  // Modal selector de modelos
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  modalTitle: { color: '#E4E7EC', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  modalOptionText: { color: '#FFFFFF', fontSize: 14 },
  modalCancel: {
    borderBottomWidth: 0,
    alignItems: 'center',
  },
});

export default styles;
