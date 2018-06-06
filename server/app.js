import { config } from 'dotenv';
import 'ignore-styles';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import universalLoader from './universal';

require('babel-register')({
  ignore: /\/(build|node_modules)\//,
  presets: ['env', 'react-app'],
});

const app = express();

config();
app.use(morgan('dev'));

app.use('^/$', universalLoader);

// Serve static assets
app.use(express.static(path.resolve(process.env.SSR_PUBLIC_FOLDER)));

app.use('/', universalLoader);
