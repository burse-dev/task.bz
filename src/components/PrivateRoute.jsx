import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class PrivateRoute extends Component {
  state = {
    isLoading: true,
    isAuthenticated: false,
  };

  componentDidMount() {
    this.asyncCall()
      .then((isAuthenticated) => {
        this.setState({
          isLoading: false,
          isAuthenticated,
        });
      }).catch(() => {
        this.setState({
          isLoading: false,
          isAuthenticated: false,
        });
      });
  }


  asyncCall = async () => {
    const { authToken } = this.props;
    return fetch('/api/check-auth', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': `Bearer ${authToken}`,
      },
    }).then(async (response) => {
      // const responseData = await response.json();

      if (response.status !== 200) {
        throw new Error('Unauthorized');
      }

      return true;
    });
  };

  render() {
    const { component: Component, ...rest } = this.props;
    const { isLoading, isAuthenticated } = this.state;

    if (isLoading) {
      return <div />;
    }

    return (
      <Route
        {...rest}
        render={props => (
          <div>
            {!isAuthenticated && <Redirect to={{ pathname: '/login' }} />}
            {isAuthenticated && <Component {...props} />}
          </div>
        )}
      />
    );
  }
}

const mapStateToProps = state => ({
  authToken: state.auth.token,
});

export default connect(mapStateToProps)(PrivateRoute);
