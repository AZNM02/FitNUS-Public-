import { Text, View, StyleSheet, TextInput, Button } from "react-native";
import { useState } from "react";
import axios from "axios";

const AddMeal = () => {
  const [MealName, SetMealName] = useState('');
  const [Calories, SetCalories] = useState('');
  const [error, setError] = useState('');

  function mealadd() {
    setError('');
    if (!MealName.trim()) {
      setError('Meal name is required.');
      return;
    }
    const cal = parseFloat(Calories);
    if (Calories.trim() === '' || isNaN(cal) || cal < 0) {
      setError('Please enter a valid calorie amount.');
      return;
    }

    const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
    axios
      .post(`${apiBaseUrl}/addmeal`, { name: MealName.trim(), calories: cal })
      .then(() => {
        SetMealName('');
        SetCalories('');
      })
      .catch((e) => {
        const msg = e.response?.data?.errors?.[0]?.msg || e.message;
        setError(msg);
      });
  }

  return (
    <View>
      <Text style={styles.title}>Add a Meal</Text>
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <TextInput
        value={MealName}
        onChangeText={SetMealName}
        placeholder="Meal Name"
        style={styles.input}
      />
      <TextInput
        value={Calories}
        onChangeText={SetCalories}
        placeholder="Calories"
        style={styles.input}
        keyboardType="numeric"
      />
      <Button title="Add" onPress={mealadd} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 130,
  },
  error: {
    color: 'red',
    marginHorizontal: 12,
    marginBottom: 4,
  },
});

export default AddMeal;
