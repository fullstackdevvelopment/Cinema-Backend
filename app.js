import express from 'express';
import morgan from 'morgan';
import HttpError from 'http-errors';
import path from 'path';
import http from 'http';
import corsM from './middlewares/corsM.js';
import routes from './routes/index.js';
import authorizationM from './middlewares/authorizationM.js';

const { PORT } = process.env;

const app = express();

app.use(corsM);
app.use(authorizationM);
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve('public')));

app.use(routes);

app.use((req, res, next) => next(HttpError(404)));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(+err.status || 500);
  res.json({
    status: 'error',
    message: err.message,
    stack: err.stack,
    errors: err.errors,
  });
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
