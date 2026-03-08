// Disable static rendering for this route (Expo Router web fix)
export const dynamic = 'force-dynamic';
import { Text, View, Image, StyleSheet } from "react-native";
import Button from '../components/Button';
import { router } from "expo-router";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
