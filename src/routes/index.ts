import { NextFunction, Request, Response, Router } from 'express';
import authRoutes from './authRoutes';
import classRoutes from './classRoutes';
import attendanceRoutes from './attendanceRoutes';
import scheduleRoutes from './scheduleRoutes';
import reportRoutes from './reportRoutes';
import passport from 'passport';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';

const route = Router();

route.use('/', authRoutes);

route.use('/class', passport.authenticate('jwt', { session: false }), classRoutes);

route.use('/attendance', passport.authenticate('jwt', { session: false }), attendanceRoutes);

route.use('/schedule', passport.authenticate('jwt', { session: false }), scheduleRoutes);

route.use('/report', passport.authenticate('jwt', { session: false }), reportRoutes);

route.all('*', (req:Request, res:Response,next:NextFunction) => {
  try {
    throw new errHelper(errorTypes.not_found, 'URL not found');
  } catch (err) {
    return next(err);
  }
});

export default route;