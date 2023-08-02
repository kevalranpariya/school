import passport from 'passport';
import { Strategy, ExtractJwt,VerifiedCallback } from 'passport-jwt';
import User from '../models/User';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';

interface findUserInterface{
  id: number,
  username: string,
  role: string,
  token: string | null
}

passport.use(new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'Scercet',
  passReqToCallback: true
}, async (req:any,user:any, done:VerifiedCallback) => {
  try {
    const { id } = user;
    const findUser = await User.findByPk(id, {
      attributes: [ 'id', 'username', 'role', 'token' ],
    }) as findUserInterface;
    const token = findUser?.token;
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


export default passport;