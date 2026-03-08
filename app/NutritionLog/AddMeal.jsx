import { Text, View, StyleSheet, TextInput, Button} from "react-native";
import { useState } from "react";
import axios from "axios";


const AddMeal = () => {
  const [MealName, SetMealName] = useState('');
  const [Calories, SetCalories] = useState('');

  const addameal = () => {
    console.warn('Add Meal: ',{MealName}, {Calories});
    SetMealName('');
    SetCalories('');
  }
  function mealadd(){
    const mealData ={
      name:MealName,
      calories:Calories,
      
    }
    const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
    axios.post(`${apiBaseUrl}/addmeal`, mealData).then((res)=>console.log(res.data)).catch((e)=>console.log(e));
    console.warn('Meal Added.');
    SetMealName('');
    SetCalories('');
  }
  return (
    <View>
      <Text style = {styles.title}>Add a Meal</Text>
      <TextInput value = {MealName} onChangeText = {SetMealName} placeholder="Meal Name" style = {styles.input}/>
      <TextInput value = {Calories} onChangeText = {SetCalories} placeholder="Calories" style = {styles.input}/>
      <Button title = "Add" onPress={()=>mealadd()}/>
      
    </View>
  )
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
});

export default AddMeal