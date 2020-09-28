import React, { Component, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import FormControl from '../../generic/Form/FormControlRedux';

const validate = (values) => {
  const errors = {};

  if (!values.login || (values.login.length < 4 || values.login.length > 12)) {
    errors.login = 'Длина логина должна быть от 4 до 12 символов';
  }

  return errors;
};

const RegistrationForm = ({ handleSubmit, onSubmit, error }) => {
  const [showFlashSuccess, setShowFlashSuccess] = useState(false);
  const [showFlashError, setShowFlashError] = useState(true);

  const submitForm = (values) => {
    setShowFlashError(true);
    return onSubmit(values)
      .then(() => {
        setShowFlashSuccess(true);
      })
      .catch((err) => {
        throw new SubmissionError({
          _error: err.message,
        });
      });
  };

  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Form.Group controlId="formBasicLogin">
        <Form.Label>Ваш логин</Form.Label>
        <Field name="login" component={FormControl} placeholder="Username" />
        <Form.Text className="text-muted">
          Как ваше имя будет отображаться в системе
        </Form.Text>
      </Form.Group>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Пароль придет на указанную почту:</Form.Label>
        <Field name="email" type="email" component={FormControl} placeholder="Email" />
      </Form.Group>
      {error && showFlashError && (
        <Alert variant="danger" onClose={() => setShowFlashError(false)} dismissible>
          {error}
        </Alert>
      )}
      {showFlashSuccess && (
        <Alert variant="info" onClose={() => setShowFlashSuccess(false)} dismissible>
          Данные отправлены, проверьте почту
        </Alert>
      )}
      <Button variant="primary" type="submit">
        Отправить
      </Button>

      <div className="pt-3">
        <small>
          <Link to="/login">Вход в систему</Link>
        </small>
      </div>
    </Form>
  );
};

const RegistrationFormRedux = reduxForm({
  form: 'registration',
  validate,
})(RegistrationForm);

class Registration extends Component {
  handleSendRegistration = async (values) => {
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('login', values.login);

    const res = await fetch('/api/registration', {
      method: 'POST',
      body: formData,
    });

    const response = await res.json();

    if (res.status !== 200) {
      throw new Error('Ошибка отправки данных');
    }

    if (response.error === true) {
      throw new Error(response.message);
    }
  };

  render() {
    return (
      <>
        <Container>
          <Row className="pt-5 justify-content-center align-items-center">
            <Col lg="5">
              <Card>
                <Card.Header>Регистрация</Card.Header>
                <Card.Body>
                  <RegistrationFormRedux
                    onSubmit={this.handleSendRegistration}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Registration;
