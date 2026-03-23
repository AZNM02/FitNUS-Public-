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
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Exercise Name" placeholderTextColor={colors.textMuted} />
          <TextInput style={styles.input} value={duration} onChangeText={setDuration} placeholder="Duration (min)" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
          <TextInput style={styles.input} value={sets} onChangeText={setSets} placeholder="Sets" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
          <TextInput style={styles.input} value={weight} onChangeText={setWeight} placeholder="Weight (kg)" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
          <TextInput style={styles.input} value={reps} onChangeText={setReps} placeholder="Reps" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
          <TextInput style={styles.input} value={distance} onChangeText={setDistance} placeholder="Distance (km)" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
          <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="Notes (optional)" placeholderTextColor={colors.textMuted} />
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
        Alert.alert(
          'Delete Exercise',
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
        <ActivityIndicator size="large" color={colors.accentOrange} />
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
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.bg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  title: { fontSize: 26, fontWeight: '800', marginBottom: spacing.md, color: colors.textPrimary },
  error: { color: colors.error, marginBottom: spacing.xs },
  exerciseItem: {
    padding: spacing.md,
    marginVertical: 4,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exerciseName: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  exerciseSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  editBtn: { color: colors.accentOrange, fontWeight: '600' },
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
  saveBtn: { backgroundColor: colors.accentOrange },
  modalBtnText: { color: '#1A1A1A', fontWeight: '700' },
});

export default ActivityLog;
