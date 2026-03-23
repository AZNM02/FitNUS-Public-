import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useFitnessContext } from '../../context/FitnessContext';
import { colors, radius, spacing } from '../../constants/theme';

const AddExercise = () => {
  const { addExercise } = useFitnessContext();

  const [ExerciseName, SetExerciseName] = useState('');
  const [ExerciseDuration, SetExerciseDuration] = useState('');
  const [Sets, SetSets] = useState('');
  const [Weight, Setweight] = useState('');
  const [Reps, SetReps] = useState('');
  const [Distance, SetDistance] = useState('');
  const [Notes, SetNotes] = useState('');
  const [error, setError] = useState('');

  const parseOptionalFloat = (val: string) => {
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
      { label: 'Sets', val: Sets },
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

    addExercise({
      name: ExerciseName.trim(),
      duration: parseOptionalFloat(ExerciseDuration),
      sets: parseOptionalFloat(Sets),
      weight: parseOptionalFloat(Weight),
      reps: parseOptionalFloat(Reps),
      distance: parseOptionalFloat(Distance),
      notes: Notes.trim() || undefined,
    })
      .then(() => {
        SetExerciseName('');
        SetExerciseDuration('');
        SetSets('');
        Setweight('');
        SetReps('');
        SetDistance('');
        SetNotes('');
      })
      .catch((e: any) => {
        const msg = e.response?.data?.errors?.[0]?.msg ?? e.message;
        setError(msg);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add an Exercise</Text>
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <TextInput value={ExerciseName} onChangeText={SetExerciseName} placeholder="Exercise Name" placeholderTextColor={colors.textMuted} style={styles.input} />
      <TextInput value={ExerciseDuration} onChangeText={SetExerciseDuration} placeholder="Duration (minutes)" placeholderTextColor={colors.textMuted} style={styles.input} keyboardType="numeric" />
      <TextInput value={Sets} onChangeText={SetSets} placeholder="Sets" placeholderTextColor={colors.textMuted} style={styles.input} keyboardType="numeric" />
      <TextInput value={Weight} onChangeText={Setweight} placeholder="Weight (kg)" placeholderTextColor={colors.textMuted} style={styles.input} keyboardType="numeric" />
      <TextInput value={Reps} onChangeText={SetReps} placeholder="Reps" placeholderTextColor={colors.textMuted} style={styles.input} keyboardType="numeric" />
      <TextInput value={Distance} onChangeText={SetDistance} placeholder="Distance travelled (km)" placeholderTextColor={colors.textMuted} style={styles.input} keyboardType="numeric" />
      <TextInput value={Notes} onChangeText={SetNotes} placeholder="Notes (optional)" placeholderTextColor={colors.textMuted} style={styles.input} />
      <TouchableOpacity style={styles.addBtn} onPress={exerciseadd}>
        <Text style={styles.addBtnText}>Add Exercise</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  error: {
    color: colors.error,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.sm,
    padding: 12,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
    fontSize: 15,
  },
  addBtn: {
    backgroundColor: colors.accentOrange,
    borderRadius: radius.md,
    padding: 14,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  addBtnText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AddExercise;
