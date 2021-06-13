/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import DialogCard from './DialogCard';
import Preloader from '../generic/Preloader';
import { USER_TYPE_ID } from '../../constant/userType';

class Messages extends Component {
  constructor() {
    super();

    this.state = {
      dialogs: [],
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

    return fetch('/api/messages', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': `Bearer ${authToken}`,
      },
    })
      .then(async (response) => {
        const dialogs = await response.json();

        this.setState({
          dialogs,
        });
      });
  };

  handleSubmitForm = async (values) => {
    const { authToken } = this.props;
    const formData = new FormData();

    formData.append('title', values.title);
    formData.append('message', values.message);

    return fetch('/api/mailing/send', {
      method: 'POST',
      body: formData,
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
    })
      .then(async (response) => {
        await response.json();
      })
      .catch(() => {
        alert('Обишка отправки данных');
        throw new Error();
      });
  };

  render() {
    const { loading, dialogs } = this.state;
    const { authToken, user } = this.props;

    if (!authToken || loading) {
      return (
        <Container className="pt-3 pb-5 vh-80">
          <Preloader />
        </Container>
      );
    }

    return (
      <>
        <Container>
          <div className="pt-3 pt-lg-5 d-md-flex align-items-center justify-content-between">
            <h2>Сообщения</h2>
            <div>
              {user.type === USER_TYPE_ID && (
                <Link to="/messages/new">
                  <Button>Написать сообщение</Button>
                </Link>
              )}
            </div>
          </div>
        </Container>
        <Container className="pt-3 vh-80">
          {!dialogs.length && (
            <div>Сообщений нет</div>
          )}
          {dialogs.map(({ id, subject, lastMessageText, lastMessageDate }) => (
            <DialogCard
              id={id}
              subject={subject}
              lastMessage={lastMessageText}
              time={lastMessageDate}
            />
          ))}
        </Container>
      </>
    );
  }
}

const mapStateToProps = state => ({
  authToken: state.auth.token,
  user: state.userData.authUser,
});

export default connect(mapStateToProps)(Messages);
