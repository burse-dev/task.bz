import React, { Component, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import Alert from 'react-bootstrap/Alert';
import FormControl from '../../generic/Form/FormControlRedux';

const RecoveryForm = ({ handleSubmit, onSubmit, error }) => {
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
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Напишите email, который указывали при регистрации</Form.Label>
        <Field type="email" name="email" component={FormControl} placeholder="Email" />
        <Form.Text className="text-muted">
          Письмо с новым паролем придет в течение нескольких минут
        </Form.Text>
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

const RecoveryFormRedux = reduxForm({
  form: 'recovery',
})(RecoveryForm);

export default class Login extends Component {
  handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('email', values.email);

    const res = await fetch('/api/recovery', {
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
        <Container className="vh-80">
          <Row className="pt-5 justify-content-center align-items-center">
            <Col lg="5">
              <Card>
                <Card.Header>Восстановление пароля</Card.Header>
                <Card.Body>
                  <RecoveryFormRedux
                    onSubmit={this.handleSubmit}
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
