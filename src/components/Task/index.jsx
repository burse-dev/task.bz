import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import Preloader from '../generic/Preloader';
import TaskDetails from './TaskDetails';

// eslint-disable-next-line react/prefer-stateless-function
class Task extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      task: {},
      userTasksAvailability: {
        availability: false,
        reason: '',
      },
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

    await this.checkUserTasksAvailability();
  };

  checkUserTasksAvailability = async () => {
    const { match: { params: { id } }, authToken } = this.props;

    const formData = new FormData();
    formData.append('taskId', id);

    return fetch('/api/task/checkTaskAvailability', {
      method: 'POST',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    })
      .then(async (response) => {
        const responseData = await response.json();
        this.setState({
          userTasksAvailability: responseData || {},
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
      .then(async (response) => {
        const responseData = await response.json();
        window.location.replace(`/task-execution/${responseData}`);
      });
  };

  render() {
    const { loading, task, userTasksAvailability } = this.state;

    return (
      <>
        <Container className="vh-80">
          {loading && (
            <Preloader className="mt-5" />
          )}

          {!loading && task.id && (
            <>
              <TaskDetails {...task} />

              {userTasksAvailability.availability && (
                <Button onClick={this.handleClickMakeTask} variant="primary" className="mt-4">Выполнить задание</Button>
              )}

              <div className="pt-3">
                {userTasksAvailability.reason && (() => {
                  let reason = '';
                  if (userTasksAvailability.reason === 'no_task') {
                    reason = 'Задача больше не доступна';
                  }
                  if (userTasksAvailability.reason === 'one_time') {
                    reason = 'Задача доступна для выполнения 1 раз';
                  }
                  if (userTasksAvailability.reason === 'interval') {
                    reason = 'Задача станет доступной для выполнения после отправки отчета и по прошествию интервала времени';
                  }
                  if (userTasksAvailability.reason === 'banned') {
                    reason = 'Ваш аккаунт заблокирован';
                  }
                  if (userTasksAvailability.reason === 'default') {
                    reason = 'Задача станет доступной для выполнения после отправки отчета и по прошествию интервала времени';
                  }
                  return (<>{reason}</>);
                })()}
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
