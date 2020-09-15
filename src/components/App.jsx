import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Feed from './Feed';
import Task from './Task';
import PageNotFount from './PageNotFount';

export default () => (
  <>
    <Switch>
      <Route exact path="/" component={Feed} />

      <Route exact path="/feed" component={Feed} />
      <Route exact path="/task/:id" component={Task} />

      <Route path="*" component={PageNotFount} />
    </Switch>
  </>
);
