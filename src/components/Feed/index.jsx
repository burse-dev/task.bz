import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from '../Header';
import TaskCard from './TaskCard';
import tasks from '../../Entity/tasks.json';

// eslint-disable-next-line react/prefer-stateless-function
class Feed extends Component {
  render() {
    return (
      <>
        <Header />
        <Container>
          <div className="pt-5">
            <h1>Поиск задач</h1>
            <p>
              {/* eslint-disable-next-line max-len */}
              На этой странице отображаются все доступные вам задания для работы. Чтобы узнать подробности задания, нажмите на заголовок.
            </p>
          </div>
        </Container>
        <Container className="pt-3">
          <Row>
            <Col>
              {tasks.map(task => (
                <TaskCard title={task.title} description={task.description} />
              ))}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Feed;
