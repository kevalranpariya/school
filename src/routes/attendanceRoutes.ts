import { Router } from 'express';
import { AttendanceController } from '../controller';
import checkUserRole from '../middleware/checkUserRole';

export default (route: Router): Router => {
  const attendanceController = new AttendanceController();

  route.post('/addRecord', checkUserRole(['teacher']), attendanceController.addRecord);
  route.get('/viewRecord', checkUserRole(['student']), attendanceController.viewRecord);
  route.get('/viewAttendance', checkUserRole(['principal']), attendanceController.viewAttendance);
  route.put('/updateAttendance/:id', checkUserRole(['teacher']), attendanceController.updateAttendance);
  route.delete('/deleteRecord/:id', checkUserRole(['teacher']), attendanceController.deleteRecord);
  route.get('/viewTeacherAttendance', checkUserRole(['teacher']), attendanceController.viewTeacherAttendance);
  return route;
};