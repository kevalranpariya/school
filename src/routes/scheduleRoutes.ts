import { Router } from 'express';
import * as scheduleController from '../controller/scheduleController';
import checkUserRole from '../middleware/checkUserRole';

const route = Router();

route.post('/addSchedule', checkUserRole(['teacher']), scheduleController.addSchedule);

route.get('/viewLecture', checkUserRole(['student']), scheduleController.viewLecture);

route.put('/updateSchedule/:id', checkUserRole(['teacher']), scheduleController.updateSchedule);

route.get('/classSchedule', checkUserRole(['principal']), scheduleController.classSchedule);

route.delete('/deleteSchedule/:id', checkUserRole(['teacher']), scheduleController.deleteSchedule);

route.get('/teacherClassSchedule', checkUserRole(['teacher']), scheduleController.teacherClassSchedule);

export default route;