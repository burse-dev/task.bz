import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ListGroup, Tab } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import Header from '../Header';
import Preloader from '../generic/Preloader';
import ProfileForm from './ProfileForm';
import PaymentsForm from './PaymentsForm';

class User extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      userData: null,
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

  load = () => {
    const { authToken } = this.props;
    return fetch('/api/user/data', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': `Bearer ${authToken}`,
      },
    })
      .then(async (response) => {
        const responseData = await response.json();

        if (responseData.dob) {
          responseData.dob = moment(responseData.dob).format('DD.MM.YYYY');
        }

        this.setState({
          userData: responseData,
        });
      });
  };

  handleSubmitProfileForm = async (values) => {
    const { authToken } = this.props;

    const formData = new FormData();

    formData.append('login', values.login);

    if (values.password) {
      formData.append('password', values.password);
    }

    formData.append('gender', values.gender);
    formData.append('dob', values.dob);
    formData.append('country', values.country);
    formData.append('city', values.city);

    return fetch('/api/user/save', {
      method: 'POST',
      body: formData,
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
    })
      .then(async (response) => {
        const responseData = await response.json();
        this.setState({
          userData: responseData,
        });
      })
      .catch(() => {
        alert('Внутренняя ошибка, обратитесь к разарботчику');
        throw new Error();
      });
  };

  handleSubmitPaymentsForm = async () => {
    // const { authToken } = this.props;
    //
    // const formData = new FormData();

    // return fetch('/api/user/save', {
    //   method: 'POST',
    //   body: formData,
    //   headers: {
    //     Authorization: `Bearer ${authToken}`,
    //   },
    // })
    //   .then(async (response) => {
    //     const responseData = await response.json();
    //     this.setState({
    //       userData: responseData,
    //     });
    //   })
    //   .catch(() => {
    //     alert('Внутренняя ошибка, обратитесь к разарботчику');
    //     throw new Error();
    //   });
  };

  render() {
    const { loading, userData } = this.state;
    return (
      <>
        <Header />
        <div className="pt-3 pt-lg-5" />
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#profile">
          <Container className="pt-3 pb-5">
            <Row>
              <Col lg={3}>
                <ListGroup className="pb-4">
                  <ListGroup.Item action href="#profile">
                    Профиль
                  </ListGroup.Item>
                  <ListGroup.Item action href="#payments">
                    Выплаты
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col lg={6}>
                {loading && (
                  <Preloader />
                )}
                {!loading && userData && (
                  <Tab.Content>
                    <Tab.Pane eventKey="#profile">
                      <ProfileForm
                        onSubmit={this.handleSubmitProfileForm}
                        initialValues={userData}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="#payments">
                      <PaymentsForm
                        onSubmit={this.handleSubmitPaymentsForm}
                        initialValues={userData}
                      />
                    </Tab.Pane>
                  </Tab.Content>
                )}
              </Col>
            </Row>
          </Container>
        </Tab.Container>
      </>
    );
  }
}

const mapStateToProps = state => ({
  errorMessage: state.auth.errorMessage,
  authToken: state.auth.token,
});

export default connect(mapStateToProps)(User);
