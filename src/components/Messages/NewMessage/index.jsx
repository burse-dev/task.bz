/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Preloader from '../../generic/Preloader';
import NewMessageForm from './NewMessageForm';

class Messages extends Component {
  handleSubmitForm = async (values) => {
    const { authToken } = this.props;
    const formData = new FormData();

    formData.append('subject', values.subject);
    formData.append('text', values.text);

    return fetch('/api/messages/new', {
      method: 'POST',
      body: formData,
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
    }).then(async (response) => {
      const id = await response.json();
      window.location.replace(`/messages/dialog/${id}`);
    }).catch(() => {
      alert('Обишка отправки данных');
      throw new Error();
    });
  };

  render() {
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
            <h2>Новое сообщения</h2>
          </div>
        </Container>
        <Container className="pt-3 vh-80">
          <NewMessageForm
            onSubmit={this.handleSubmitForm}
          />
        </Container>
      </>
    );
  }
}

const mapStateToProps = state => ({
  authToken: state.auth.token,
});

export default connect(mapStateToProps)(Messages);
