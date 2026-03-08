import React from 'react';

const TextInputUser = ({ title }) => {
  const [value, setValue] = React.useState('');

  return (
    <input
      style={styles.input}
      onChange={e => setValue(e.target.value)}
      value={value}
      placeholder={title}
    />
  );
};

const styles = {
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 16,
  },
};

export default TextInputUser;
