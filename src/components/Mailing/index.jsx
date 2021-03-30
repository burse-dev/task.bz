/* eslint-disable no-param-reassign */
import React, { Component, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Field, reduxForm, reset } from 'redux-form';
import { connect } from 'react-redux';
import Preloader from '../generic/Preloader';
import FormControl from '../generic/Form/FormControlRedux';

const validate = (values) => {
  const errors = {};

  if (!values.title) {
    errors.title = 'Заполните поле';
  }

  if (!values.message) {
    errors.message = 'Заполните текст';
  }

  return errors;
};

const MailingForm = ({ handleSubmit, onSubmit, error, dispatch }) => {
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [triedToSubmit, setTriedToSubmit] = useState(false);

  const submitForm = (values) => {
    setTriedToSubmit(false);
    setSubmitted(true);
    onSubmit(values).then(() => {
      dispatch(reset('mailingForm'));
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
      {success && (
        <Alert variant="success">
          Рассылка запущена
        </Alert>
      )}

      {error && triedToSubmit && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      <Form.Group>
        <Form.Label>Тема</Form.Label>
        <Field
          name="title"
          placeholder="Тема письма"
          component={FormControl}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Сообщение</Form.Label>
        <Field
          name="message"
          placeholder="Текст сообщения"
          as="textarea"
          rows="6"
          component={FormControl}
        />
      </Form.Group>

      <Button
        onClick={() => setTriedToSubmit(true)}
        variant="primary"
        type="submit"
        disabled={!success && submitted}
      >
        Отправить
      </Button>
    </Form>
  );
};

const MailingFormRedux = reduxForm({
  form: 'mailingForm',
  validate,
})(MailingForm);

class Mailing extends Component {
  handleSubmitForm = async (values) => {
    const { authToken } = this.props;
    const formData = new FormData();

    formData.append('title', values.title);
    formData.append('message', values.message);

    return fetch('/api/mailing/send', {
      method: 'POST',
      body: formData,
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
    }).then(async (response) => {
      await response.json();
    }).catch(() => {
      alert('Обишка отправки данных');
      throw new Error();
    });
  };

  render() {
    const { authToken } = this.props;

    if (!authToken) {
      return (
        <Container className="pt-3 pb-5 vh-80">
          <Preloader />
        </Container>
      );
    }

    return (
      <>
        <Container>
          <div className="pt-3 pt-lg-5">
            <h2>Рассылка</h2>
          </div>
        </Container>
        <Container className="pt-3 vh-80">
          <MailingFormRedux onSubmit={this.handleSubmitForm} />
        </Container>
      </>
    );
  }
}

const mapStateToProps = state => ({
  authToken: state.auth.token,
});

export default connect(mapStateToProps)(Mailing);
