import { Router } from 'express';
import * as scheduleController from '../controller/scheduleController';
import checkUserRole from '../middleware/checkUserRole';

const route = Router();

route.post('/addSchedule', checkUserRole(['teacher']), scheduleController.addSchedule);

route.get('/viewLecture', checkUserRole(['student']), scheduleController.viewLecture);

export default route;