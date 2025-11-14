const express = require('express');
const routes = require('./routes');
const config = require('./config/env');

const app = express();

const allowOrigin = (origin) => {
  if (!origin || config.corsAllowedOrigins.length === 0) {
    return true;
  }

  return config.corsAllowedOrigins.includes(origin);
};

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowOrigin(origin)) {
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
    } else if (config.corsAllowedOrigins.length === 0) {
      res.header('Access-Control-Allow-Origin', '*');
    }

    res.header(
      'Access-Control-Allow-Headers',
      req.headers['access-control-request-headers'] || 'Content-Type, Authorization'
    );
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }

    return next();
  }

  return res.status(403).json({ message: 'Not allowed by CORS' });
});

app.use(express.json());
app.use('/', routes);

// Basic error handler to avoid leaking errors
app.use((err, req, res, next) => {
  console.error('[app:error]', err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
