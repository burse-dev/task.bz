import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Field, reduxForm, reset } from 'redux-form';
import FormControl from '../../generic/Form/FormControlRedux';

const validate = (values) => {
  const errors = {};

  if (!values.subject) {
    errors.subject = 'Напишите тему';
  }

  if (values.subject && values.subject.length > 150) {
    errors.subject = 'Не более 1000 символов';
  }

  if (!values.text) {
    errors.text = 'Напишите текст сообщения';
  }

  if (values.text && values.text.length > 1000) {
    errors.text = 'Не более 1000 символов';
  }

  return errors;
};

const NewMessageForm = ({ handleSubmit, onSubmit, dispatch }) => {
  const submitForm = (values) => {
    onSubmit(values).then(() => {
      dispatch(reset('sendMessageForm'));
    });
  };

  return (
    <Form onSubmit={handleSubmit(submitForm)} className="pt-3">
      <Form.Group>
        <Field
          name="subject"
          placeholder="Тема"
          rows="6"
          component={FormControl}
        />
      </Form.Group>
      <Form.Group>
        <Field
          name="text"
          placeholder="Текст сообщения"
          as="textarea"
          rows="6"
          component={FormControl}
        />
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
      >
        Отправить
      </Button>
    </Form>
  );
};

export default reduxForm({
  form: 'newMessageForm',
  enableReinitialize: true,
  validate,
})(NewMessageForm);
