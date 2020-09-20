import React, { Component } from 'react';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from '../Header';
import TaskCard from './TaskCard';
import tasks from '../../Entity/tasks.json';

const FeedDescription = styled.p`
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 0;
  }
`;

// eslint-disable-next-line react/prefer-stateless-function
class Feed extends Component {
  render() {
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
              {tasks.map(task => (
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
