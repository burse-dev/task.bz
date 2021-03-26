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
  padding-left: 20px; 
`;

class TasksList extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      tasks: [],
      status: IN_WORK_TASK_STATUS_ID,
      // count: 0,
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
          tasks: responseData.tasks,
          // count: responseData.count,
        });
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
    const { loading, tasks } = this.state;
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

          </div>
        </Container>
        <Container className="pt-3 vh-80">
          <Row>
            <Col>
              {loading && (
                <Preloader />
              )}
              <TableHeaderCard />
              {!loading && tasks.map((task) => {
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
                  />
                );
              })}

              {!loading && tasks.length === 0 && (
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
