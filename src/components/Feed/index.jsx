import React, { Component } from 'react';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import TaskCard from './TaskCard';
import Preloader from '../generic/Preloader';

const Filter = styled.div`
  width: 200px;
`;

const FeedDescription = styled.p`
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 0;
  }
`;

// eslint-disable-next-line react/prefer-stateless-function
class Feed extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      tasks: [],
      filter: null,
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

    return fetch(`/api/feedTasks?${query}`, {
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
  }

  render() {
    const { loading, tasks, filter } = this.state;
    // const { authToken } = this.props;
    //
    // if (!authToken) {
    //   return (
    //     <Container className="pt-3 pb-5 vh-80">
    //       <Preloader className="mt-5" />
    //     </Container>
    //   );
    // }

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
              {!loading && tasks.map(task => (
                <TaskCard
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  category={task.category}
                  price={task.price}
                  inPriority={task.inPriority}
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

const mapStateToProps = ({ auth }) => ({
  authToken: auth.token,
});

export default connect(mapStateToProps)(Feed);
