import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Feed from './Feed';
import Login from './Login';
import Registration from './Login/Registration';
import Recovery from './Login/Recovery';
import Task from './Task';
import TaskExecution from './Task/TaskExecution';
import User from './User';
import PageNotFount from './PageNotFount';
import EditTask from './EditTask';
import TasksList from './TasksList';
import TaskCheck from './TasksList/Check';
import WorksList from './WorksList';
import Tickets from './Tickets';
import About from './About';
import Offer from './Offer';
import Help from './Help';
import Footer from './Footer';
import Users from './Users';
import Mailing from './Mailing';
import Header from './Header';
import Messages from './Messages';
import NewMessage from './Messages/NewMessage';
import Dialog from './Messages/Dialog';

export default () => (
  <>
    <Header />
    <Switch>
      <PrivateRoute exact path="/" component={Feed} />
      <PrivateRoute exact path="/feed" component={Feed} />

      <PrivateRoute exact path="/tasks-list" component={TasksList} />

      <PrivateRoute exact path="/tasks-list/check/:id" component={TaskCheck} />

      <PrivateRoute exact path="/tasks-list/add" component={EditTask} />
      <PrivateRoute exact path="/tasks-list/edit/:id" component={EditTask} />

      <PrivateRoute exact path="/works-list" component={WorksList} />

      <PrivateRoute exact path="/create" component={EditTask} />

      <PrivateRoute exact path="/tickets" component={Tickets} />

      <PrivateRoute exact path="/user" component={User} />
      <PrivateRoute exact path="/payments" component={User} />

      <Route exact path="/login" component={Login} />
      <Route exact path="/login/recovery" component={Recovery} />
      <Route exact path="/login/registration" component={Registration} />

      <Route exact path="/about" component={About} />
      <Route exact path="/offer" component={Offer} />
      <Route exact path="/help" component={Help} />

      <PrivateRoute exact path="/task/:id" component={Task} />

      <PrivateRoute exact path="/task-execution/:id" component={TaskExecution} />

      <PrivateRoute exact path="/users" component={Users} />

      <PrivateRoute exact path="/mailing" component={Mailing} />

      <PrivateRoute exact path="/messages" component={Messages} />
      <PrivateRoute exact path="/messages/dialog/:id" component={Dialog} />
      <PrivateRoute exact path="/messages/new" component={NewMessage} />

      {/* <Route exact path="/admin/tasks/:id" component={CreateTask} /> */}

      <Route path="*" component={PageNotFount} />
    </Switch>
    <Footer />
  </>
);
