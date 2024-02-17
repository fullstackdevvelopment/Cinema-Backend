import express from 'express';
import morgan from 'morgan';
import HttpError from 'http-errors';
import path from 'path';
import http from 'http';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import cors from './middlewares/cors.js';
import routes from './routes/index.js';
import authorizationMiddleware from './middlewares/authorizationMiddleware.js';

const {
  PORT,
  CLIENT_ID,
  CLIENT_SECRET,
} = process.env;

const app = express();

app.use(cors);
app.use(authorizationMiddleware);
app.use(morgan('dev'));
app.use(express.urlencoded());
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

server.listen(PORT);

// Настройка OAuth2 для получения refresh token
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'http://localhost:3000/auth/google/callback',
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.send',
  ],
});

console.log('Authorize this app by visiting this URL:', authUrl);

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log('Refresh token:', tokens.refresh_token);

    // Используйте refresh token для отправки электронной почты
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'cinemafmovie@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: tokens.refresh_token,
      },
    });

    const mailOptions = {
      from: 'cinemafmovie@gmail.com',
      to: 'razopetrosyan505349@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email sent using OAuth2 authentication with Nodemailer.',
    };

    await transporter.sendMail(mailOptions);

    res.send('Email sent successfully');
  } catch (error) {
    console.error('Error retrieving access token:', error.message);
    res.status(500).send('Error retrieving access token');
  }
});
