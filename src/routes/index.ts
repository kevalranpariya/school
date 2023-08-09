import { NextFunction, Request, Response, Router,Express } from 'express';
import authRoutes from './authRoutes';
import classRoutes from './classRoutes';
import attendanceRoutes from './attendanceRoutes';
import scheduleRoutes from './scheduleRoutes';
import reportRoutes from './reportRoutes';
import passport from 'passport';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';
import { endpoint } from '../constant/endpoint';

export function initRoutes(app: Express) {
  app.use('/', authRoutes(Router()));
  app.use(endpoint.CLASS, passport.authenticate('jwt', { session: false }), classRoutes(Router()));

  app.use(endpoint.REPORT, passport.authenticate('jwt', { session: false }), reportRoutes(Router()));

  app.use(endpoint.ATTENDANCE, passport.authenticate('jwt', { session: false }), attendanceRoutes(Router()));

  app.use(endpoint.SCHEDULE, passport.authenticate('jwt', { session: false }), scheduleRoutes(Router()));

  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    try {
      throw new errHelper(errorTypes.not_found, 'URL not found');
    } catch (err) {
      return next(err);
    }
  });
};