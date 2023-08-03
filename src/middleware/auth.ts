import passport from 'passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import User from '../models/User';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';

interface UserInterface {
  id: number,
  username: string,
  role: 'principal' | 'teacher' | 'student',
  token: string | null
}
passport.use(new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'justInfoSECRET',
  passReqToCallback: true
}, async (req: any, user: UserInterface, done: VerifiedCallback) => {
  try {
    const { id } = user;
    const findUser = await User.findByPk(id, {
      attributes: [ 'id', 'username', 'role', 'token' ],
    }) as UserInterface;
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