import { Router } from 'express';
import * as attendanceController from '../controller/attendanceController';
import checkUserRole from '../middleware/checkUserRole';

const route = Router();

route.post('/addRecord', checkUserRole(['teacher']), attendanceController.addRecord);

route.get('/viewRecord', checkUserRole(['student']), attendanceController.viewRecord);

route.get('/viewAttendance', checkUserRole(['principal']), attendanceController.viewAttendance);

route.put('/updateAttendance/:id', checkUserRole(['teacher']), attendanceController.updateAttendance);

route.delete('/deleteRecord/:id', checkUserRole(['teacher']), attendanceController.deleteRecord);

route.get('/viewTeacherAttendance', checkUserRole(['teacher']), attendanceController.viewTeacherAttendance);

export default route;