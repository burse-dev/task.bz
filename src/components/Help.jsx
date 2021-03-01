import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Field, reduxForm, reset } from 'redux-form';
import FormControl from './generic/Form/FormControlRedux';

const validate = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = true;
  }

  if (!values.email) {
    errors.email = true;
  }

  if (!values.message) {
    errors.message = true;
  }

  return errors;
};

const FileInput = ({ input, dataAllowedFileExtensions }) => {
  const onInputChange = (e) => {
    e.preventDefault();
    const files = e.target.files[0];
    input.onChange(files);
  };
  return (
    <div>
      <input
        type="file"
        onChange={onInputChange}
        data-allowed-file-extensions={dataAllowedFileExtensions}
      />
    </div>
  );
};

const HelpForm = ({ handleSubmit, onSubmit, dispatch }) => {
  const [success, setSuccess] = useState(false);

  const submitForm = (values) => {
    onSubmit(values).then(() => {
      dispatch(reset('helpForm'));
      setSuccess(true);
    }).catch(() => {
      setSuccess(false);
    });
  };

  const changeForm = () => {
    setSuccess(false);
  };

  return (
    <Form onSubmit={handleSubmit(submitForm)} onChange={changeForm}>
      <Form.Group>
        <Form.Label>Ваше имя</Form.Label>
        <Field
          name="name"
          component={FormControl}
        />
        <Form.Text className="text-muted">
          Как к вам обращаться?
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Ваш e-mail</Form.Label>
        <Field
          name="email"
          component={FormControl}
        />
        <Form.Text className="text-muted">
          Адрес электронной почты
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Текст сообщения</Form.Label>
        <Field
          name="message"
          placeholder="Ваш текст..."
          as="textarea"
          rows="6"
          component={FormControl}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Прикрепите файл</Form.Label>
        <div>
          <Field
            type="file"
            component={FileInput}
            name="file"
          />
        </div>
        <Form.Text className="text-muted">
          Не более 5 Мб
        </Form.Text>
      </Form.Group>

      <Button type="submit" variant="outline-primary" className="mt-4">Отправить</Button>

      {success && (
        <Form.Text className="text-success">
          Сообщение успешно отправлено
        </Form.Text>
      )}
    </Form>
  );
};

const HelpFormRedux = reduxForm({
  form: 'helpForm',
  enableReinitialize: true,
  validate,
})(HelpForm);

export default () => {
  const handleSubmitForm = async (values) => {
    const formData = new FormData();

    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('message', values.message);
    formData.append('file', values.file);

    return fetch('/api/help/save', {
      method: 'POST',
      body: formData,
    }).then(async (response) => {
      const responseData = await response.json();
      console.log(responseData);
    }).catch(() => {
      alert('Обишка отправки данных');
      throw new Error();
    });
  };

  return (
    <Container className="vh-80">
      <Row className="pt-5">
        <Col>
          <h1>Служба поддержки</h1>

          <HelpFormRedux onSubmit={handleSubmitForm} />
        </Col>
      </Row>
    </Container>
  );
};
