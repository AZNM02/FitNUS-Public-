export const dynamic = 'force-dynamic';
import React, { useState, useCallback } from 'react';
import {
  SafeAreaView, View, Text, TouchableOpacity, Modal,
  TextInput, FlatList, StyleSheet, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { colors, radius, spacing } from '../../constants/theme';

function getWeekDays(weekOffset) {
  const days = [];
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek + weekOffset * 7);
  startOfWeek.setHours(0, 0, 0, 0);
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    days.push(d);
  }
  return days;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Schedule() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [newWorkout, setNewWorkout] = useState('');
  const [scheduledWorkouts, setScheduledWorkouts] = useState([]);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('scheduledWorkouts')
        .then(val => { setScheduledWorkouts(val ? JSON.parse(val) : []); })
        .catch(e => console.error('[Schedule] Failed to load workouts:', e));
    }, [])
  );

  const weekDays = getWeekDays(weekOffset);

  const workoutsForDay = scheduledWorkouts
    .map((w, i) => ({ ...w, _idx: i }))
    .filter(w => new Date(w.date).toDateString() === selectedDate.toDateString());

  const addWorkout = () => {
    if (!newWorkout.trim()) return;
    const updated = [...scheduledWorkouts, { name: newWorkout.trim(), date: selectedDate.toISOString() }];
    setScheduledWorkouts(updated);
    AsyncStorage.setItem('scheduledWorkouts', JSON.stringify(updated)).catch(e => console.error('[Schedule] Failed to save workouts:', e));
    setNewWorkout('');
    setModalVisible(false);
  };

  const deleteWorkout = (idx) => {
    const updated = scheduledWorkouts.filter((_, i) => i !== idx);
    setScheduledWorkouts(updated);
    AsyncStorage.setItem('scheduledWorkouts', JSON.stringify(updated)).catch(e => console.error('[Schedule] Failed to save workouts:', e));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.container}>
        <Text style={styles.title}>Workout Schedule</Text>

        {/* Week navigation */}
        <View style={styles.weekNav}>
          <TouchableOpacity onPress={() => setWeekOffset(w => w - 1)} style={styles.navBtn}>
            <Text style={styles.navBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.weekLabel}>
            {weekDays[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            {' – '}
            {weekDays[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => setWeekOffset(w => w + 1)} style={styles.navBtn}>
            <Text style={styles.navBtnText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Day selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayRow}>
          {weekDays.map((day, i) => {
            const isActive = day.toDateString() === selectedDate.toDateString();
            return (
              <TouchableOpacity
                key={i}
                style={[styles.dayCell, isActive && styles.dayCellActive]}
                onPress={() => setSelectedDate(day)}>
                <Text style={[styles.dayName, isActive && styles.dayTextActive]}>
                  {DAY_NAMES[day.getDay()]}
                </Text>
                <Text style={[styles.dayNum, isActive && styles.dayTextActive]}>
                  {day.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Workouts for selected day */}
        <Text style={styles.subtitle}>{selectedDate.toDateString()}</Text>
        <View style={styles.listContainer}>
          {workoutsForDay.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No workouts scheduled</Text>
            </View>
          ) : (
            <FlatList
              data={workoutsForDay}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({ item }) => (
                <View style={styles.workoutItem}>
                  <Text style={styles.workoutName}>{item.name}</Text>
                  <TouchableOpacity onPress={() => deleteWorkout(item._idx)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text style={styles.workoutDeleteBtn}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Schedule Workout</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add Workout</Text>
            <TextInput
              style={styles.input}
              placeholder="Workout name"
              placeholderTextColor={colors.textMuted}
              value={newWorkout}
              onChangeText={setNewWorkout}
            />
            <TouchableOpacity style={styles.modalAddBtn} onPress={addWorkout}>
              <Text style={styles.modalAddBtnText}>Add</Text>
            </TouchableOpacity>
            <View style={{ height: 8 }} />
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.md, backgroundColor: colors.bg },
  title: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.md },
  weekNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  navBtn: { padding: 8 },
  navBtnText: { fontSize: 28, color: colors.accentBlue },
  weekLabel: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
  dayRow: { flexDirection: 'row', marginBottom: spacing.md },
  dayCell: {
    width: 44, alignItems: 'center', paddingVertical: 8,
    marginHorizontal: 3, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  dayCellActive: { backgroundColor: colors.accentBlue, borderColor: colors.accentBlue },
  dayName: { fontSize: 12, color: colors.textSecondary },
  dayNum: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  dayTextActive: { color: '#1A1A1A' },
  subtitle: { fontSize: 14, fontWeight: '600', color: colors.textMuted, marginBottom: spacing.xs },
  listContainer: { flex: 1 },
  empty: {
    borderWidth: 1, borderColor: colors.cardBorder, borderStyle: 'dashed',
    borderRadius: radius.sm, padding: 20, alignItems: 'center',
  },
  emptyText: { color: colors.textMuted },
  workoutItem: {
    padding: 12, marginBottom: 8, borderRadius: radius.sm,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  workoutName: { fontSize: 15, color: colors.accentPurple, fontWeight: '600', flex: 1 },
  workoutDeleteBtn: { color: colors.deleteRed, fontSize: 15, fontWeight: '700', marginLeft: 8 },
  addBtn: {
    backgroundColor: colors.accentPurple, padding: 14,
    borderRadius: radius.md, alignItems: 'center', marginTop: spacing.sm,
  },
  addBtnText: { color: '#1A1A1A', fontSize: 16, fontWeight: '700' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modal: {
    width: '80%', backgroundColor: colors.modalBg, borderRadius: radius.md,
    padding: spacing.lg, borderWidth: 1, borderColor: colors.cardBorder,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: spacing.sm, color: colors.textPrimary },
  input: {
    borderWidth: 1, borderColor: colors.inputBorder, borderRadius: radius.sm,
    padding: 10, marginBottom: spacing.sm, fontSize: 15,
    backgroundColor: colors.inputBg, color: colors.textPrimary,
  },
  modalAddBtn: {
    backgroundColor: colors.accentPurple, borderRadius: radius.sm,
    padding: 12, alignItems: 'center',
  },
  modalAddBtnText: { color: '#1A1A1A', fontWeight: '700', fontSize: 15 },
  modalCancelBtn: {
    backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: radius.sm,
    padding: 12, alignItems: 'center',
  },
  modalCancelBtnText: { color: colors.textSecondary, fontWeight: '600', fontSize: 15 },
});
