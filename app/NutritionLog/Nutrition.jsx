import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useFitnessContext } from '../../context/FitnessContext';
import { colors, radius, spacing } from '../../constants/theme';

// ── Edit modal ───────────────────────────────────────────────

const EditModal = ({ item, onClose, onSave }) => {
  const [name, setName] = useState(item.name);
  const [calories, setCalories] = useState(item.calories?.toString() ?? '');
  const [protein, setProtein] = useState(item.protein > 0 ? item.protein.toString() : '');
  const [carbs, setCarbs] = useState(item.carbs > 0 ? item.carbs.toString() : '');
  const [fat, setFat] = useState(item.fat > 0 ? item.fat.toString() : '');
  const [error, setError] = useState('');

  const parseOpt = (val) => {
    if (val.trim() === '') return undefined;
    const n = parseFloat(val);
    return isNaN(n) || n < 0 ? null : n;
  };

  const handleSave = () => {
    setError('');
    if (!name.trim()) { setError('Meal name is required.'); return; }
    const cal = parseFloat(calories);
    if (calories.trim() === '' || isNaN(cal) || cal < 0) { setError('Please enter a valid calorie amount.'); return; }
    for (const [label, val] of [['Protein', protein], ['Carbs', carbs], ['Fat', fat]]) {
      if (parseOpt(val) === null) { setError(`${label} must be a valid non-negative number.`); return; }
    }
    onSave({
      name: name.trim(),
      calories: cal,
      protein: parseOpt(protein),
      carbs: parseOpt(carbs),
      fat: parseOpt(fat),
    });
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Edit Meal</Text>
          {error !== '' && <Text style={styles.error}>{error}</Text>}
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Meal Name" placeholderTextColor={colors.textMuted} />
          <TextInput style={styles.input} value={calories} onChangeText={setCalories} placeholder="Calories" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
          <TextInput style={styles.input} value={protein} onChangeText={setProtein} placeholder="Protein (g)" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
          <TextInput style={styles.input} value={carbs} onChangeText={setCarbs} placeholder="Carbs (g)" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
          <TextInput style={styles.input} value={fat} onChangeText={setFat} placeholder="Fat (g)" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={onClose}>
              <Text style={styles.modalBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleSave}>
              <Text style={styles.modalBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ── Main screen ──────────────────────────────────────────────

const Nutrition = () => {
  const { meals, isLoading, error, refreshMeals, deleteMeal, updateMeal } = useFitnessContext();
  const [editItem, setEditItem] = useState(null);
  const swipeableRefs = useRef({});

  useEffect(() => {
    refreshMeals();
  }, []);

  const handleDelete = async (id) => {
    await deleteMeal(id);
  };

  const handleSave = async (data) => {
    await updateMeal(editItem._id, data);
    setEditItem(null);
  };

  const renderRightActions = (item) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => {
        Alert.alert(
          'Delete Meal',
          `Remove "${item.name}"? This cannot be undone.`,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => swipeableRefs.current[item._id]?.close() },
            { text: 'Delete', style: 'destructive', onPress: () => handleDelete(item._id) },
          ]
        );
      }}
    >
      <Text style={styles.deleteActionText}>Delete</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accentGreen} />
      </View>
    );
  }

  const todayStr = new Date().toDateString();
  const todayMeals = meals.filter(m => new Date(m.date).toDateString() === todayStr);
  const todayTotals = todayMeals.reduce(
    (acc, m) => ({
      cal: acc.cal + (m.calories || 0),
      p: acc.p + (m.protein || 0),
      c: acc.c + (m.carbs || 0),
      f: acc.f + (m.fat || 0),
    }),
    { cal: 0, p: 0, c: 0, f: 0 }
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition Log</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      {todayMeals.length > 0 && (
        <View style={styles.todayCard}>
          <Text style={styles.todayLabel}>Today</Text>
          <Text style={styles.todayCal}>{Math.round(todayTotals.cal)} <Text style={styles.todayCalUnit}>kcal</Text></Text>
          <View style={styles.macroRow}>
            <View style={[styles.macroPill, { borderColor: colors.accentBlue + '60' }]}>
              <Text style={[styles.macroVal, { color: colors.accentBlue }]}>{Math.round(todayTotals.p)}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={[styles.macroPill, { borderColor: colors.accentYellow + '60' }]}>
              <Text style={[styles.macroVal, { color: colors.accentYellow }]}>{Math.round(todayTotals.c)}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={[styles.macroPill, { borderColor: colors.accentOrange + '60' }]}>
              <Text style={[styles.macroVal, { color: colors.accentOrange }]}>{Math.round(todayTotals.f)}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </View>
      )}

      <FlatList
        data={meals}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Swipeable
            ref={(ref) => { swipeableRefs.current[item._id] = ref; }}
            renderRightActions={() => renderRightActions(item)}
          >
            <View style={styles.mealItem}>
              <View style={styles.itemHeader}>
                <Text style={styles.mealName}>{item.name}</Text>
                <TouchableOpacity onPress={() => setEditItem(item)}>
                  <Text style={styles.editBtn}>Edit</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.mealSub}>{item.calories} kcal</Text>
              {(item.protein > 0 || item.carbs > 0 || item.fat > 0) && (
                <Text style={styles.mealSub}>
                  P {item.protein}g · C {item.carbs}g · F {item.fat}g
                </Text>
              )}
              <Text style={styles.mealSub}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
          </Swipeable>
        )}
      />

      {editItem && (
        <EditModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleSave}
        />
      )}
    </View>
  );
};

// ── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.bg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  title: { fontSize: 26, fontWeight: '800', marginBottom: spacing.md, color: colors.textPrimary },
  error: { color: colors.error, marginBottom: spacing.xs },
  mealItem: {
    padding: spacing.md,
    marginVertical: 4,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mealName: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  mealSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  editBtn: { color: colors.accentGreen, fontWeight: '600' },
  deleteAction: {
    backgroundColor: colors.deleteRed,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: 4,
    borderRadius: radius.md,
  },
  deleteActionText: { color: '#fff', fontWeight: 'bold' },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: { backgroundColor: colors.modalBg, borderRadius: radius.md, padding: 20, borderWidth: 1, borderColor: colors.cardBorder },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: spacing.sm, color: colors.textPrimary },
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.sm,
    padding: 10,
    marginBottom: spacing.xs,
    backgroundColor: colors.inputBg,
    color: colors.textPrimary,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: spacing.xs },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: radius.sm },
  cancelBtn: { backgroundColor: 'rgba(255,255,255,0.12)' },
  saveBtn: { backgroundColor: colors.accentGreen },
  modalBtnText: { color: '#1A1A1A', fontWeight: '700' },
  // Daily totals card
  todayCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  todayLabel: { fontSize: 12, fontWeight: '600', color: colors.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  todayCal: { fontSize: 36, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.sm },
  todayCalUnit: { fontSize: 16, fontWeight: '400', color: colors.textSecondary },
  macroRow: { flexDirection: 'row', gap: 8 },
  macroPill: {
    flex: 1, borderWidth: 1, borderRadius: radius.sm,
    paddingVertical: 8, paddingHorizontal: 6, alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  macroVal: { fontSize: 15, fontWeight: '700' },
  macroLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
});

export default Nutrition;
