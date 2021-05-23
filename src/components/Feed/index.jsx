import React, { Component } from 'react';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import TaskCard from './TaskCard';
import TaskPackage from './TaskPackage';
import Preloader from '../generic/Preloader';
import crownIcon from '../img/crownIcon-active.svg';
import stackIcon from '../img/stackIcon.svg';
import singleTaskIcon from '../img/singleTaskIcon.svg';

const Filter = styled.div`
  width: 200px;
`;

const FeedDescription = styled.p`
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 0;
  }
`;

const TaskTypeIcon = styled.img`
  margin-top: 5px;
  margin-bottom: 5px;
  width: 16px;
`;

// eslint-disable-next-line react/prefer-stateless-function
class Feed extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      sortedTasks: {
        priorityTasks: [],
        tasks: [],
      },
      taskPackages: [],
      filter: null,
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

  setFilter = async (e) => {
    const filter = e.target.value;

    await this.setState({
      loading: true,
      filter: filter || null,
    });

    await this.load();

    this.setState({
      loading: false,
    });
  };

  load = async () => {
    const { filter } = this.state;
    const query = new URLSearchParams({
      ...(filter && { filter }),
    });

    const feedTasks = await fetch(`/api/feedTasks?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then(response => response.json());

    const taskPackages = await fetch(`/api/feedPackTasks?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then(response => response.json());

    this.setState({
      sortedTasks: this.sortTasks(feedTasks.tasks),
      taskPackages,
    });
  };

  sortTasks = tasks => tasks.reduce((accumulator, currentValue) => {
    if (currentValue.inPriority) {
      accumulator.priorityTasks.push(currentValue);
    } else {
      accumulator.tasks.push(currentValue);
    }

    return accumulator;
  }, {
    priorityTasks: [],
    tasks: [],
  });

  render() {
    const { loading, sortedTasks, filter, taskPackages } = this.state;

    return (
      <>
        <Container>
          <div className="pt-3 pt-lg-5">
            <h2>Лента задач</h2>
            <FeedDescription>
              {/* eslint-disable-next-line max-len */}
              На этой странице отображаются все доступные вам задания для работы. Чтобы узнать подробности задания, нажмите на заголовок.
            </FeedDescription>
          </div>

          <Filter>
            <Form.Control onChange={this.setFilter} as="select" custom>
              <option selected={filter === null}>По дате</option>
              <option selected={filter === 'one-time'} value="one-time">Одноразовые</option>
              <option selected={filter === 'repeated'} value="repeated">Многоразовые</option>
              <option selected={filter === 'increase'} value="increase">По возрастанию цены</option>
              <option selected={filter === 'decrease'} value="decrease">По убыванию цены</option>
            </Form.Control>
          </Filter>

        </Container>
        <Container className="vh-80 pt-3">
          <Row>
            <Col>
              {loading && (
                <Preloader className="mt-5" />
              )}

              {!loading && (
                <>
                  {!!sortedTasks.priorityTasks.length && (
                    <div className="pb-3">
                      <div className="d-flex">
                        <TaskTypeIcon src={crownIcon} />
                        <div className="pl-2">Приоритетные задачи</div>
                      </div>
                      {sortedTasks.priorityTasks.map(task => (
                        <TaskCard {...task} />
                      ))}
                    </div>
                  )}

                  {!!taskPackages.length && (
                    <div className="pb-3">
                      <div className="d-flex">
                        <TaskTypeIcon src={stackIcon} />
                        <div className="pl-2">Пакетные задачи</div>
                      </div>
                      {taskPackages.map(pack => (
                        <TaskPackage {...pack} />
                      ))}
                    </div>
                  )}

                  {!!sortedTasks.tasks.length && (
                    <div className="pb-3">
                      <div className="d-flex">
                        <TaskTypeIcon src={singleTaskIcon} />
                        <div className="pl-2">Обычные задачи</div>
                      </div>
                      {sortedTasks.tasks.map(task => (
                        <TaskCard {...task} />
                      ))}
                    </div>
                  )}
                </>
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

export default connect(mapStateToProps)(Feed);
