import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Feed from './Feed';
import Login from './Login';
import Registration from './Login/Registration';
import Recovery from './Login/Recovery';
import Task from './Task';
import User from './User';
import PageNotFount from './PageNotFount';

export default () => (
  <>
    <Switch>
      <Route exact path="/" component={Feed} />

      <Route exact path="/feed" component={Feed} />

      <Route exact path="/user" component={User} />
      <Route exact path="/payments" component={User} />

      <Route exact path="/login" component={Login} />
      <Route exact path="/login/recovery" component={Recovery} />
      <Route exact path="/login/registration" component={Registration} />

      <Route exact path="/task/:id" component={Task} />

      <Route path="*" component={PageNotFount} />
    </Switch>
  </>
);
