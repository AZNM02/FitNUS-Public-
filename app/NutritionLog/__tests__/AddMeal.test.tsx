import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddMeal from '../AddMeal';

const mockAddMeal = jest.fn().mockResolvedValue(undefined);

jest.mock('../../../context/FitnessContext', () => ({
  useFitnessContext: () => ({ addMeal: mockAddMeal }),
}));

beforeEach(() => {
  mockAddMeal.mockClear();
});

describe('AddMeal form', () => {
  it('renders name and calorie inputs', () => {
    const { getByPlaceholderText } = render(<AddMeal />);
    expect(getByPlaceholderText('Meal Name')).toBeTruthy();
    expect(getByPlaceholderText('Calories')).toBeTruthy();
  });

  it('shows an error when name is empty on submit', () => {
    const { getByText } = render(<AddMeal />);
    fireEvent.press(getByText('Add'));
    expect(getByText('Meal name is required.')).toBeTruthy();
  });

  it('shows an error for non-numeric calories', () => {
    const { getByText, getByPlaceholderText } = render(<AddMeal />);
    fireEvent.changeText(getByPlaceholderText('Meal Name'), 'Rice');
    fireEvent.changeText(getByPlaceholderText('Calories'), 'abc');
    fireEvent.press(getByText('Add'));
    expect(getByText('Please enter a valid calorie amount.')).toBeTruthy();
  });

  it('shows an error for negative calories', () => {
    const { getByText, getByPlaceholderText } = render(<AddMeal />);
    fireEvent.changeText(getByPlaceholderText('Meal Name'), 'Rice');
    fireEvent.changeText(getByPlaceholderText('Calories'), '-50');
    fireEvent.press(getByText('Add'));
    expect(getByText('Please enter a valid calorie amount.')).toBeTruthy();
  });

  it('calls addMeal with correct data on valid submit', async () => {
    const { getByText, getByPlaceholderText } = render(<AddMeal />);
    fireEvent.changeText(getByPlaceholderText('Meal Name'), 'Chicken Rice');
    fireEvent.changeText(getByPlaceholderText('Calories'), '450');
    fireEvent.press(getByText('Add'));
    await waitFor(() => {
      expect(mockAddMeal).toHaveBeenCalledWith({ name: 'Chicken Rice', calories: 450 });
    });
  });

  it('trims whitespace from the meal name before submitting', async () => {
    const { getByText, getByPlaceholderText } = render(<AddMeal />);
    fireEvent.changeText(getByPlaceholderText('Meal Name'), '  Oats  ');
    fireEvent.changeText(getByPlaceholderText('Calories'), '300');
    fireEvent.press(getByText('Add'));
    await waitFor(() => {
      expect(mockAddMeal).toHaveBeenCalledWith({ name: 'Oats', calories: 300 });
    });
  });

  it('clears the form fields after a successful submit', async () => {
    const { getByText, getByPlaceholderText } = render(<AddMeal />);
    const nameInput = getByPlaceholderText('Meal Name');
    const calInput = getByPlaceholderText('Calories');
    fireEvent.changeText(nameInput, 'Banana');
    fireEvent.changeText(calInput, '90');
    fireEvent.press(getByText('Add'));
    await waitFor(() => {
      expect(nameInput.props.value).toBe('');
      expect(calInput.props.value).toBe('');
    });
  });

  it('does not call addMeal when validation fails', () => {
    const { getByText } = render(<AddMeal />);
    fireEvent.press(getByText('Add'));
    expect(mockAddMeal).not.toHaveBeenCalled();
  });
});
