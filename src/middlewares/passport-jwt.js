import PassportJWT from 'passport-jwt';
import passport from 'passport';
import { mainConfig } from '../config/main.config';
import UserModel from '../models/user.model';

export const configureJWTStrategy = () => {
  const opts = {};
  opts.jwtFromRequest = PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = mainConfig.secret;
  passport.use(
    new PassportJWT.Strategy(opts, (payload, done) => {
        UserModel.findOne({ _id: payload.id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        }
        return done(null, false);
        // or you could create a new account
      });
    })
  );
};