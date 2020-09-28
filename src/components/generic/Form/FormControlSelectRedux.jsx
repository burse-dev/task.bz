import React from 'react';
import Form from 'react-bootstrap/Form';

export default ({ input: { onChange, value }, placeholder, options }) => (
  <Form.Control
    as="select"
    value={value}
    placeholder={placeholder}
    onChange={onChange}
  >
    {options.map(inputObj => <option value={inputObj.value}>{inputObj.label}</option>)}
  </Form.Control>
);
