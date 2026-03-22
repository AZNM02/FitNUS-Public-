import { Text, View, StyleSheet, Button, TextInput } from "react-native";
import { useState } from "react";
import axios from "axios";

const AddExercise = () => {
  const [ExerciseName, SetExerciseName] = useState('');
  const [ExerciseDuration, SetExerciseDuration] = useState('');
  const [Weight, Setweight] = useState('');
  const [Reps, SetReps] = useState('');
  const [Distance, SetDistance] = useState('');
  const [error, setError] = useState('');

  const parseOptionalFloat = (val) => {
    if (val.trim() === '') return undefined;
    const n = parseFloat(val);
    return isNaN(n) || n < 0 ? null : n;
  };

  function exerciseadd() {
    setError('');
    if (!ExerciseName.trim()) {
      setError('Exercise name is required.');
      return;
    }
    const numericFields = [
      { label: 'Duration', val: ExerciseDuration },
      { label: 'Weight', val: Weight },
      { label: 'Reps', val: Reps },
      { label: 'Distance', val: Distance },
    ];
    for (const field of numericFields) {
      if (parseOptionalFloat(field.val) === null) {
        setError(`${field.label} must be a valid non-negative number.`);
        return;
      }
    }

    const exerciseData = {
      name: ExerciseName.trim(),
      duration: parseOptionalFloat(ExerciseDuration),
      weight: parseOptionalFloat(Weight),
      reps: parseOptionalFloat(Reps),
      distance: parseOptionalFloat(Distance),
    };

    const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
    axios
      .post(`${apiBaseUrl}/addworkout`, exerciseData)
      .then(() => {
        SetExerciseName('');
        SetExerciseDuration('');
        Setweight('');
        SetReps('');
        SetDistance('');
      })
      .catch((e) => {
        const msg = e.response?.data?.errors?.[0]?.msg || e.message;
        setError(msg);
      });
  }

  return (
    <View>
      <Text style={styles.title}>Add an exercise</Text>
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <TextInput value={ExerciseName} onChangeText={SetExerciseName} placeholder="Exercise Name" style={styles.input} />
      <TextInput value={ExerciseDuration} onChangeText={SetExerciseDuration} placeholder="Duration (minutes)" style={styles.input} keyboardType="numeric" />
      <TextInput value={Weight} onChangeText={Setweight} placeholder="Weight (kg)" style={styles.input} keyboardType="numeric" />
      <TextInput value={Reps} onChangeText={SetReps} placeholder="Reps" style={styles.input} keyboardType="numeric" />
      <TextInput value={Distance} onChangeText={SetDistance} placeholder="Distance travelled (km)" style={styles.input} keyboardType="numeric" />
      <Button title="Add" onPress={exerciseadd} />
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
    marginLeft: 100,
  },
  error: {
    color: 'red',
    marginHorizontal: 12,
    marginBottom: 4,
  },
});

export default AddExercise;
