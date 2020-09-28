import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import Form from 'react-bootstrap/Form';
import { Field, reduxForm } from 'redux-form';
import FormControl from '../generic/Form/FormControlRedux';
import FormControlSelect from '../generic/Form/FormControlSelectRedux';

const genderOptions = [
  {
    label: '',
    value: '',
  },
  {
    label: 'Мужской',
    value: 'male',
  },
  {
    label: 'Женский',
    value: 'female',
  },
];

const countryOptions = [
  {
    label: '',
    value: '',
  },
  {
    label: 'Россия',
    value: 'Россия',
  },
  {
    label: 'Другое',
    value: 'Другое',
  },
];

const validate = (values) => {
  const errors = {};
  if (values.dob && !/\d{2}\.\d{2}\.\d{4}/.test(values.dob)) {
    errors.dob = true;
  }

  if (values.password && values.password.length < 6) {
    errors.password = 'Слишком короткий пароль, необходимо не менее 6 символов';
  }

  return errors;
};

const CustomFormControl = ({ input: { onChange, value }, meta: { touched, error }, ...rest }) => (
  <InputMask mask="99.99.9999" value={value} onChange={onChange}>
    {inputProps => <Form.Control {...inputProps} isInvalid={touched && error} {...rest} />}
  </InputMask>
);

const ProfileForm = ({ handleSubmit, onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const submitForm = (values) => {
    setSubmitted(true);
    onSubmit(values).then(() => {
      setSuccess(true);
      setSubmitted(false);
    }).catch(() => {
      setSuccess(false);
      setSubmitted(false);
    });
  };

  const changeForm = () => {
    setSuccess(false);
    setSubmitted(false);
  };

  return (
    <Form onSubmit={handleSubmit(submitForm)} onChange={changeForm}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Ваш адрес электронной почты</Form.Label>
        <Field
          name="email"
          disabled
          // props={{ disabled: true }}
          autoComplete="new-email"
          component={FormControl}
        />
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Ваше имя</Form.Label>
        <Field name="login" placeholder="Имя" component={FormControl} />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Пароль</Form.Label>
        <Field
          autoComplete="new-password"
          name="password"
          type="password"
          placeholder="Измените для сохранения"
          component={FormControl}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Ваш пол</Form.Label>
        <Field
          name="gender"
          options={genderOptions}
          component={FormControlSelect}
        />
      </Form.Group>

      <Form.Group controlId="formBasicDob">
        <Form.Label>День рождения</Form.Label>
        <Field name="dob" component={CustomFormControl} />
        <Form.Text className="text-muted">
          Например: 25.01.1992
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="formBasicCountry">
        <Form.Label>Страна</Form.Label>
        <Field
          name="country"
          options={countryOptions}
          component={FormControlSelect}
        />
      </Form.Group>

      <Form.Group controlId="formBasicCity">
        <Form.Label>Город</Form.Label>
        <Field
          name="city"
          component={FormControl}
        />
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        disabled={!success && submitted}
      >
        Сохранить
      </Button>

      {success && (
        <Form.Text className="text-muted">
          Сохранено
        </Form.Text>
      )}
    </Form>
  );
};

export default reduxForm({
  form: 'profile',
  validate,
})(ProfileForm);
