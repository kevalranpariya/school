import { Router } from 'express';
import authRoutes from './authRoutes';
import classRoutes from './classRoutes';
import attendanceRoutes from './attendanceRoutes';
import passport from 'passport';
import checkUserRole from '../middleware/checkUserRole';
const route = Router();

route.use('/', authRoutes);

route.use('/class', passport.authenticate('jwt', { session: false }), checkUserRole(['principal']), classRoutes);

route.use('/attendance', passport.authenticate('jwt', { session: false }), checkUserRole(['teacher']), attendanceRoutes);

export default route;