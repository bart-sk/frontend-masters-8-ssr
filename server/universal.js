import React from 'react';
import fs from 'fs';
import path from 'path';
import { Helmet } from 'react-helmet';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import {
  ThemeProvider,
  ServerStyleSheet,
  StyleSheetManager,
} from 'styled-components';
import 'sanitize.css/sanitize.css';
import '../src/globalStyles';
import theme from '../src/theme';
import createRoutes from '../src/routes';
import configureStore from '../src/configureStore';
import API from '../src/API';

// Setup for react app
API.setBaseUrl(process.env.REACT_APP_API_BASE_URL);

// Create routes
const routes = createRoutes({});

function renderApp(res, renderProps, store, htmlData) {
  const sheet = new ServerStyleSheet();
  const ReactApp = renderToString(
    <StyleSheetManager sheet={sheet.instance}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <RouterContext {...renderProps} />
        </ThemeProvider>
      </Provider>
    </StyleSheetManager>,
  );
  const head = Helmet.renderStatic();
  const title = head.title.toString();
  const meta = head.meta.toString();
  const styleTags = sheet.getStyleTags();

  const RenderedApp = htmlData
    .replace('<div id="root"></div>', `<div id="root">${ReactApp}</div>`)
    .replace('</head>', `${styleTags}</head>`)
    .replace('"{{SSR_INITIAL_STATE}}"', JSON.stringify(store.getState()))
    .replace('<title></title>', title)
    .replace('<meta id="helmet">', meta);
  res.send(RenderedApp);
}

async function renderPage(res, renderProps, htmlData) {
  // Create store
  const store = configureStore();
  // Fetch all data
  const { components } = renderProps;
  for (let i = 0; i < components.length; i++) {
    const comp = components[i];
    if (comp && comp.fetchData) {
      try {
        await comp.fetchData({ store, renderProps }); // eslint-disable-line
      } catch (error) {
        if (error.identifier === 'NOT_FOUND') {
          res.status(404);
        } else {
          console.error('fetch failed: ', error);
        }
      }
    }
  }
  // Render app
  renderApp(res, renderProps, store, htmlData);
}

// Handle routing and send rendered page
const universalLoader = (req, res) => {
  const filePath = path.resolve(process.env.SSR_PUBLIC_FOLDER, 'index.html');
  fs.readFile(filePath, 'utf8', (readError, htmlData) => {
    if (readError) {
      console.error('read error', readError);
      return res.status(404).end();
    }
    match({ routes, location: req.url }, (err, redirect, renderProps) => {
      if (err) {
        console.error('match err', err);
        return res.status(404).end();
      } else if (redirect) {
        res.redirect(302, redirect.pathname + redirect.search);
      } else if (renderProps) {
        renderPage(res, renderProps, htmlData);
      } else {
        return res.status(404).end();
      }
    });
  });
};

export default universalLoader;
