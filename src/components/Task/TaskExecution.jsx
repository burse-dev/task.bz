import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import CardWrapper from './CardWrapper';
import Preloader from '../generic/Preloader';
import FormControl from '../generic/Form/FormControlRedux';
import FormFileInput from '../generic/Form/FormFileInput';
import {
  REWORK_STATUS_ID,
  PENDING_STATUS_ID,
  IN_WORK_STATUS_ID,
  REJECTED_STATUS_ID,
  OVERDUE_STATUS_ID, SUCCESS_STATUS_ID,
} from '../../constant/taskExecutionStatus';
import TaskDetails from './TaskDetails';

const ReportForm = ({ handleSubmit, reply }) => (
  <Form onSubmit={handleSubmit}>
    <Form.Group>
      {reply && (
        <p>
          {`Комментарий заказчика: ${reply}`}
        </p>
      )}
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
          <Form.Label>Скриншоты</Form.Label>
          <Field
            id="custom-file"
            name="screenshots"
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
      screenshots: [],
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
    await this.checkUserTasks();
  };

  checkUserTasks = async () => {
    const { match: { params: { id } }, authToken } = this.props;

    const formData = new FormData();
    formData.append('userTaskId', id);

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
          task: responseData.task,
          screenshots: responseData.files ? responseData.files.map(file => file.url) : [],
        });
      });
  };

  handleClickCancel = () => {
    if (!window.confirm('Вы уверены, что хотите отказаться?')) {
      return;
    }

    const { match: { params: { id } }, authToken } = this.props;

    const formData = new FormData();
    formData.append('userTaskId', id);

    fetch('/api/user/cancelTask', {
      method: 'POST',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    })
      .then(async () => {
        window.location.replace('/feed');
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

    if (values.screenshots) {
      [...values.screenshots].forEach((file) => {
        formData.append('screenshots', file);
      });
    }

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
    const { loading, task, userTask, screenshots } = this.state;

    return (
      <>
        <Container className="vh-80">
          {loading && (
            <Preloader className="mt-5" />
          )}

          {!loading && task.id && (
            <>
              <TaskDetails {...task} />

              {([REWORK_STATUS_ID, PENDING_STATUS_ID, IN_WORK_STATUS_ID]
                .indexOf(userTask.status) !== -1) && (
                <Button onClick={this.handleClickCancel} variant="outline-dark" className="mt-4">Отказаться</Button>
              )}

              <div className="pt-3 pt-lg-3 pb-5">
                {userTask.status && (
                  <CardWrapper className="p-3 mt-3">
                    {userTask.status === IN_WORK_STATUS_ID && (
                      <ReportFormRedux
                        onSubmit={this.handleClickSendReport}
                        initialValues={{
                          report: userTask.report,
                          screenshots,
                        }}
                        reply={userTask.reply}
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

                        {userTask.reply && (
                          <>
                            <>
                              Комментарий заказчика:
                              {' '}
                              {userTask.reply}
                            </>
                            <hr />
                          </>
                        )}

                        {userTask.report && (
                          <>
                            {`Отчет: ${userTask.report}`}
                            <hr />
                          </>
                        )}
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
                        <p>{`Комментарий заказчика: ${userTask.reply}`}</p>
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
            </>
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
