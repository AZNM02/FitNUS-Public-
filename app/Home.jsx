// Disable static rendering for this route (Expo Router web fix)
export const dynamic = 'force-dynamic';
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing } from '../constants/theme';

const features = [
  {
    title: 'Activity Log',
    emoji: '🏋️',
    accent: colors.accentOrange,
    route: '/Activities',
  },
  {
    title: 'Nutrition Log',
    emoji: '🥗',
    accent: colors.accentGreen,
    route: '/NutritionLog',
  },
  {
    title: 'Nearest Gyms',
    emoji: '📍',
    accent: colors.accentBlue,
    route: '/Gymfinder',
  },
  {
    title: 'Workout Schedule',
    emoji: '📅',
    accent: colors.accentPurple,
    route: '/Schedule',
  },
];

function FeatureCard({ title, emoji, accent, route }) {
  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: accent + '40' }]}
      onPress={() => router.push(route)}
      activeOpacity={0.75}
    >
      <View style={[styles.iconCircle, { backgroundColor: accent + '22' }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={[styles.accentDot, { backgroundColor: accent }]} />
    </TouchableOpacity>
  );
}

function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FitNUS</Text>
      <Text style={styles.subtitle}>What would you like to do today?</Text>
      <View style={styles.grid}>
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 36,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    width: '47%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 165,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  emoji: {
    fontSize: 26,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    flexShrink: 1,
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
});

export default Home;
