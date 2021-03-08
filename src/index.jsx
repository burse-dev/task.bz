import '@babel/polyfill';
import React from 'react';
import { YMInitializer } from 'react-yandex-metrika';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import App from './components/App';
import reducers from './reducers';

const jwtToken = localStorage.getItem('JWT_TOKEN');
// const locationRegion = localStorage.getItem('LOCATION_REGION');

const ScrollToTop = () => {
  window.scrollTo(0, 0);
  return null;
};

ReactDOM.render(
  <Provider store={createStore(reducers,
    {
      auth: {
        token: jwtToken,
        isAuthenticated: !!jwtToken,
      },
    },
    applyMiddleware(reduxThunk))}
  >
    <YMInitializer accounts={[73253464]} options={{ webvisor: true }} />
    <Router>
      <div>
        <Route component={ScrollToTop} />
        <App />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
