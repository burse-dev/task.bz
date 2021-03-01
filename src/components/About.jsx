import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default () => (
  <Container className="vh-80">
    <Row className="pt-5">
      <Col>
        <h1>О проекте</h1>

        <p>
          {/* eslint-disable-next-line max-len */}
          Task.bz – сервис, который поможет клиентам легко и просто заказывать услуги в  SMM (социальное продвижение), крауд-маркетинга, SEO и различных микрозадач, а фрилансерам зарабатывать, выполняя их.
        </p>
      </Col>
    </Row>
  </Container>
);
