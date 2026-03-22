jest.mock('axios', () => ({
  create: jest.fn().mockReturnValue({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }),
}));

import axios from 'axios';
import { addMeal, addExercise, deleteMeal, deleteExercise, getMeals, getExercises, updateMeal } from '../api';

// api.ts calls axios.create() once at module load time — capture that instance.
// We do this in beforeAll to avoid running before module initialization.
let instance: {
  get: jest.Mock;
  post: jest.Mock;
  put: jest.Mock;
  delete: jest.Mock;
};

beforeAll(() => {
  instance = (axios.create as jest.Mock).mock.results[0].value;
});

beforeEach(() => {
  // Clear only the HTTP method mocks — NOT jest.clearAllMocks(), which would
  // wipe mock.results and break the instance lookup above.
  instance.get.mockClear();
  instance.post.mockClear();
  instance.put.mockClear();
  instance.delete.mockClear();
});

// ── addMeal ──────────────────────────────────────────────────

describe('addMeal', () => {
  it('POSTs to /addmeal with the correct payload', async () => {
    instance.post.mockResolvedValueOnce({ data: {} });
    await addMeal({ name: 'Oats', calories: 350 });
    expect(instance.post).toHaveBeenCalledWith('/addmeal', { name: 'Oats', calories: 350 });
  });

  it('includes optional macro fields when provided', async () => {
    instance.post.mockResolvedValueOnce({ data: {} });
    await addMeal({ name: 'Salmon', calories: 300, protein: 25, carbs: 0, fat: 15 });
    expect(instance.post).toHaveBeenCalledWith('/addmeal', {
      name: 'Salmon', calories: 300, protein: 25, carbs: 0, fat: 15,
    });
  });
});

// ── addExercise ──────────────────────────────────────────────

describe('addExercise', () => {
  it('POSTs to /addworkout with the correct payload', async () => {
    instance.post.mockResolvedValueOnce({ data: {} });
    await addExercise({ name: 'Bench Press', weight: 80, reps: 10 });
    expect(instance.post).toHaveBeenCalledWith('/addworkout', { name: 'Bench Press', weight: 80, reps: 10 });
  });
});

// ── getMeals ─────────────────────────────────────────────────

describe('getMeals', () => {
  it('GETs /meals with default pagination and returns the data array', async () => {
    const mockData = [{ _id: '1', name: 'Rice', calories: 300, protein: 0, carbs: 0, fat: 0, date: '' }];
    instance.get.mockResolvedValueOnce({ data: { data: mockData, total: 1, page: 1, pages: 1 } });
    const result = await getMeals();
    expect(instance.get).toHaveBeenCalledWith('/meals?page=1&limit=50');
    expect(result).toEqual(mockData);
  });

  it('passes custom page and limit params', async () => {
    instance.get.mockResolvedValueOnce({ data: { data: [], total: 0, page: 2, pages: 5 } });
    await getMeals(2, 10);
    expect(instance.get).toHaveBeenCalledWith('/meals?page=2&limit=10');
  });
});

// ── getExercises ─────────────────────────────────────────────

describe('getExercises', () => {
  it('GETs /exercises with default pagination and returns the data array', async () => {
    instance.get.mockResolvedValueOnce({ data: { data: [], total: 0, page: 1, pages: 1 } });
    const result = await getExercises();
    expect(instance.get).toHaveBeenCalledWith('/exercises?page=1&limit=50');
    expect(result).toEqual([]);
  });
});

// ── updateMeal ───────────────────────────────────────────────

describe('updateMeal', () => {
  it('PUTs to /meals/:id with the patch data and returns the updated document', async () => {
    const updated = { _id: 'abc', name: 'Rice', calories: 400, protein: 0, carbs: 0, fat: 0, date: '' };
    instance.put.mockResolvedValueOnce({ data: updated });
    const result = await updateMeal('abc', { calories: 400 });
    expect(instance.put).toHaveBeenCalledWith('/meals/abc', { calories: 400 });
    expect(result).toEqual(updated);
  });
});

// ── deleteMeal ───────────────────────────────────────────────

describe('deleteMeal', () => {
  it('sends DELETE to /meals/:id', async () => {
    instance.delete.mockResolvedValueOnce({ data: { status: 'ok' } });
    await deleteMeal('abc123');
    expect(instance.delete).toHaveBeenCalledWith('/meals/abc123');
  });
});

// ── deleteExercise ───────────────────────────────────────────

describe('deleteExercise', () => {
  it('sends DELETE to /exercises/:id', async () => {
    instance.delete.mockResolvedValueOnce({ data: { status: 'ok' } });
    await deleteExercise('xyz789');
    expect(instance.delete).toHaveBeenCalledWith('/exercises/xyz789');
  });
});
