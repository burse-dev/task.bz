/* eslint-disable max-len */
import React, { Component } from 'react';
import styled from 'styled-components';
import { Container, Col, Row, Button, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import TableHeaderCard from './TableHeaderCard';
import TaskCard from './TaskCard';
import Preloader from '../generic/Preloader';
import {
  IN_WORK_STATUS_ID,
  PENDING_STATUS_ID,
  REWORK_STATUS_ID,
  SUCCESS_STATUS_ID,
} from '../../constant/taskExecutionStatus';
import {
  IN_WORK_TASK_STATUS_ID,
  SUSPENDED_TASK_STATUS_ID,
  FINISHED_TASK_STATUS_ID,
  REMOVED_TASK_STATUS_ID,
} from '../../constant/taskStatus';

const Filter = styled.div`
  width: 200px;
  padding: 0 20px; 
`;

const Task = ({ inPackage, task, setPriority, handleClickCheckbox, isChecked, handleClickDeleteFromPack }) => {
  const total = task.limitTotal || null;
  let inWork = 0;
  let pending = 0;
  let success = 0;
  if (task.userTasks && task.userTasks.length) {
    inWork = task.userTasks.reduce(
      (accumulator, current) => ([IN_WORK_STATUS_ID, REWORK_STATUS_ID].includes(current.status) ? accumulator + 1 : accumulator),
      0,
    );

    pending = task.userTasks.reduce(
      (accumulator, current) => (current.status === PENDING_STATUS_ID ? accumulator + 1 : accumulator),
      0,
    );

    success = task.userTasks.reduce(
      (accumulator, current) => (current.status === SUCCESS_STATUS_ID ? accumulator + 1 : accumulator),
      0,
    );
  }

  return (
    <TaskCard
      key={task.id}
      inWorkCount={inWork}
      pendingCount={pending}
      successCount={success}
      totalCount={total}
      id={task.id}
      title={task.title}
      description={task.description}
      category={task.category}
      price={task.price}
      statusId={task.status}
      executionType={task.executionType}
      inPriority={task.inPriority}
      inPackage={inPackage}
      setPriority={setPriority}
      handleClickCheckbox={handleClickCheckbox}
      isChecked={isChecked(task.id)}
      handleClickDeleteFromPack={handleClickDeleteFromPack}
    />
  );
};

class TasksList extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      sortedTasks: {
        tasksInPackages: [],
        tasks: [],
      },
      checkedIds: [],
      status: IN_WORK_TASK_STATUS_ID,
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
    const { status } = this.state;
    const query = new URLSearchParams({
      ...(status && { status }),
    });

    return fetch(`/api/tasks?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(async (response) => {
        const responseData = await response.json();

        this.setState({
          sortedTasks: this.sortTasks(responseData.tasks),
        });
      });
  };

  sortTasks = tasks => tasks.reduce((accumulator, currentValue) => {
    if (currentValue.taskPackId) {
      if (!accumulator.tasksInPackages[currentValue.taskPackId]) {
        accumulator.tasksInPackages[currentValue.taskPackId] = [];
      }
      accumulator.tasksInPackages[currentValue.taskPackId].push(currentValue);
    } else {
      accumulator.tasks.push(currentValue);
    }

    return accumulator;
  }, {
    tasksInPackages: [],
    tasks: [],
  });

  setPriority = id => async (e) => {
    e.preventDefault();
    const { authToken } = this.props;
    return fetch(`/api/tasks/setPriority/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': `Bearer ${authToken}`,
      },
    })
      .then(() => this.load());
  };

  handleClickCheckbox = id => async (e) => {
    e.stopPropagation();
    const { checkedIds } = this.state;
    const index = checkedIds.indexOf(id);
    if (index !== -1) {
      checkedIds.splice(index, 1);
    } else {
      checkedIds.push(id);
    }

    await this.setState({
      checkedIds,
    });
  };

  isChecked = (id) => {
    const { checkedIds } = this.state;

    return checkedIds.includes(id);
  };

  handleClickAddPack = () => {
    const { checkedIds } = this.state;
    const { authToken } = this.props;

    if (!checkedIds.length) {
      return;
    }

    fetch(`/api/tasks/addPack?ids=${checkedIds.toString()}`, {
      method: 'POST',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
    }).then(async () => {
      await this.load();
      this.setState({
        checkedIds: [],
      });
    });
  };

  handleClickDeleteFromPack = id => (e) => {
    e.preventDefault();
    const { authToken } = this.props;

    fetch(`/api/tasks/deleteFromPack/${id}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
    }).then(async () => {
      await this.load();
    });
  };

  setFilter = async (e) => {
    const status = parseInt(e.target.value, 10);

    await this.setState({
      loading: true,
      status: status || null,
    });

    await this.load();

    this.setState({
      loading: false,
    });
  };

  render() {
    const { loading, sortedTasks, checkedIds } = this.state;
    const { authToken } = this.props;

    if (!authToken) {
      return (
        <Container className="pt-3 pb-5 vh-80">
          <Preloader className="mt-5" />
        </Container>
      );
    }

    return (
      <>
        <Container>
          <div className="pt-3 pt-lg-5">
            <h2>Мои задания</h2>
          </div>
          <div className="pt-2 d-flex align-items-center">
            <LinkContainer to="/tasks-list/add">
              <Button variant="outline-primary">Добавить задание</Button>
            </LinkContainer>

            <Filter>
              <Form.Control onChange={this.setFilter} as="select" custom>
                <option value={0}>Все задания</option>
                <option selected="selected" value={IN_WORK_TASK_STATUS_ID}>В работе</option>
                <option value={SUSPENDED_TASK_STATUS_ID}>Приостановлено</option>
                <option value={FINISHED_TASK_STATUS_ID}>Завершено</option>
                <option value={REMOVED_TASK_STATUS_ID}>Удалено</option>
              </Form.Control>
            </Filter>

            {!!checkedIds.length && <Button variant="outline-info" onClick={this.handleClickAddPack}>Объединить в пакет</Button>}
          </div>
        </Container>
        <Container className="pt-3 vh-80">
          <Row>
            <Col>
              {loading && (
                <Preloader />
              )}
              <TableHeaderCard />

              {!loading && (
                <>
                  {sortedTasks.tasksInPackages.map(pack => (
                    <div className="pt-1 pb-2">
                      {pack.map(task => (
                        <Task
                          inPackage
                          task={task}
                          setPriority={this.setPriority}
                          handleClickCheckbox={this.handleClickCheckbox}
                          isChecked={this.isChecked}
                          handleClickDeleteFromPack={this.handleClickDeleteFromPack}
                        />
                      ))}
                    </div>
                  ))}
                  {sortedTasks.tasks.map(task => (
                    <Task
                      task={task}
                      setPriority={this.setPriority}
                      handleClickCheckbox={this.handleClickCheckbox}
                      isChecked={this.isChecked}
                    />
                  ))}
                </>
              )}

              {!loading && sortedTasks.tasks.length === 0 && sortedTasks.tasksInPackages.length === 0 && (
                <div className="p-2 small">Задач не найдено.</div>
              )}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  authToken: auth.token,
});

export default connect(mapStateToProps)(TasksList);
