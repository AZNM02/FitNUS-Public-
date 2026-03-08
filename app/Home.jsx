// Disable static rendering for this route (Expo Router web fix)
export const dynamic = 'force-dynamic';
import { Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import Button from "@/components/Button";

function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome! What would you like to do today?</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Activity Log"
          handlePress={() => router.push('/Activity')}
          style={[styles.button, styles.activityButton]}
          textStyle={styles.buttonText}
        />
        <Button
          title="Nutrition Log"
          handlePress={() => router.push('/Nutrition')}
          style={[styles.button, styles.nutritionButton]}
          textStyle={styles.buttonText}
        />
        <Button
          title="Nearest Gyms"
          handlePress={() => router.push('/GymFinder/Gymfinder')}
          style={[styles.button, styles.gymButton]}
          textStyle={styles.buttonText}
        />
        <Button
          title="Workout Schedule"
          handlePress={() => router.push('/Schedule/Schedule')}
          style={[styles.button, styles.scheduleButton]}
          textStyle={styles.buttonText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20,
    width: '85%',
    alignItems: 'center',
  },
  activityButton: {
    backgroundColor: '#ff7043',
  },
  nutritionButton: {
    backgroundColor: '#66bb6a',
  },
  gymButton: {
    backgroundColor: '#42a5f5',
  },
  scheduleButton: {
    backgroundColor: '#ab47bc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default Home;
