import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet} from "react-native";
import axios from 'axios';

const Nutrition = () => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
    axios.get(`${apiBaseUrl}/meals`).then(meals => setMeals(meals.data)).catch((e)=>console.log(e))

   
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition Log</Text>
      <FlatList
        data={meals}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text style={styles.mealName}>{item.name}</Text>
            <Text style={styles.mealCalories}>{item.calories} calories</Text>
            <Text style={styles.mealCalories}>Date Added: {item.date} </Text>
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
  mealCalories: {
    fontSize: 16,
    color: '#555',
  },
});

export default Nutrition;