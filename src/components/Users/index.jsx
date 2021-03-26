import React, { Component } from 'react';
import moment from 'moment';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';
import Preloader from '../generic/Preloader';
import loadUserData from '../../actions/user';

class User extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      users: [],
    };
  }

  async componentDidMount() {
    const { location: { hash } } = this.props;

    if (hash) {
      await this.setState({
        loading: true,
      });
    }

    await this.load();

    this.setState({
      loading: false,
    });
  }

  load = () => {
    const { authToken } = this.props;
    return fetch('/api/users', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': `Bearer ${authToken}`,
      },
    })
      .then(async (response) => {
        const responseData = await response.json();

        this.setState({
          users: responseData.users,
        });
      });
  };

  render() {
    const { loading, users } = this.state;
    const { authToken } = this.props;

    if (!authToken) {
      return (
        <Container className="pt-3 pb-5 vh-80">
          <Preloader />
        </Container>
      );
    }

    return (
      <>
        <Container>
          <div className="pt-3 pt-lg-5">
            <h2>Пользователи</h2>
          </div>
        </Container>
        <Container className="pt-3 vh-80">
          {loading && (
            <Preloader />
          )}
          {!loading && (
            <Row>
              <Col>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>Логин</th>
                      <th>Почта</th>
                      <th>Баланс</th>
                      <th>Страна</th>
                      <th>Город</th>
                      <th>Дата рождения</th>
                      <th>Дата регистрации</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr>
                        <td>{user.id}</td>
                        <td>{user.login}</td>
                        <td>{user.email}</td>
                        <td>{user.balance}</td>
                        <td>{user.country}</td>
                        <td>{user.city}</td>
                        <td>{moment(user.dob).format('DD.MM.YY HH:mm')}</td>
                        <td>{moment(user.createdAt).format('DD.MM.YY HH:mm')}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          )}
        </Container>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadUserData: (data) => {
    dispatch(loadUserData(data));
  },
});

const mapStateToProps = state => ({
  authToken: state.auth.token,
});

export default connect(mapStateToProps, mapDispatchToProps)(User);