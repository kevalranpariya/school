import { Router } from 'express';
import * as reportController from '../controller/reportController';
import checkUserRole from '../middleware/checkUserRole';

const route = Router();

route.post('/addReport', checkUserRole(['teacher']), reportController.addReport);

route.get('/viewReport',checkUserRole(['principal']), reportController.viewReport);

export default route;