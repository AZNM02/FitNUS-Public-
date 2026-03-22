import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
});

// ── Data types ──────────────────────────────────────────────

export interface Meal {
  _id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

export interface Exercise {
  _id: string;
  name: string;
  duration?: number;
  sets?: number;
  weight?: number;
  reps?: number;
  distance?: number;
  notes?: string;
  date: string;
}

export interface NewMeal {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface NewExercise {
  name: string;
  duration?: number;
  sets?: number;
  weight?: number;
  reps?: number;
  distance?: number;
  notes?: string;
}

// ── API functions ────────────────────────────────────────────

export const getMeals = (): Promise<Meal[]> =>
  api.get<Meal[]>('/meals').then((r) => r.data);

export const addMeal = (data: NewMeal): Promise<void> =>
  api.post('/addmeal', data).then(() => undefined);

export const getExercises = (): Promise<Exercise[]> =>
  api.get<Exercise[]>('/exercises').then((r) => r.data);

export const addExercise = (data: NewExercise): Promise<void> =>
  api.post('/addworkout', data).then(() => undefined);

export default api;
