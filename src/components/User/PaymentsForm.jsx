import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Field, reduxForm } from 'redux-form';
import FormControl from '../generic/Form/FormControlRedux';
import FormControlSelect from '../generic/Form/FormControlSelectRedux';

const paymentsOptions = [
  {
    label: 'Выберите',
    value: '',
  },
  {
    label: 'Банковская карта',
    value: 'card',
  },
  {
    label: 'Яндекс-деньги',
    value: 'yandex',
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

// eslint-disable-next-line no-unused-vars
const ProfileForm = ({ handleSubmit, onSubmit }) => (
  <Form onSubmit={handleSubmit}>
    <Form.Group>
      <Form.Label>Способ выплаты</Form.Label>
      <Field
        name="paymentsMethod"
        options={paymentsOptions}
        component={FormControlSelect}
      />
    </Form.Group>

    <Form.Group>
      <Form.Label>Сумма выплаты в рублях</Form.Label>
      <Field
        name="sum"
        component={FormControl}
      />
      <Form.Text className="text-muted">
        Доступно: 250.57р
      </Form.Text>
    </Form.Group>

    <Form.Group>
      <Form.Label>Реквизиты для выплаты</Form.Label>
      <Field
        name="requisites"
        component={FormControl}
      />
      <Form.Text className="text-muted">
        Номер кошелька или карты
      </Form.Text>
    </Form.Group>

    <Button
      variant="primary"
      type="submit"
    >
      Выплатить
    </Button>

    {/* {success && ( */}
    {/*   <Form.Text className="text-muted"> */}
    {/*     Отправлено */}
    {/*   </Form.Text> */}
    {/* )} */}
  </Form>
);

// const [submitted, setSubmitted] = useState(false);
// const [success, setSuccess] = useState(false);
//
// const submitForm = (values) => {
//   setSubmitted(true);
//   onSubmit(values).then(() => {
//     setSuccess(true);
//     setSubmitted(false);
//   }).catch(() => {
//     setSuccess(false);
//     setSubmitted(false);
//   });
// };
//
// const changeForm = () => {
//   setSuccess(false);
//   setSubmitted(false);
// };

export default reduxForm({
  form: 'profile',
  validate,
})(ProfileForm);
