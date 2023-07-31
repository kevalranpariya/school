import passport from 'passport';
import { Strategy, ExtractJwt,VerifiedCallback } from 'passport-jwt';
import User from '../models/User';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';

passport.use(new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'Scercet',
  passReqToCallback: true
}, async (req:any,user:any, done:VerifiedCallback) => {
  try {
    const { id } = user;
    const findUser:any = await User.findByPk(id, {
      attributes: [ 'id', 'username', 'role','token' ],
    });
    const { token } = findUser;
    const bearerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (bearerToken == token) {
      return done(null, findUser);
    }
    else {
      throw new errHelper(errorTypes.unauthorized, 'Invalid Token');
    }
  } catch (err) {
    return done(err, false);
  }
}));

passport.serializeUser(async (user:any, done:VerifiedCallback) => {
  try {
    return done(null, user.id);
  } catch (err) {
    return done(err, false);
  }
});

passport.deserializeUser(async (id:number,done:VerifiedCallback) => {
  try {
    const findUser:any = await User.findByPk(id);
    return done(null,findUser);
  } catch (err) {
    return done(err, false);
  }
});

export default passport;