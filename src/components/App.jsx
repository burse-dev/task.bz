import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Feed from './Feed';
import Login from './Login';
import Registration from './Login/Registration';
import Recovery from './Login/Recovery';
import Task from './Task';
import User from './User';
import PageNotFount from './PageNotFount';
import EditTask from './EditTask';
import TasksList from './TasksList';
import TaskCheck from './TasksList/Check';
import WorksList from './WorksList';
import Tickets from './Tickets';
import Footer from './Footer';
import Header from './Header';

export default () => (
  <>
    <Header />
    <Switch>
      <Route exact path="/" component={Feed} />

      <Route exact path="/feed" component={Feed} />

      <Route exact path="/tasks-list" component={TasksList} />

      <Route exact path="/tasks-list/check/:id" component={TaskCheck} />

      <Route exact path="/tasks-list/add" component={EditTask} />
      <Route exact path="/tasks-list/edit/:id" component={EditTask} />

      <Route exact path="/works-list" component={WorksList} />

      <Route exact path="/create" component={EditTask} />

      <Route exact path="/tickets" component={Tickets} />

      <Route exact path="/user" component={User} />
      <Route exact path="/payments" component={User} />

      <Route exact path="/login" component={Login} />
      <Route exact path="/login/recovery" component={Recovery} />
      <Route exact path="/login/registration" component={Registration} />

      <Route exact path="/task/:id" component={Task} />

      {/* <Route exact path="/admin/tasks/:id" component={CreateTask} /> */}

      <Route path="*" component={PageNotFount} />
    </Switch>
    <Footer />
  </>
);
