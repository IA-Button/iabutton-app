import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b0a2a' },
  container: { padding: 24, flex: 1 },

  heroWrap: {
    height: 500,
    overflow: 'hidden',
    marginHorizontal: -24,
    marginTop: -24,
    marginBottom: 24,
  },
  heroImage: { width: '100%', height: '100%' },
  heroFade: { ...StyleSheet.absoluteFillObject },

  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topbarOverlay: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
  },
  brand: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', letterSpacing: 0.5 },
  brandThin: { fontWeight: '600', opacity: 0.9 },
  brandLogo: { width: 170, height: 80, resizeMode: 'contain', flexShrink: 0 },
  signInText: { color: '#FFFFFF', fontSize: 12 },
  link: { color: '#22d3ee', fontWeight: '700' },
  topbarRight: { marginTop: -6 },

  hero: { color: '#FFFFFF', fontSize: 50, fontWeight: '800', marginTop: 0, letterSpacing: 0.5 },
  caption: { color: '#E4E7EC', marginTop: 12, marginBottom: 12, fontSize: 12 },
  topSpacer: { height: 16, marginTop: -230 },

  inputBox: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { flex: 1, color: '#FFFFFF', fontSize: 14, backgroundColor: 'transparent' },
  inputBoxError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },

  primaryWrap: { marginTop: 20 },
  primary: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#ffffff', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },

  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginTop: 24,
    marginBottom: 24,
  },
  continue: { color: '#E4E7EC', fontSize: 12, marginBottom: 12 },

  row: { flexDirection: 'row' },
  social: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 6,
    paddingHorizontal: 8,
  },
  socialPressed: { opacity: 0.9 },
  socialText: { color: '#ffffff', fontWeight: '600' },

  terms: { color: '#E4E7EC', fontSize: 12, marginTop: 16, lineHeight: 18 },

  copyright: {
    marginTop: 16,
    textAlign: 'center',
    color: '#98A2B3',
    fontSize: 11,
  },
});

export default styles;
