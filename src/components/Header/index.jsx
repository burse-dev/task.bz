import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import userIcon from './user-icon.svg';
import lockIcon from './lock-icon.svg';
import { logOut } from '../../actions';
import loadUserData from '../../actions/user';

const LockIcon = styled.img`
  width: 15px;
  margin-right: 0px;
`;

const UserIcon = styled.img`
  width: 18px;
  margin-right: 8px;
  margin-bottom: 3px;
`;

class Header extends Component {
  componentDidMount = async () => {
    await this.load();
  };

  load = async () => {
    const {
      loadUserData,
      authToken,
      isAuth,
    } = this.props;

    if (isAuth) {
      await loadUserData(authToken);
    }
  };

  handleLogout = () => {
    const { logOut, history } = this.props;
    const logout = logOut();
    logout.then(() => history.push('/'));
  };

  render() {
    const {
      isAuth,
      user,
    } = this.props;

    return (
      <Navbar bg="light" expand="lg" className="sticky-top">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Task.bz</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer to="/">
                <Nav.Link href="/feed">Задания</Nav.Link>
              </LinkContainer>
            </Nav>

            {isAuth ? (
              <Nav>
                <NavDropdown
                  title={(
                    <span>
                      <UserIcon src={userIcon} className="img-responsive pull-right" alt="user" />
                      {user.login}
                    </span>
                  )}
                >
                  <LinkContainer to="/user">
                    <NavDropdown.Item>Профиль</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={this.handleLogout}>Выйти</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            ) : (
              <Nav>
                <LockIcon src={lockIcon} className="img-responsive pull-right" alt="user" />
                <LinkContainer to="/login">
                  <Nav.Link>Вход</Nav.Link>
                </LinkContainer>
              </Nav>
            )}

          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

const mapStateToProps = ({ auth, userData }) => ({
  user: userData.authUser,
  isAuth: auth.isAuthenticated,
  authToken: auth.token,
});

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logOut()),
  loadUserData: (data) => {
    dispatch(loadUserData(data));
  },
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Header);
