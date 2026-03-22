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

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}

// ── Meals ────────────────────────────────────────────────────

export const getMeals = (page = 1, limit = 50): Promise<Meal[]> =>
  api
    .get<PaginatedResponse<Meal>>(`/meals?page=${page}&limit=${limit}`)
    .then((r) => r.data.data);

export const addMeal = (data: NewMeal): Promise<void> =>
  api.post('/addmeal', data).then(() => undefined);

export const updateMeal = (id: string, data: Partial<NewMeal>): Promise<Meal> =>
  api.put<Meal>(`/meals/${id}`, data).then((r) => r.data);

export const deleteMeal = (id: string): Promise<void> =>
  api.delete(`/meals/${id}`).then(() => undefined);

// ── Exercises ────────────────────────────────────────────────

export const getExercises = (page = 1, limit = 50): Promise<Exercise[]> =>
  api
    .get<PaginatedResponse<Exercise>>(`/exercises?page=${page}&limit=${limit}`)
    .then((r) => r.data.data);

export const addExercise = (data: NewExercise): Promise<void> =>
  api.post('/addworkout', data).then(() => undefined);

export const updateExercise = (id: string, data: Partial<NewExercise>): Promise<Exercise> =>
  api.put<Exercise>(`/exercises/${id}`, data).then((r) => r.data);

export const deleteExercise = (id: string): Promise<void> =>
  api.delete(`/exercises/${id}`).then(() => undefined);

export default api;
