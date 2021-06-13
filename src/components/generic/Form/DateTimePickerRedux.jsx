import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default ({
  input: { onChange, value },
  meta: { touched, error },
  placeholder,
  ...rest
}) => (
  <DatePicker
    error={touched && error}
    placeholderText={placeholder || ''}
    selected={value ? new Date(value) : null}
    dateFormat="dd.MM.yyyy H:mm"
    onChange={onChange}
    {...rest}
    timeIntervals={15}
    showTimeSelect
  />
);
