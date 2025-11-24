import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  separator: {
    marginHorizontal: 6,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)'
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 28,
    backgroundColor: 'transparent'
  },
  btn: { padding: 12 },
});

export default styles;
