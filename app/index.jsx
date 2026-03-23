// Disable static rendering for this route (Expo Router web fix)
export const dynamic = 'force-dynamic';
import { Text, View, Image, StyleSheet } from "react-native";
import Button from '../components/Button';
import { router } from "expo-router";
import { colors, radius, spacing } from '../constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
    padding: spacing.lg,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: spacing.lg,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 26,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginTop: spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.accentYellow,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default function Index() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/FitNUS.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Welcome to FitNUS!</Text>
      <Text style={styles.subtitle}>Your journey to fitness starts here. Let's get started!</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Start"
          handlePress={() => router.push('/Home')}
          style={styles.button}
          textStyle={styles.buttonText}
        />
      </View>
    </View>
  );
}
