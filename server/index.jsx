import bodyParser from 'body-parser';
import React from 'react';
import express from 'express';
import compression from 'compression';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import fs from 'fs';
import path from 'path';
import 'isomorphic-fetch';
import './ignore-styles';
import App from '../src/components/App';
import reducers from '../src/reducers';

const formData = require('express-form-data');

process.env.TZ = 'Europe/Moscow';

// Database
const db = require('./config/database');

const app = express();

app.enable('trust proxy');

app.use(compression());

app.use(formData.parse());

app.use(express.static(path.join(__dirname, '..', 'build'), { index: false }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', require('./api/login/authentication').default);
app.use('/api', require('./api/login/registration').default);
app.use('/api', require('./api/login/recovery').default);
app.use('/api', require('./api/user').default);
app.use('/api', require('./api/tasks').default);

app.get('/*', (req, res) => {
  const filePath = path.resolve(__dirname, '..', 'build', 'index.html');
  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      // logger.error('read err', err);
      console.log('read err', err);
      return res.status(404).end();
    }

    const { url } = req;

    const sheet = new ServerStyleSheet();
    const context = {};

    const store = createStore(reducers);

    const markup = renderToString(
      <StyleSheetManager sheet={sheet.instance}>
        <Provider store={store}>
          <StaticRouter location={url} context={context}>
            <App />
          </StaticRouter>
        </Provider>
      </StyleSheetManager>,
    );

    const styleTags = sheet.getStyleTags();

    const RenderedApp = process.env.NODE_ENV === 'development' ? htmlData : htmlData
      .replace('<style id="serverStyleTags"></style>', styleTags)
      .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);

    return res.send(RenderedApp);
  });
});

const PORT = process.env.PORT || 3000;

const listen = () => app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

if (process.env.NODE_ENV === 'development') {
  db.sync({ alter: true }).then(() => {
    console.log('db running at development mode');
    listen();
  }).catch(e => console.log(e));
} else {
  console.log('db running at production mode');
  listen();
}

app.on('error', (error) => {
  console.log('throw error;');
  throw error;
});
