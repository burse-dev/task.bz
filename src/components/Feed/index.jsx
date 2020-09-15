import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prefer-stateless-function
class Feed extends Component {
  render() {
    return (
      <>
        <Link to="/task/1">task</Link>
      </>
    );
  }
}

export default Feed;
