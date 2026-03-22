import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  addExercise as apiAddExercise,
  addMeal as apiAddMeal,
  deleteExercise as apiDeleteExercise,
  deleteMeal as apiDeleteMeal,
  Exercise,
  getExercises,
  getMeals,
  Meal,
  NewExercise,
  NewMeal,
  updateExercise as apiUpdateExercise,
  updateMeal as apiUpdateMeal,
} from '../services/api';

interface FitnessContextType {
  meals: Meal[];
  exercises: Exercise[];
  isLoading: boolean;
  error: string | null;
  refreshMeals: () => Promise<void>;
  refreshExercises: () => Promise<void>;
  addMeal: (data: NewMeal) => Promise<void>;
  addExercise: (data: NewExercise) => Promise<void>;
  updateMeal: (id: string, data: Partial<NewMeal>) => Promise<void>;
  updateExercise: (id: string, data: Partial<NewExercise>) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
}

const FitnessContext = createContext<FitnessContextType | null>(null);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshMeals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setMeals(await getMeals());
    } catch (e: any) {
      setError(e.message ?? 'Failed to load meals.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshExercises = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setExercises(await getExercises());
    } catch (e: any) {
      setError(e.message ?? 'Failed to load exercises.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addMeal = useCallback(
    async (data: NewMeal) => {
      await apiAddMeal(data);
      await refreshMeals();
    },
    [refreshMeals]
  );

  const addExercise = useCallback(
    async (data: NewExercise) => {
      await apiAddExercise(data);
      await refreshExercises();
    },
    [refreshExercises]
  );

  const updateMeal = useCallback(
    async (id: string, data: Partial<NewMeal>) => {
      await apiUpdateMeal(id, data);
      await refreshMeals();
    },
    [refreshMeals]
  );

  const updateExercise = useCallback(
    async (id: string, data: Partial<NewExercise>) => {
      await apiUpdateExercise(id, data);
      await refreshExercises();
    },
    [refreshExercises]
  );

  const deleteMeal = useCallback(
    async (id: string) => {
      await apiDeleteMeal(id);
      setMeals((prev) => prev.filter((m) => m._id !== id));
    },
    []
  );

  const deleteExercise = useCallback(
    async (id: string) => {
      await apiDeleteExercise(id);
      setExercises((prev) => prev.filter((e) => e._id !== id));
    },
    []
  );

  return (
    <FitnessContext.Provider
      value={{
        meals,
        exercises,
        isLoading,
        error,
        refreshMeals,
        refreshExercises,
        addMeal,
        addExercise,
        updateMeal,
        updateExercise,
        deleteMeal,
        deleteExercise,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitnessContext = (): FitnessContextType => {
  const ctx = useContext(FitnessContext);
  if (!ctx) throw new Error('useFitnessContext must be used within a FitnessProvider');
  return ctx;
};
