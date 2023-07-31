import { Router } from 'express';
import * as attendanceController from '../controller/attendanceController';

const route = Router();

route.post('/addRecord', attendanceController.addRecord);

export default route;