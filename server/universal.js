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
import 'ignore-styles';
import serialize from 'serialize-javascript';
import '../src/globalStyles';
import theme from '../src/theme';
import createRoutes from '../src/routes';
import configureStore from '../src/configureStore';
import API from '../src/API';

// Setup for react app
API.setBaseUrl(process.env.REACT_APP_API_BASE_URL);

// Create routes
const routes = createRoutes({});

// Load default index.html as string
let defaultPage = '';
const filePath = path.resolve(process.env.SSR_PUBLIC_FOLDER, 'index.html');
fs.readFile(filePath, 'utf8', (readError, htmlData) => {
  if (readError) {
    console.error('read error', readError);
  } else {
    console.error('Default page is ready!');
    defaultPage = htmlData;
  }
});

function renderPage(store, renderProps) {
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
  const state = store.getState();

  const renderedPage = defaultPage
    .replace('<div id="root"></div>', `<div id="root">${ReactApp}</div>`)
    .replace('</head>', `${styleTags}</head>`)
    .replace('"{{SSR_INITIAL_STATE}}"', serialize(state, { isJSON: true }))
    .replace('<title></title>', title)
    .replace('<meta id="helmet">', meta);
  return renderedPage;
}

async function makeStore(res, renderProps) {
  // Create store
  const store = configureStore();
  // Fetch all data
  const { components } = renderProps;
  for (let i = 0; i < components.length; i++) {
    const comp = components[i];
    if (comp && comp.fetchData) {
      try {
        // -- JUMP TO SLIDES
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

  // const promises = components
  //   .filter(comp => comp && comp.fetchData)
  //   .map(comp => comp.fetchData({ store, renderProps }));
  // try {
  //   await Promise.all(promises);
  // } catch (error) {
  //   if (error.identifier === 'NOT_FOUND') {
  //     res.status(404);
  //   } else {
  //     console.error('fetch failed: ', error);
  //   }
  // }

  return store;
}

function isNotFound(components) {
  if (components.length === 0) return true;
  if (components[components.length - 1].name === 'NotFound') return true;
  return false;
}

/* SSR FLOW ON SERVER */

// 1. Match route
// 2. Fetch data
// 3. Render page
// 4. Send prerendered page

const universalLoader = (req, res) => {
  // 1. Match route
  match({ routes, location: req.url }, async (err, redirect, renderProps) => {
    if (err) {
      console.error('match err', err);
      return res.status(404).end();
    } else if (redirect) {
      return res.redirect(302, redirect.pathname + redirect.search);
    } else if (renderProps) {
      // 2. Fetch all data and fill redux store
      const store = await makeStore(res, renderProps);

      if (isNotFound(renderProps.components)) res.status(404);
      // 3. Render page
      const renderedPage = renderPage(store, renderProps);
      // 4. Send prerendered page
      return res.send(renderedPage);
    }
    return res.status(404).end();
  });
};

export default universalLoader;
