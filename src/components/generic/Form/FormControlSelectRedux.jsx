import React from 'react';
import Form from 'react-bootstrap/Form';

export default ({
  input: { onChange, value },
  meta: { touched, error },
  placeholder,
  options,
  ...rest
}) => (
  <>
    <Form.Control
      as="select"
      value={value || ''}
      onChange={onChange}
      {...rest}
      isInvalid={touched && error}
      custom
      // required
    >
      {options.map(inputObj => <option value={inputObj.value}>{inputObj.label}</option>)}
    </Form.Control>
    {touched && error && (
      <Form.Control.Feedback type="invalid">
        {error}
      </Form.Control.Feedback>
    )}
  </>
);
