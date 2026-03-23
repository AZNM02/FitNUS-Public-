import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useFitnessContext } from '../../context/FitnessContext';
import { colors, radius, spacing } from '../../constants/theme';

const AddMeal = () => {
  const { addMeal } = useFitnessContext();

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

    addMeal({ name: MealName.trim(), calories: cal })
      .then(() => {
        SetMealName('');
        SetCalories('');
      })
      .catch((e: any) => {
        const msg = e.response?.data?.errors?.[0]?.msg ?? e.message;
        setError(msg);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Meal</Text>
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <TextInput
        value={MealName}
        onChangeText={SetMealName}
        placeholder="Meal Name"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
      />
      <TextInput
        value={Calories}
        onChangeText={SetCalories}
        placeholder="Calories"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.addBtn} onPress={mealadd}>
        <Text style={styles.addBtnText}>Add Meal</Text>
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
    backgroundColor: colors.accentGreen,
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

export default AddMeal;
