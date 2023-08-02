import { Router } from 'express';
import * as scheduleController from '../controller/scheduleController';
import checkUserRole from '../middleware/checkUserRole';

const route = Router();

route.post('/addSchedule', checkUserRole(['teacher']), scheduleController.addSchedule);

route.get('/viewLecture', scheduleController.viewLecture);

export default route;