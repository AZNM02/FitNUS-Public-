import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFitnessContext } from '../../context/FitnessContext';

const ActivityLog = () => {
  const { exercises, isLoading, error, refreshExercises } = useFitnessContext();

  useEffect(() => {
    refreshExercises();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Log</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            {item.duration != null && <Text style={styles.exerciseSub}>{item.duration} min</Text>}
            {item.weight != null && <Text style={styles.exerciseSub}>{item.weight} kg</Text>}
            {item.reps != null && <Text style={styles.exerciseSub}>{item.reps} reps</Text>}
            {item.distance != null && <Text style={styles.exerciseSub}>{item.distance} km</Text>}
            {item.notes && <Text style={styles.exerciseSub}>{item.notes}</Text>}
            <Text style={styles.exerciseSub}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  exerciseItem: {
    padding: 16,
    marginVertical: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseSub: {
    fontSize: 14,
    color: '#555',
  },
});

export default ActivityLog;
