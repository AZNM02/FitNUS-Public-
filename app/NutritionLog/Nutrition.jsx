import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
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
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Meal Name" />
          <TextInput style={styles.input} value={calories} onChangeText={setCalories} placeholder="Calories" keyboardType="numeric" />
          <TextInput style={styles.input} value={protein} onChangeText={setProtein} placeholder="Protein (g)" keyboardType="numeric" />
          <TextInput style={styles.input} value={carbs} onChangeText={setCarbs} placeholder="Carbs (g)" keyboardType="numeric" />
          <TextInput style={styles.input} value={fat} onChangeText={setFat} placeholder="Fat (g)" keyboardType="numeric" />
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
        swipeableRefs.current[item._id]?.close();
        handleDelete(item._id);
      }}
    >
      <Text style={styles.deleteActionText}>Delete</Text>
    </TouchableOpacity>
  );

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
  container: { flex: 1, padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  error: { color: 'red', marginBottom: 8 },
  mealItem: {
    padding: 16,
    marginVertical: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mealName: { fontSize: 18, fontWeight: 'bold' },
  mealSub: { fontSize: 14, color: '#555' },
  editBtn: { color: '#66bb6a', fontWeight: '600' },
  deleteAction: {
    backgroundColor: '#e53935',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: 4,
    borderRadius: 8,
  },
  deleteActionText: { color: '#fff', fontWeight: 'bold' },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 8 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  cancelBtn: { backgroundColor: '#9e9e9e' },
  saveBtn: { backgroundColor: '#66bb6a' },
  modalBtnText: { color: '#fff', fontWeight: '600' },
});

export default Nutrition;
