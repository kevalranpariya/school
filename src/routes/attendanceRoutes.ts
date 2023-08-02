import { Router } from 'express';
import * as attendanceController from '../controller/attendanceController';
import checkUserRole from '../middleware/checkUserRole';

const route = Router();

route.post('/addRecord', checkUserRole(['teacher']), attendanceController.addRecord);

route.get('/viewRecord', checkUserRole(['student']), attendanceController.viewRecord);

export default route;