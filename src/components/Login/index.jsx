import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

import { emailAuth } from '../../actions';
import FormControl from '../generic/Form/FormControlRedux';

const LoginForm = ({ handleSubmit, onSubmit, error }) => {
  const [showFlash, setShowFlash] = useState(true);

  const submitForm = (values) => {
    setShowFlash(true);
    return onSubmit(values)
      .catch((err) => {
        throw new SubmissionError({
          _error: err.message,
        });
      });
  };

  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Ваша почта</Form.Label>
        <Field name="email" type="email" placeholder="Email" component={FormControl} />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Пароль</Form.Label>
        <Field name="password" type="password" placeholder="Password" component={FormControl} />
      </Form.Group>

      {error && showFlash && (
        <Alert variant="danger" onClose={() => setShowFlash(false)} dismissible>
          {error}
        </Alert>
      )}

      <Button variant="primary" type="submit">
        Войти
      </Button>
    </Form>
  );
};

const LoginFormRedux = reduxForm({
  form: 'signUp',
})(LoginForm);

class Login extends Component {
  handleSendLogin = async (values) => {
    const { emailAuth, history } = this.props;
    const auth = emailAuth(values);

    return auth.then((res) => {
      if (res) {
        history.push('/feed');
      }
    });
  };

  render() {
    return (
      <>
        <Container className="vh-80">
          <Row className="pt-5 justify-content-center align-items-center">
            <Col lg="5">
              <Card>
                <Card.Header>Вход в систему</Card.Header>
                <Card.Body>

                  <LoginFormRedux
                    onSubmit={this.handleSendLogin}
                  />

                  <small className="d-flex justify-content-between pt-3">
                    <Link to="/login/recovery">Забыли пароль?</Link>
                    <Link to="/login/registration">Регистрация</Link>
                  </small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  emailAuth: data => dispatch(emailAuth(data)),
});

export default connect(null, mapDispatchToProps)(Login);
