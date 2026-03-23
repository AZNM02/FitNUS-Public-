import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

/**
 * FitNUS logo built entirely from React Native primitives.
 * No image file — renders cleanly on any background.
 */
export default function FitNUSLogo({ size = 130 }) {
  const scale = size / 130;

  const s = (n) => Math.round(n * scale);

  return (
    <View style={[styles.wrapper, { width: size, height: size, borderRadius: size / 2 }]}>
      {/* Outer glow ring */}
      <View
        style={[
          styles.ring,
          {
            width: size - s(6),
            height: size - s(6),
            borderRadius: (size - s(6)) / 2,
          },
        ]}
      />

      {/* Dumbbell icon */}
      <View style={styles.dumbbell}>
        {/* Left weight */}
        <View style={[styles.weightOuter, { width: s(18), height: s(46), borderRadius: s(7) }]}>
          <View style={[styles.weightInner, { width: s(10), height: s(34), borderRadius: s(4) }]} />
        </View>

        {/* Bar */}
        <View style={[styles.bar, { width: s(38), height: s(8), borderRadius: s(4) }]} />

        {/* Right weight */}
        <View style={[styles.weightOuter, { width: s(18), height: s(46), borderRadius: s(7) }]}>
          <View style={[styles.weightInner, { width: s(10), height: s(34), borderRadius: s(4) }]} />
        </View>
      </View>

      {/* Wordmark */}
      <Text style={[styles.wordmark, { fontSize: s(18), letterSpacing: s(2) }]}>
        FitNUS
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(245, 213, 71, 0.10)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(245, 213, 71, 0.45)',
  },
  dumbbell: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  weightOuter: {
    backgroundColor: colors.accentYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weightInner: {
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  bar: {
    backgroundColor: colors.accentYellow,
    opacity: 0.85,
  },
  wordmark: {
    color: colors.accentYellow,
    fontWeight: '800',
  },
});
