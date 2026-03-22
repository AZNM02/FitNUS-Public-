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
  const [duration, setDuration] = useState(item.duration?.toString() ?? '');
  const [sets, setSets] = useState(item.sets?.toString() ?? '');
  const [weight, setWeight] = useState(item.weight?.toString() ?? '');
  const [reps, setReps] = useState(item.reps?.toString() ?? '');
  const [distance, setDistance] = useState(item.distance?.toString() ?? '');
  const [notes, setNotes] = useState(item.notes ?? '');
  const [error, setError] = useState('');

  const parseOpt = (val) => {
    if (val.trim() === '') return undefined;
    const n = parseFloat(val);
    return isNaN(n) || n < 0 ? null : n;
  };

  const handleSave = () => {
    setError('');
    if (!name.trim()) { setError('Exercise name is required.'); return; }
    const fields = [
      { label: 'Duration', val: duration },
      { label: 'Sets', val: sets },
      { label: 'Weight', val: weight },
      { label: 'Reps', val: reps },
      { label: 'Distance', val: distance },
    ];
    for (const f of fields) {
      if (parseOpt(f.val) === null) { setError(`${f.label} must be a valid non-negative number.`); return; }
    }
    onSave({
      name: name.trim(),
      duration: parseOpt(duration),
      sets: parseOpt(sets),
      weight: parseOpt(weight),
      reps: parseOpt(reps),
      distance: parseOpt(distance),
      notes: notes.trim() || undefined,
    });
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Edit Exercise</Text>
          {error !== '' && <Text style={styles.error}>{error}</Text>}
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Exercise Name" />
          <TextInput style={styles.input} value={duration} onChangeText={setDuration} placeholder="Duration (min)" keyboardType="numeric" />
          <TextInput style={styles.input} value={sets} onChangeText={setSets} placeholder="Sets" keyboardType="numeric" />
          <TextInput style={styles.input} value={weight} onChangeText={setWeight} placeholder="Weight (kg)" keyboardType="numeric" />
          <TextInput style={styles.input} value={reps} onChangeText={setReps} placeholder="Reps" keyboardType="numeric" />
          <TextInput style={styles.input} value={distance} onChangeText={setDistance} placeholder="Distance (km)" keyboardType="numeric" />
          <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="Notes (optional)" />
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

const ActivityLog = () => {
  const { exercises, isLoading, error, refreshExercises, deleteExercise, updateExercise } =
    useFitnessContext();
  const [editItem, setEditItem] = useState(null);
  const swipeableRefs = useRef({});

  useEffect(() => {
    refreshExercises();
  }, []);

  const handleDelete = async (id) => {
    await deleteExercise(id);
  };

  const handleSave = async (data) => {
    await updateExercise(editItem._id, data);
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
      <Text style={styles.title}>Activity Log</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={exercises}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Swipeable
            ref={(ref) => { swipeableRefs.current[item._id] = ref; }}
            renderRightActions={() => renderRightActions(item)}
          >
            <View style={styles.exerciseItem}>
              <View style={styles.itemHeader}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <TouchableOpacity onPress={() => setEditItem(item)}>
                  <Text style={styles.editBtn}>Edit</Text>
                </TouchableOpacity>
              </View>
              {item.duration != null && <Text style={styles.exerciseSub}>{item.duration} min</Text>}
              {item.sets != null && <Text style={styles.exerciseSub}>{item.sets} sets</Text>}
              {item.weight != null && <Text style={styles.exerciseSub}>{item.weight} kg</Text>}
              {item.reps != null && <Text style={styles.exerciseSub}>{item.reps} reps</Text>}
              {item.distance != null && <Text style={styles.exerciseSub}>{item.distance} km</Text>}
              {item.notes && <Text style={styles.exerciseSub}>{item.notes}</Text>}
              <Text style={styles.exerciseSub}>{new Date(item.date).toLocaleDateString()}</Text>
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
  exerciseItem: {
    padding: 16,
    marginVertical: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exerciseName: { fontSize: 18, fontWeight: 'bold' },
  exerciseSub: { fontSize: 14, color: '#555' },
  editBtn: { color: '#474eff', fontWeight: '600' },
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
  saveBtn: { backgroundColor: '#474eff' },
  modalBtnText: { color: '#fff', fontWeight: '600' },
});

export default ActivityLog;
