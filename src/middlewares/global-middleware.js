import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import passport from 'passport';
import session from 'express-session';
import { mainConfig } from '../config/main.config';
import { configureJWTStrategy } from './passport-jwt';
import UserModel from '../models/user.model';
import { configureGoogleStrategy } from './passport-google';

export const setGlobalMiddleware = app => {
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(
//     cookieSession({
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//       keys: [mainConfig.cookieKey]
//     })
//   );
  app.use(cors());
  app.use(
    session({
      secret: mainConfig.secret,
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Methods',
      'GET',
      'POST',
      'DELETE',
      'PUT',
      'OPTIONS'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
  });
  app.use(logger('dev'));
  app.use(passport.initialize({ userProperty: 'currentUser' }));
  app.use(passport.session());
  configureJWTStrategy();
  configureGoogleStrategy();

   // save user into session
  // req.session.user = {userId}
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  // extract the userId from session
  passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err, user) => {
      done(null, user);
    });
  });
  app.get('/failure', (req, res) => res.redirect('http://localhost:4200/login'));
};