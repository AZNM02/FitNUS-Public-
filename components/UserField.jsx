import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const TextInputUser = ({ title }) => {
  const [value, setValue] = React.useState('');

  return (
    <TextInput
      style={styles.input}
      onChangeText={setValue}
      value={value}
      placeholder={title}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 16,
  },
});

export default TextInputUser;
