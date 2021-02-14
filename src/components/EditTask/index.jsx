import React, { Component, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Redirect } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ListGroup, Tab } from 'react-bootstrap';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { reduxForm } from 'redux-form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { RestrictionsFields, validateRestrictionsFields } from './RestrictionsForm';
import { MainFields, validateMainFields } from './MainForm';
import Preloader from '../generic/Preloader';

const validate = (values) => {
  const errors = {};

  validateRestrictionsFields(values, errors);
  validateMainFields(values, errors);

  return errors;
};

const EditTaskForm = ({ handleSubmit, handleDelete, onSubmit, error, isNew, saved }) => {
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [triedToSubmit, setTriedToSubmit] = useState(false);

  const submitForm = (values) => {
    setTriedToSubmit(false);
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

      {error && triedToSubmit && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {saved && (
        <Alert variant="success">
          Задача добавлена
        </Alert>
      )}

      <Tab.Content>
        <Tab.Pane eventKey="#main">
          <MainFields />
        </Tab.Pane>

        <Tab.Pane eventKey="#restrictions">
          <RestrictionsFields />
        </Tab.Pane>
      </Tab.Content>

      <Button
        onClick={() => setTriedToSubmit(true)}
        variant="primary"
        type="submit"
        disabled={!success && submitted}
      >
        Сохранить
      </Button>

      {!isNew && (
        <>
          &nbsp;&nbsp;
          <Button
            onClick={handleDelete}
            variant="outline-danger"
            type="submit"
          >
            Удалить
          </Button>
        </>
      )}

      {success && (
        <Form.Text className="text-muted">
          Сохранено
        </Form.Text>
      )}
    </Form>
  );
};

const EditTaskFormRedux = reduxForm({
  form: 'editTaskForm',
  enableReinitialize: true,
  validate,
})(EditTaskForm);

class EditTask extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      saved: false,
      task: {},
    };
  }

  componentDidMount = async () => {
    await this.setState({
      loading: true,
    });

    await this.load();

    this.setState({
      loading: false,
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.redirect) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        redirect: false,
        saved: true,
      }, () => this.load());
    }
  };

  load = () => {
    const { authToken } = this.props;

    const { match: { params: { id } } } = this.props;

    if (!id) {
      return;
    }

    fetch(`/api/tasks/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': `Bearer ${authToken}`,
      },
    })
      .then(async (response) => {
        const responseData = await response.json();

        this.setState({
          task: responseData,
        });
      });
  };

  handleSubmitForm = async (values) => {
    const {
      authToken,
      match: { params: { id } },
    } = this.props;

    const formData = new FormData();

    let method = 'POST';
    let isNew = true;
    if (id) {
      isNew = false;
      method = 'PUT';
      formData.append('id', id);
    }

    formData.append('title', values.title);
    formData.append('category', values.category);
    formData.append('description', values.description);
    formData.append('reportRules', values.reportRules);
    formData.append('price', values.price);
    formData.append('status', values.status);

    if (values.executionTimeForUserLimit) {
      formData.append('executionTimeForUserLimit', values.executionTimeForUserLimit);
    }

    if (values.limitInDay) {
      formData.append('limitInDay', values.limitInDay);
    }

    if (values.limitForUser) {
      formData.append('limitForUser', values.limitForUser);
    }

    if (values.limitInHour) {
      formData.append('limitInHour', values.limitInHour);
    }

    if (values.startTime) {
      formData.append('startTime', values.startTime);
    }

    if (values.endTime) {
      formData.append('endTime', values.endTime);
    }

    return fetch('/api/tasks/save', {
      method,
      body: formData,
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
    }).then(async (response) => {
      const responseData = await response.json();
      if (isNew) {
        this.setState({
          redirect: `/tasks-list/edit/${responseData.id}`,
        });
      }
    }).catch(() => {
      alert('Обишка отправки данных');
      throw new Error();
    });
  };

  handleDelete = async (event) => {
    event.preventDefault();

    if (!window.confirm('Удалить?')) {
      return;
    }

    const {
      authToken,
      match: { params: { id } },
    } = this.props;

    await fetch(`/api/tasks/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
    });

    this.setState({
      redirect: '/tasks-list/',
    });
  };

  render() {
    const { redirect, task, loading, saved } = this.state;

    if (loading) {
      return (
        <Container className="pt-3 pb-5 vh-80">
          <Preloader className="mt-5" />
        </Container>
      );
    }

    if (redirect) {
      return <Redirect to={{ pathname: redirect }} />;
    }

    return (
      <>
        <div className="pt-3 pt-lg-5" />
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#main">
          <Container className="pt-3 pb-5">
            <Row>
              <Col lg={2}>
                <ListGroup className="pb-4">
                  <ListGroup.Item action href="#main">
                    Основное
                  </ListGroup.Item>
                  <ListGroup.Item action href="#restrictions">
                    Ограничения
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col lg={6}>
                <EditTaskFormRedux
                  saved={saved}
                  handleDelete={this.handleDelete}
                  onSubmit={this.handleSubmitForm}
                  initialValues={task.id ? task : {
                    executionTime: 24,
                  }}
                  isNew={!task.id}
                />
              </Col>
            </Row>
          </Container>
        </Tab.Container>
      </>
    );
  }
}

const mapStateToProps = state => ({
  errorMessage: state.auth.errorMessage,
  authToken: state.auth.token,
});

export default connect(mapStateToProps)(EditTask);
