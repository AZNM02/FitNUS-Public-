import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFitnessContext } from '../../context/FitnessContext';

const Nutrition = () => {
  const { meals, isLoading, error, refreshMeals } = useFitnessContext();

  useEffect(() => {
    refreshMeals();
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
      <Text style={styles.title}>Nutrition Log</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={meals}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text style={styles.mealName}>{item.name}</Text>
            <Text style={styles.mealSub}>{item.calories} kcal</Text>
            {(item.protein > 0 || item.carbs > 0 || item.fat > 0) && (
              <Text style={styles.mealSub}>
                P {item.protein}g · C {item.carbs}g · F {item.fat}g
              </Text>
            )}
            <Text style={styles.mealSub}>
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
  mealItem: {
    padding: 16,
    marginVertical: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealSub: {
    fontSize: 14,
    color: '#555',
  },
});

export default Nutrition;
