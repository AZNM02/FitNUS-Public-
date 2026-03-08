import { Text, View, Image, StyleSheet, Button, TextInput} from "react-native";
import { useState } from "react";
import axios from "axios";

const AddExercise = () => {
  const [ExerciseName, SetExerciseName] = useState('');
  const [ExerciseDuration, SetExerciseDuration] = useState('');
  const [Weight, Setweight] = useState('');
  const [Reps, SetReps] = useState('');
  const [Distance, SetDistance] = useState('');

  const addactivity = () => {
    console.warn('Exercise Added.');
    SetExerciseName('');
    SetExerciseDuration('');
    Setweight('');
    SetReps('');
    SetDistance('');
  }
  function exerciseadd(){
    const exerciseData ={
      name:ExerciseName,
      duration:ExerciseDuration,
      weight: Weight,
      reps: Reps,
      distance: Distance,
      
    }
      const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
      axios.post(`${apiBaseUrl}/addworkout`, exerciseData).then((res)=>console.log(res.data)).catch((e)=>console.log(e));
    console.warn('Exercise Added.');
    SetExerciseName('');
    SetExerciseDuration('');
    Setweight('');
    SetReps('');
    SetDistance('');
  }
  return (
    <View>
      <Text style = {styles.title}>Add an exercise</Text>

      <TextInput value = {ExerciseName} onChangeText = {SetExerciseName} placeholder="Exercise Name" style = {styles.input}/>
      <TextInput value = {ExerciseDuration} onChangeText = {SetExerciseDuration} placeholder="Duration/No. of Sets" style = {styles.input}/>
      <TextInput value = {Weight} onChangeText = {Setweight} placeholder="Weight (kg)" style = {styles.input}/>
      <TextInput value = {Reps} onChangeText = {SetReps} placeholder="Reps" style = {styles.input}/>
      <TextInput value = {Distance} onChangeText = {SetDistance} placeholder="Distance travelled (km)" style = {styles.input}/>
      <Button title = "Add" onPress={()=>exerciseadd()}/>
      
    </View>
  )
}

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
    marginLeft: 100,
  },
});

export default AddExercise