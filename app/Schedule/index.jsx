export const dynamic = 'force-dynamic';
import React, { useState, useCallback } from 'react';
import {
  SafeAreaView, View, Text, TouchableOpacity, Modal,
  TextInput, Button, FlatList, StyleSheet, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

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

  // Reload from storage every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('scheduledWorkouts')
        .then(val => { setScheduledWorkouts(val ? JSON.parse(val) : []); })
        .catch(e => console.error('[Schedule] Failed to load workouts:', e));
    }, [])
  );

  const weekDays = getWeekDays(weekOffset);

  const workoutsForDay = scheduledWorkouts.filter(w => {
    const d = new Date(w.date);
    return d.toDateString() === selectedDate.toDateString();
  });

  const addWorkout = () => {
    if (!newWorkout.trim()) return;
    const updated = [...scheduledWorkouts, { name: newWorkout.trim(), date: selectedDate.toISOString() }];
    setScheduledWorkouts(updated);
    AsyncStorage.setItem('scheduledWorkouts', JSON.stringify(updated)).catch(e => console.error('[Schedule] Failed to save workouts:', e));
    setNewWorkout('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
              value={newWorkout}
              onChangeText={setNewWorkout}
            />
            <Button title="Add" onPress={addWorkout} />
            <View style={{ height: 8 }} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingVertical: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#1d1d1d', marginBottom: 16 },
  weekNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  navBtn: { padding: 8 },
  navBtnText: { fontSize: 28, color: '#007aff' },
  weekLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
  dayRow: { flexDirection: 'row', marginBottom: 16 },
  dayCell: {
    width: 44, alignItems: 'center', paddingVertical: 8,
    marginHorizontal: 3, borderRadius: 10, borderWidth: 1, borderColor: '#e3e3e3',
  },
  dayCellActive: { backgroundColor: '#111', borderColor: '#111' },
  dayName: { fontSize: 12, color: '#888' },
  dayNum: { fontSize: 16, fontWeight: '600', color: '#111' },
  dayTextActive: { color: '#fff' },
  subtitle: { fontSize: 15, fontWeight: '600', color: '#999', marginBottom: 8 },
  listContainer: { flex: 1 },
  empty: {
    borderWidth: 1, borderColor: '#e5e7eb', borderStyle: 'dashed',
    borderRadius: 9, padding: 20, alignItems: 'center',
  },
  emptyText: { color: '#aaa' },
  workoutItem: {
    padding: 12, marginBottom: 8, borderRadius: 8,
    backgroundColor: '#f0f4ff', borderWidth: 1, borderColor: '#c7d2fe',
  },
  workoutName: { fontSize: 16, color: '#1e40af' },
  addBtn: {
    backgroundColor: '#007aff', padding: 14,
    borderRadius: 10, alignItems: 'center', marginTop: 12,
  },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modal: {
    width: '80%', backgroundColor: '#fff', borderRadius: 16,
    padding: 24, elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 12, fontSize: 15,
  },
});
