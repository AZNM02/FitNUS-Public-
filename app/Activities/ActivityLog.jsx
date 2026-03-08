import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet} from "react-native";
import axios from 'axios';

const ActivityLog = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
    axios.get(`${apiBaseUrl}/exercises`).then(exercises => setExercises(exercises.data)).catch((e)=>console.log(e))

   
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Log</Text>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.ExerciseItem}>
            <Text style={styles.ExerciseName}>{item.name}</Text>
            <Text style={styles.ExerciseSub}>{item.duration}</Text>
            <Text style={styles.ExerciseSub}>{item.weight}kg weight</Text>
            <Text style={styles.ExerciseSub}>{item.reps} reps</Text>
            <Text style={styles.ExerciseSub}>{item.distance} km travelled</Text>
            <Text style={styles.ExerciseSub}>Date Added: {item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ExerciseItem: {
    padding: 16,
    marginVertical: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  ExerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ExerciseSub: {
    fontSize: 14,
    color: '#555',
  },
});

export default ActivityLog;