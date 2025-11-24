import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b0a2a' },
  gradient: { ...StyleSheet.absoluteFillObject },
  container: { flex: 1, alignItems: 'center' },

  topSpacer: { height: 48 },
  headerIcon: { marginTop: 0 },
  title: { color: '#FFFFFF', marginTop: 12, marginBottom: 24, fontWeight: '700' },

  radar: {
    width: '100%',
    height: 180,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  device: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  deviceInner: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerAbsolute: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute' },
  scanArcs: {
    position: 'absolute',
    width: '100%',
    height: 200,
    top: '18%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  arc: {
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 220,
    borderTopRightRadius: 220,
    borderTopWidth: 2,
    borderColor: 'rgba(255,255,255,0.32)'
  },
  arc1: { width: '75%', height: 120 },
  arc2: { width: '62%', height: 96 },
  arc3: { width: '49%', height: 72 },
  deviceImage: {
    width: 160,
    height: 160,
  }
});

export default styles;
