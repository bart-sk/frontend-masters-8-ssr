import React from 'react';
import fs from 'fs';
import path from 'path';
import { Helmet } from 'react-helmet';
import {
  ThemeProvider,
  ServerStyleSheet,
  StyleSheetManager,
} from 'styled-components';
import 'sanitize.css/sanitize.css';
import '../src/globalStyles';
import { theme } from '../src/theme';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import createRoutes from '../src/routes';
import configureStore from '../src/configureStore';
import { Provider } from 'react-redux';
import API from '../src/API';

// Setup for react app
API.setBaseUrl(process.env.REACT_APP_API_BASE_URL);

// Create routes
const routes = createRoutes({});

// Handle routing and send rendered page
const universalLoader = (req, res) => {
  const filePath = path.resolve(process.env.SSR_PUBLIC_FOLDER, 'index.html');
  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('read err', err);
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
