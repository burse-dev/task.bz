/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Preloader from '../../generic/Preloader';
import MessageCard from './MessageCard';
import MessageForm from './MessageForm';
import loadUserData from '../../../actions/user';

class Messages extends Component {
  constructor() {
    super();

    this.state = {
      dialog: {},
      loading: true,
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
    const { match: { params: { id } }, authToken, loadUserData } = this.props;
    await fetch(`/api/messages/dialog/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': `Bearer ${authToken}`,
      },
    })
      .then(async (response) => {
        const dialog = await response.json();

        if (!dialog) {
          return window.location.replace('/messages');
        }

        this.setState({
          dialog,
        });
        return loadUserData(authToken);
      });
  };

  handleSubmitForm = async (values) => {
    const { match: { params: { id } } } = this.props;
    const { authToken } = this.props;
    const formData = new FormData();

    formData.append('text', values.text);
    formData.append('dialogId', id);

    return fetch('/api/messages/send', {
      method: 'POST',
      body: formData,
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
    }).then(async (response) => {
      await response.json();
      await this.load();
    }).catch(() => {
      alert('Обишка отправки данных');
      throw new Error();
    });
  };

  render() {
    const { loading, dialog } = this.state;
    const { authToken } = this.props;

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
          <div className="pt-3 pt-lg-5">
            <h2>{dialog.subject}</h2>
          </div>
        </Container>
        <Container className="pt-3 vh-80">
          {dialog.messages && dialog.messages.map(({ text, createdAt, sentFromAdmin }) => (
            <MessageCard
              message={text}
              sentFromAdmin={sentFromAdmin}
              name={dialog.userLogin}
              time={createdAt}
            />
          ))}

          <MessageForm
            onSubmit={this.handleSubmitForm}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
