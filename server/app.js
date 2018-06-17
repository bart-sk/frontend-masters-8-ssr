import express from 'express';
import path from 'path';
import universalLoader from './universal';

// Create express server
const app = express();

// Match only homepage
app.use('^/$', universalLoader);

// Serve static assets
app.use(express.static(path.resolve(process.env.SSR_PUBLIC_FOLDER)));

// Match all other routes
app.use(universalLoader);

export default app;
