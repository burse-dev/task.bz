import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import styled from 'styled-components';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ListGroup, Tab } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import Preloader from '../generic/Preloader';
import ProfileForm from './ProfileForm';
import TicketsForm from './TicketsForm';
import CancelTicketForm from './CancelTicketForm';
import Accruals from './Accruals';
import RequisitesForm from './RequisitesForm';
import loadUserData from '../../actions/user';
import Tooltip from '../generic/Tooltip';
import { PENDING_TICKET_STATUS_ID } from '../../constant/ticketStatus';
import achive10 from '../img/10tasks.svg';
import achive50 from '../img/50tasks.svg';
import achive100 from '../img/100tasks.svg';

const AchiveIcon = styled.img`
  width: 50px;
  opacity: ${({ isTaken }) => (isTaken ? '1' : '0.3')}
`;

class User extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      tickets: [],
      accruals: [],
      achievements: [],
      userData: null,
      activeTabKey: '#profile',
    };
  }

  async componentDidMount() {
    const { location: { hash } } = this.props;

    if (hash) {
      await this.setState({
        loading: true,
        activeTabKey: hash,
      });
    }

    await this.load();

    await this.loadTickets();

    await this.loadAccruals();

    await this.loadAchievements();

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

  loadTickets = () => {
    const { authToken } = this.props;
    return fetch('/api/user/getTickets', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': `Bearer ${authToken}`,
      },
    })
      .then(async (response) => {
        const responseData = await response.json();
        this.setState({
          tickets: responseData,
        });
      });
  };

  loadAccruals = () => {
    const { authToken } = this.props;
    return fetch('/api/user/getAccruals', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': `Bearer ${authToken}`,
      },
    })
      .then(async (response) => {
        const responseData = await response.json();
        this.setState({
          accruals: responseData,
        });
      });
  };

  loadAchievements = () => {
    const { authToken } = this.props;
    return fetch('/api/user/getAchievements', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': `Bearer ${authToken}`,
      },
    })
      .then(async (response) => {
        const responseData = await response.json();
        this.setState({
          achievements: responseData,
        });
      });
  };

  handleClickToTab = (key) => {
    this.setState({
      activeTabKey: key,
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

  handleSubmitRequisitesForm = async (values) => {
    const { authToken } = this.props;

    const formData = new FormData();

    formData.append('value', values.value);
    formData.append('type', values.type);

    return fetch('/api/user/addRequisites', {
      method: 'POST',
      body: formData,
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
    })
      .then(async () => {
        const { loadUserData, authToken } = this.props;
        loadUserData(authToken);
      });
  };

  handleSubmitCancelTicketForm = async (values) => {
    const { authToken } = this.props;

    const formData = new FormData();
    formData.append('paymentsMethod', values.paymentsMethod);
    formData.append('sum', values.sum);

    return fetch('/api/user/cancelTicket', {
      method: 'POST',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
    })
      .then(async () => {
        await this.loadTickets();
      });
  };

  handleSubmitTicketsForm = async (values) => {
    const { authToken } = this.props;

    const formData = new FormData();
    formData.append('paymentsMethod', values.paymentsMethod);
    formData.append('sum', values.sum);

    return fetch('/api/user/addTicket', {
      method: 'POST',
      body: formData,
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
    })
      .then(async () => {
        const { loadUserData, authToken } = this.props;
        loadUserData(authToken);
        await this.loadTickets();
      });
  };

  checkAchieve = (achieve, achievements) => achievements.findIndex(i => i.value === achieve) !== -1;

  render() {
    const { loading, userData, tickets, accruals, achievements, activeTabKey } = this.state;
    const { user, authToken } = this.props;

    const PendingTicket = tickets.find(ticket => ticket.status === PENDING_TICKET_STATUS_ID);

    if (!authToken) {
      return (
        <Container className="pt-3 pb-5 vh-80">
          <Preloader />
        </Container>
      );
    }

    return (
      <>
        <div className="pt-3 pt-lg-5" />
        <Tab.Container
          // id="list-group-tabs-example"
          activeKey={activeTabKey}
          onSelect={this.handleClickToTab}
          // defaultActiveKey="#profile"
        >
          <Container className="pt-3 pb-5 vh-80">
            <Row>
              <Col lg={3}>
                <ListGroup className="pb-4">
                  <ListGroup.Item action href="#profile">
                    Профиль
                  </ListGroup.Item>
                  <ListGroup.Item action href="#requisites">
                    Реквизиты
                  </ListGroup.Item>
                  <ListGroup.Item action href="#accrual">
                    Начисления
                  </ListGroup.Item>
                  <ListGroup.Item action href="#payments">
                    Выплаты
                  </ListGroup.Item>
                </ListGroup>

                <div>
                  Достижения:
                  <div className="pt-2 pb-4 d-flex w-100">
                    <Tooltip content="10 выполненных задач">
                      <AchiveIcon alt="10 выполненных задач" src={achive10} isTaken={this.checkAchieve('10', achievements)} />
                    </Tooltip>
                    <Tooltip content="50 выполненных задач">
                      <AchiveIcon alt="50 выполненных задач" src={achive50} isTaken={this.checkAchieve('50', achievements)} />
                    </Tooltip>
                    <Tooltip content="100 выполненных задач">
                      <AchiveIcon alt="100 выполненных задач" src={achive100} isTaken={this.checkAchieve('100', achievements)} />
                    </Tooltip>
                  </div>
                </div>
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
                    <Tab.Pane eventKey="#requisites">
                      <RequisitesForm
                        onSubmit={this.handleSubmitRequisitesForm}
                        requisites={user.requisites}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="#accrual">
                      <Accruals
                        accruals={accruals}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="#payments">
                      {PendingTicket && (
                        <CancelTicketForm onSubmit={this.handleSubmitCancelTicketForm} />
                      )}
                      <TicketsForm
                        onSubmit={this.handleSubmitTicketsForm}
                        balance={user.balance}
                        requisites={user.requisites}
                        tickets={tickets}
                        pendingTicket={PendingTicket}
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

const mapDispatchToProps = dispatch => ({
  loadUserData: (data) => {
    dispatch(loadUserData(data));
  },
});

const mapStateToProps = state => ({
  user: state.userData.authUser,
  errorMessage: state.auth.errorMessage,
  authToken: state.auth.token,
});

export default connect(mapStateToProps, mapDispatchToProps)(User);
