import { Router } from 'express';
import { ScheduleController } from '../controller';
import checkUserRole from '../middleware/checkUserRole';

export default (route: Router): Router => {
  const scheduleController = new ScheduleController();

  route.post('/addSchedule', checkUserRole(['teacher']), scheduleController.addSchedule);
  route.get('/viewLecture', checkUserRole(['student']), scheduleController.viewLecture);
  route.put('/updateSchedule/:id', checkUserRole(['teacher']), scheduleController.updateSchedule);
  route.get('/classSchedule', checkUserRole(['principal']), scheduleController.classSchedule);
  route.delete('/deleteSchedule/:id', checkUserRole(['teacher']), scheduleController.deleteSchedule);
  route.get('/teacherClassSchedule', checkUserRole(['teacher']), scheduleController.teacherClassSchedule);
  return route;
};