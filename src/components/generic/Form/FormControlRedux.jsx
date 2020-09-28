import React from 'react';
import Form from 'react-bootstrap/Form';

export default ({ input: { onChange, value }, meta: { touched, error }, ...rest }) => (
  <>
    <Form.Control onChange={onChange} isInvalid={touched && error} value={value} {...rest} />
    {touched && error && (
      <Form.Control.Feedback type="invalid">
        {error}
      </Form.Control.Feedback>
    )}
  </>
);
