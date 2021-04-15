import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import { emailAuth } from '../../actions';
import FormControl from '../generic/Form/FormControlRedux';
import Preloader from '../generic/Preloader';
import TaskCard from '../Feed/TaskCard';
import HowItWorks from './HowItWorks';


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
  constructor() {
    super();
    this.state = {
      loading: true,
      tasks: [],
    };
  }

  async componentDidMount() {
    await this.setState({
      loading: true,
    });

    await this.load();

    this.setState({
      loading: false,
    });
  }

  load = async () => fetch('/api/feedTasks', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then(async (response) => {
      const responseData = await response.json();
      this.setState({
        tasks: responseData.tasks,
      });
    });

  handleSendLogin = async (values) => {
    const { emailAuth } = this.props;
    const auth = emailAuth(values);

    return auth.then((res) => {
      if (res) {
        window.location.replace('/feed');
      }
    });
  };

  render() {
    const { loading, tasks } = this.state;
    return (
      <>
        <Container className="vh-80">
          <Row className="pt-5 justify-content-center">
            <Col lg="6">
              <h3>ЗАРАБАТЫВАЙТЕ В ИНТЕРНЕТЕ!</h3>
              <span className="p-1 d-inline-block bg-danger text-white">
                ДЕНЬГИ ЗА ВСЁ, ЧТО ВЫ РАНЬШЕ ДЕЛАЛИ БЕСПЛАТНО!
              </span>
              <ul className="pt-4">
                <li>За просмотр сайтов</li>
                <li>За лайки и комментарии</li>
                <li>За регистрацию или подписку</li>
                <li>За просмотр рекламы</li>
                <li>И многое другое</li>
              </ul>
              <p className="pr-lg-5">
                {/* eslint-disable-next-line max-len */}
                Вас ждут тысячи заданий (небольших поручений рекламодателей) на любой вкус и цвет, делайте всё, что и раньше, на любимых сайтах и в соц. сетях, но теперь ещё и за деньги!
              </p>

              <div className="d-flex align-items-center text-center text-lg-left pb-5">
                <LinkContainer to="/login/registration">
                  <Button variant="success" type="submit">
                    Начать зарабатывать
                  </Button>
                </LinkContainer>
                <div className="text-success pl-3">+ 10&#8381; сразу при регистрации</div>
              </div>
            </Col>
            <Col lg="5">
              <Card className="mb-5">
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

          <Row className="pb-5 justify-content-center">
            <Col lg="11">
              <HowItWorks />
            </Col>
          </Row>

          <Row className="pt-2 justify-content-center">
            <Col lg="11">
              <h2>Доступные задачи</h2>
            </Col>
          </Row>
          <Row className="pt-3 justify-content-center">
            <Col lg="11">
              {loading && (
                <Preloader className="mt-5" />
              )}
              {!loading && tasks.map(task => (
                <TaskCard
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  category={task.category}
                  price={task.price}
                  executionType={task.executionType}
                  doneCount={task.doneCount}
                  rejectedCount={task.rejectedCount}
                />
              ))}
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
