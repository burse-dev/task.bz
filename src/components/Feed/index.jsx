import React, { Component } from 'react';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from '../Header';
import TaskCard from './TaskCard';
import Preloader from '../generic/Preloader';

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
      count: 0,
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
        count: responseData.count,
      });
    });

  render() {
    const { loading, tasks, count } = this.state;
    console.log(count);
    return (
      <>
        <Header />
        <Container>
          <div className="pt-3 pt-lg-5">
            <h2>Поиск задач</h2>
            <FeedDescription>
              {/* eslint-disable-next-line max-len */}
              На этой странице отображаются все доступные вам задания для работы. Чтобы узнать подробности задания, нажмите на заголовок.
            </FeedDescription>
          </div>
        </Container>
        <Container className="pt-3">
          <Row>
            <Col>
              {loading && (
                <Preloader />
              )}
              {!loading && tasks.map(task => (
                <TaskCard
                  title={task.title}
                  description={task.description}
                  category={task.category}
                  price={task.price}
                />
              ))}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Feed;
