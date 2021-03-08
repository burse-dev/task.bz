import React, { Component } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import TaskCard from './TaskCard';
import Preloader from '../generic/Preloader';

class WorksList extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      works: [],
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
    const { authToken } = this.props;
    return fetch('/api/user/works', {
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
    const { loading, works } = this.state;
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
