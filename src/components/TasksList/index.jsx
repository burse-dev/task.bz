/* eslint-disable max-len */
import React, { Component } from 'react';
import { Container, Col, Row, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import TableHeaderCard from './TableHeaderCard';
import TaskCard from './TaskCard';
import Preloader from '../generic/Preloader';
import {
  IN_WORK_STATUS_ID,
  PENDING_STATUS_ID,
  REWORK_STATUS_ID, SUCCESS_STATUS_ID,
} from '../../constant/taskExecutionStatus';

class TasksList extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      tasks: [],
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

  load = async () => fetch('/api/tasks', {
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
          <div className="pt-2">
            <LinkContainer to="/tasks-list/add">
              <Button variant="outline-primary">Добавить задание</Button>
            </LinkContainer>
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
