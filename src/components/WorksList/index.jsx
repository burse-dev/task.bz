import React, { Component } from 'react';
import styled from 'styled-components';
import { Container, Col, Row, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import TaskCard from './TaskCard';
import Preloader from '../generic/Preloader';
import {
  IN_WORK_STATUS_ID,
  OVERDUE_STATUS_ID,
  PENDING_STATUS_ID,
  REJECTED_STATUS_ID,
  REWORK_STATUS_ID,
  SUCCESS_STATUS_ID,
} from '../../constant/taskExecutionStatus';

const Filter = styled.div`
  width: 200px;
`;

class WorksList extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      works: [],
      status: null,
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

  setStatus = async (e) => {
    const status = e.target.value;

    await this.setState({
      loading: true,
      status: status || null,
    });

    await this.load();

    this.setState({
      loading: false,
    });
  };

  load = async () => {
    const { status } = this.state;
    const query = new URLSearchParams({
      ...(status && { status }),
    });

    const { authToken } = this.props;
    return fetch(`/api/user/works?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': `Bearer ${authToken}`,
      },
    })
      .then(async (response) => {
        const responseData = await response.json();

        this.setState({
          works: responseData.works,
          // count: responseData.count,
        });
      });
  };

  render() {
    const { loading, works, status } = this.state;
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
            <h2>Мои работы</h2>
          </div>
        </Container>
        <Container>
          <Filter>
            <Form.Control onChange={this.setStatus} as="select" custom>
              <option selected={status === null} value="">Все статусы</option>
              <option selected={status === IN_WORK_STATUS_ID} value={IN_WORK_STATUS_ID}>
                В работе
              </option>
              <option selected={status === PENDING_STATUS_ID} value={PENDING_STATUS_ID}>
                На проверке
              </option>
              <option selected={status === OVERDUE_STATUS_ID} value={OVERDUE_STATUS_ID}>
                Не выполненно
              </option>
              <option selected={status === REJECTED_STATUS_ID} value={REJECTED_STATUS_ID}>
                Отклонено
              </option>
              <option selected={status === REWORK_STATUS_ID} value={REWORK_STATUS_ID}>
                Требует доработки
              </option>
              <option selected={status === SUCCESS_STATUS_ID} value={SUCCESS_STATUS_ID}>
                Принято
              </option>
            </Form.Control>
          </Filter>
        </Container>
        <Container className="pt-3 vh-80">
          <Row>
            <Col>
              {loading && (
                <Preloader />
              )}
              {!loading && works.map(work => (
                <TaskCard
                  to={`/task-execution/${work.id}`}
                  title={work.task.title}
                  statusId={work.status}
                  description={work.task.description}
                  category={work.task.category}
                  price={work.task.price}
                  executionType={work.task.executionType}
                />
              ))}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

const mapStateToProps = state => ({
  errorMessage: state.auth.errorMessage,
  authToken: state.auth.token,
});

export default connect(mapStateToProps)(WorksList);
