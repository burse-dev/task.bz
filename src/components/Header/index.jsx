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
import { ADMIN_TYPE_ID, USER_TYPE_ID } from '../../constant/userType';
import logo from './logo.svg';

const LockIcon = styled.img`
  width: 15px;
  margin-right: 0px;
`;

const LogoIcon = styled.img`
  cursor: pointer;
  width: 125px;
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
    logout.then(() => history.push('/login'));
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
            <LogoIcon src={logo} alt="task.bz" />
          </LinkContainer>
          {/* <LinkContainer to="/"> */}
          {/*  <Navbar.Brand>Task.bz</Navbar.Brand> */}
          {/* </LinkContainer> */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {isAuth && (
                <>
                  {user.type === USER_TYPE_ID && (
                    <>
                      <LinkContainer to="/feed">
                        <Nav.Link href="/feed">Поиск задания</Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/works-list">
                        <Nav.Link href="/works-list">Мои работы</Nav.Link>
                      </LinkContainer>
                    </>
                  )}

                  {user.type === ADMIN_TYPE_ID && (
                    <>
                      <LinkContainer to="/tasks-list">
                        <Nav.Link href="/tasks-list">Мои задания</Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/tickets">
                        <Nav.Link href="/tickets">Тикеты</Nav.Link>
                      </LinkContainer>
                    </>
                  )}

                  <LinkContainer to="/messages">
                    <Nav.Link href="/messages">
                      <div className="d-flex align-items-center">
                        <span className="pr-1">Сообщения</span>
                        {!!user.unreadMessagesCount && (
                          <span className="badge badge-pill badge-danger">
                            {user.unreadMessagesCount}
                          </span>
                        )}
                      </div>
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>

            {isAuth ? (
              <>
                {user.type === ADMIN_TYPE_ID && (
                  <Nav>
                    <NavDropdown
                      title={(
                        <span>
                          <UserIcon src={userIcon} className="img-responsive pull-right" alt="user" />
                          {user.login}
                        </span>
                      )}
                    >
                      <LinkContainer to="/users">
                        <NavDropdown.Item>Пользователи</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/mailing">
                        <NavDropdown.Item>Рассылка</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Item onClick={this.handleLogout}>Выйти</NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                )}

                {user.type === USER_TYPE_ID && (
                  <>
                    <Nav>
                      <LinkContainer to="/user#payments">
                        <Nav.Link href="/user#payments">{`Баланс: ${user.balance}`}</Nav.Link>
                      </LinkContainer>
                    </Nav>
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
                  </>
                )}
              </>
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
