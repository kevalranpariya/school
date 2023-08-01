import { Router } from 'express';
import authRoutes from './authRoutes';
import classRoutes from './classRoutes';
import attendanceRoutes from './attendanceRoutes';
import scheduleRoutes from './scheduleRoutes';
import reportRoutes from './reportRoutes';
import passport from 'passport';
import checkUserRole from '../middleware/checkUserRole';
const route = Router();

route.use('/', authRoutes);

route.use('/class', passport.authenticate('jwt', { session: false }), classRoutes);

route.use('/attendance', passport.authenticate('jwt', { session: false }), checkUserRole(['teacher']), attendanceRoutes);

route.use('/schedule', passport.authenticate('jwt', { session: false }), scheduleRoutes);

route.use('/report', passport.authenticate('jwt', { session: false }), checkUserRole(['teacher']), reportRoutes);

export default route;