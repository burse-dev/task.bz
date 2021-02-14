import React, { Component } from 'react';
import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import Price from '../generic/Price';
import Pre from '../generic/Pre';
import Preloader from '../generic/Preloader';
import getTypeNameById from '../functions/getTypeNameById';
import hoursCountEnding from '../functions/hoursCountEnding';
import category from '../../constant/category';
import FormControl from '../generic/Form/FormControlRedux';
import FormFileInput from '../generic/Form/FormFileInput';
import {
  REWORK_STATUS_ID,
  PENDING_STATUS_ID,
  IN_WORK_STATUS_ID,
  REJECTED_STATUS_ID,
  OVERDUE_STATUS_ID, SUCCESS_STATUS_ID,
} from '../../constant/taskExecutionStatus';

const Title = styled.h1`
  font-size: 28px;
  padding-bottom: 10px;
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const CardWrapper = styled.div`
  border: 1px solid rgba(0,0,0,.125);
  box-shadow: 0 0 4px 0 rgba(1,1,1,0.1);
`;

const ReportForm = ({ handleSubmit }) => (
  <Form onSubmit={handleSubmit}>
    <Form.Group>
      <Form.Label>Отчет о выполнении</Form.Label>
      <Field
        name="report"
        placeholder="Подробно опишите то, что просил указать в отчете заказчик"
        as="textarea"
        rows="6"
        component={FormControl}
      />
      <Form.Text className="text-muted">
        До 3000 символов
      </Form.Text>
    </Form.Group>

    <Row>
      <Col lg={3}>
        <Form.Group>
          <Form.Label>Скриншот</Form.Label>
          <Field
            id="custom-file"
            name="screenshot"
            type="file"
            label="Выберите файл"
            component={FormFileInput}
          />
        </Form.Group>
      </Col>
    </Row>

    <Button type="submit" variant="outline-success">Отправить</Button>
  </Form>
);

const ReportFormRedux = reduxForm({
  form: 'taskReportForm',
  enableReinitialize: true,
})(ReportForm);

// eslint-disable-next-line react/prefer-stateless-function
class Task extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      task: {},
      userTask: {},
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

  load = async () => {
    const { match: { params: { id } } } = this.props;
    await fetch(`/api/tasks/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(async (response) => {
        const responseData = await response.json();
        this.setState({
          task: responseData,
        });
      });

    await this.checkUserTasks();
  };

  checkUserTasks = async () => {
    const { match: { params: { id } }, authToken } = this.props;

    const formData = new FormData();
    formData.append('taskId', id);

    return fetch('/api/user/checkUserTask', {
      method: 'POST',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    })
      .then(async (response) => {
        const responseData = await response.json();
        this.setState({
          userTask: responseData || {},
        });
      });
  };

  handleClickMakeTask = () => {
    const { match: { params: { id } }, authToken } = this.props;

    const formData = new FormData();
    formData.append('taskId', id);

    fetch('/api/user/makeTask', {
      method: 'POST',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    })
      .then(async () => {
        this.checkUserTasks();
      });
  };

  handleClickCancel = () => {
    if (!window.confirm('Вы уверены, что хотите отказаться?')) {
      return;
    }

    const { match: { params: { id } }, authToken } = this.props;

    const formData = new FormData();
    formData.append('taskId', id);

    fetch('/api/user/cancelTask', {
      method: 'POST',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    })
      .then(async () => {
        this.checkUserTasks();
      });
  };

  handleClickSendReport = (values) => {
    const { authToken } = this.props;

    const { userTask } = this.state;

    if (!userTask) {
      throw new Error('userTask is not defined');
    }

    const formData = new FormData();
    formData.append('userTaskId', userTask.id);
    formData.append('report', values.report);
    formData.append('screenshot', values.screenshot);

    fetch('/api/user/sendReport', {
      method: 'POST',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    })
      .then(async () => {
        this.checkUserTasks();
      });
  };

  handleClickEditReport = () => {
    const { authToken } = this.props;
    const { userTask } = this.state;

    if (!userTask) {
      throw new Error('userTask is not defined');
    }

    const formData = new FormData();
    formData.append('userTaskId', userTask.id);

    fetch('/api/user/editReport', {
      method: 'POST',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    })
      .then(async () => {
        this.checkUserTasks();
      });
  };

  render() {
    const { loading, userTask, task } = this.state;

    return (
      <>
        <Container className="vh-80">
          {loading && (
            <Preloader className="mt-5" />
          )}

          {!loading && task.id && (
            <div className="pt-3 pt-lg-3 pb-5">
              <CardWrapper className="p-3 p-lg-4 rounded">
                <Title>{task.title}</Title>
                <section>
                  <b>Категория: </b>
                  {getTypeNameById(task.category, category)}
                </section>
                <section>
                  <h5 className="pt-2">Задание</h5>
                  <p>
                    <Pre>
                      {task.description}
                    </Pre>
                  </p>
                </section>

                <section>
                  <h5 className="pt-2">Оплата</h5>
                  <Price price={task.price} />
                </section>

                <br />

                <section>
                  <h5 className="pt-2">Отчет</h5>
                  <p>
                    {/* eslint-disable-next-line max-len */}
                    <Pre>
                      {task.reportRules}
                    </Pre>
                  </p>
                </section>

                <section>
                  <b>Время на выполнение: </b>
                  {`${task.executionTimeForUserLimit} ${hoursCountEnding(task.executionTimeForUserLimit)}`}
                </section>

                {task.endTime && (
                  <section className="pt-2">
                    <b>Задание доступно до: </b>
                    {moment(task.endTime).format('DD.MM.YYYY')}
                  </section>
                )}

                {!userTask.status && (
                  <Button onClick={this.handleClickMakeTask} variant="primary" className="mt-4">Выполнить задание</Button>
                )}

                {/* eslint-disable-next-line max-len */}
                {userTask.status && ([REWORK_STATUS_ID, PENDING_STATUS_ID, IN_WORK_STATUS_ID].indexOf(userTask.status) !== -1) && (
                  <Button onClick={this.handleClickCancel} variant="outline-dark" className="mt-4">Отказаться</Button>
                )}

              </CardWrapper>

              {userTask.status && (
                <CardWrapper className="p-3 mt-3">
                  {userTask.status === IN_WORK_STATUS_ID && (
                    <ReportFormRedux
                      onSubmit={this.handleClickSendReport}
                      initialValues={{
                        report: userTask.report,
                        screenshot: userTask.screenshot,
                      }}
                    />
                  )}

                  {userTask.status === REJECTED_STATUS_ID && (
                    <div className="alert alert-danger" role="alert">
                      Выполнение задания отклонено, причина:
                      {' '}
                      {userTask.reply}
                    </div>
                  )}

                  {userTask.status === PENDING_STATUS_ID && (
                    <div className="alert alert-info" role="alert">
                      <h4 className="alert-heading">На проверке</h4>
                      {/* eslint-disable-next-line max-len */}
                      <p>Заказчик должен проверить и подтвердить ваш отчет, если этого не произойдет в течение 72 часов, задание будует считаться выполненным</p>
                      <hr />
                      <Button onClick={this.handleClickEditReport} variant="outline-success" className="mt-1">Редактировать</Button>
                    </div>
                  )}

                  {userTask.status === SUCCESS_STATUS_ID && (
                    <div className="alert alert-success" role="alert">
                      <h4 className="alert-heading">Задание принято</h4>
                    </div>
                  )}

                  {userTask.status === REWORK_STATUS_ID && (
                    <div className="alert alert-warning" role="alert">
                      <h4 className="alert-heading">Требует доработки</h4>
                      <p>{userTask.reply}</p>
                      <hr />
                      <Button onClick={this.handleClickEditReport} variant="outline-success" className="mt-1">Редактировать</Button>
                    </div>
                  )}

                  {userTask.status === OVERDUE_STATUS_ID && (
                    <div className="alert alert-secondary" role="alert">
                      <h4 className="alert-heading">Не выполнено</h4>
                      <p>Вы не исполнили задачу в отведенное время</p>
                    </div>
                  )}

                </CardWrapper>
              )}
            </div>
          )}
        </Container>
      </>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  authToken: auth.token,
});

export default connect(mapStateToProps)(Task);
