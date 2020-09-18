import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Header from '../Header';

// eslint-disable-next-line react/prefer-stateless-function
class Feed extends Component {
  render() {
    return (
      <>
        <Header />
        <Container>
          <h1>Поиск задач</h1>
          <p>
            {/* eslint-disable-next-line max-len */}
            На этой странице отображаются все доступные вам задания для работы. Чтобы узнать подробности задания, нажмите на заголовок.
          </p>
        </Container>
        <Container className="pt-5">
          <Row>
            <Col>
              <Card>
                <Link to="/task/1">task</Link>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Feed;
