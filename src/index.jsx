import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './components/App';

const ScrollToTop = () => {
  window.scrollTo(0, 0);
  return null;
};

ReactDOM.render(
  <Router>
    <div>
      <Route component={ScrollToTop} />
      <App/>
    </div>
  </Router>,
  document.getElementById('root'),
);
