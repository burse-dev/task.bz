import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { connect } from 'react-redux';
import moment from 'moment';
import checkIcon from '../img/checkedIcon.svg';
import closeIcon from '../img/closeIcon.svg';
import Button from '../generic/Buttons/SmallButton';
import TicketStatusBadge from '../generic/TicketStatusBadge';
import getTypeNameById from '../functions/getTypeNameById';
import requisitesType from '../../constant/requisitesType';
import { PENDING_TICKET_STATUS_ID } from '../../constant/ticketStatus';
import Preloader from '../generic/Preloader';

class Tickets extends Component {
  constructor() {
    super();

    this.state = {
      tickets: [],
      loading: true,
      // count: 0,
    };
  }

  componentDidMount = async () => {
    await this.setState({
      loading: true,
    });

    await this.load();

    this.setState({
      loading: false,
    });
  };

  load = async () => {
    const {
      authToken,
    } = this.props;

    return fetch('/api/admin/getTickets', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': `Bearer ${authToken}`,
      },
    })
      .then(async (response) => {
        const responseData = await response.json();

        this.setState({
          tickets: responseData.tickets,
          // count: responseData.count,
        });
      });
  };

  handleClickApproveTicket = id => async () => {
    const { authToken } = this.props;

    const formData = new FormData();
    formData.append('id', id);

    fetch('/api/admin/approveTicket', {
      method: 'POST',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    }).then(async () => {
      await this.load();
    });
  };

  handleClickRejectTicket = id => async () => {
    const { authToken } = this.props;

    const formData = new FormData();
    formData.append('id', id);

    fetch('/api/admin/rejectTicket', {
      method: 'POST',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    }).then(async () => {
      await this.load();
    });
  };

  render() {
    const { tickets, loading } = this.state;
    const { authToken } = this.props;

    if (!authToken) {
      return (
        <Container className="pt-3 pb-5 vh-80">
          <Preloader className="mt-5" />
        </Container>
      );
    }

    return (
      <Container className="vh-80">
        <div className="pt-3 pt-lg-5 pb-lg-3">
          <h2>Заявки на выплату</h2>
        </div>
        {loading && (
          <Preloader />
        )}

        {!!tickets.length && (
          <Row>
            <Col>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Пользователь</th>
                    <th>Баланс</th>
                    <th>Реквизиты</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(ticket => (
                    <tr>
                      <td>{moment(ticket.createdAt).format('HH:mm DD.MM.YY')}</td>
                      <td>{ticket.user.login}</td>
                      <td>{ticket.user.balance}</td>
                      <td>{getTypeNameById(ticket.requisite.type, requisitesType)}</td>
                      <td>{ticket.value}</td>
                      <td>
                        <TicketStatusBadge statusId={ticket.status} />
                      </td>
                      <td>
                        <div className="mr-2 ml-2 d-flex">
                          <Button
                            icon={checkIcon}
                            onClick={this.handleClickApproveTicket(ticket.id)}
                            disabled={ticket.status !== PENDING_TICKET_STATUS_ID}
                          />
                          <Button
                            icon={closeIcon}
                            onClick={this.handleClickRejectTicket(ticket.id)}
                            disabled={ticket.status !== PENDING_TICKET_STATUS_ID}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  authToken: auth.token,
});

export default connect(mapStateToProps)(Tickets);
