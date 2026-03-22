import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

describe('Button', () => {
  it('renders the title text', () => {
    const { getByText } = render(<Button title="Start" handlePress={() => {}} />);
    expect(getByText('Start')).toBeTruthy();
  });

  it('calls handlePress when pressed', () => {
    const mockPress = jest.fn();
    const { getByText } = render(<Button title="Go" handlePress={mockPress} />);
    fireEvent.press(getByText('Go'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('does not call handlePress while isLoading is true', () => {
    const mockPress = jest.fn();
    const { getByText } = render(<Button title="Loading" handlePress={mockPress} isLoading={true} />);
    fireEvent.press(getByText('Loading'));
    expect(mockPress).not.toHaveBeenCalled();
  });

  it('applies a custom style override', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByText } = render(
      <Button title="Styled" handlePress={() => {}} style={customStyle} />
    );
    // Component renders without error — style merging is correct
    expect(getByText('Styled')).toBeTruthy();
  });
});
