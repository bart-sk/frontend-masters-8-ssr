import 'ignore-styles';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import universalLoader from './universal';

// Create express server
const app = express();

// Set logging middleware
app.use(morgan('dev'));

// Match only homepage
app.use('^/$', universalLoader);

// Serve static assets
app.use(express.static(path.resolve(process.env.SSR_PUBLIC_FOLDER)));

// Match all other routes
app.use(universalLoader);

export default app;
