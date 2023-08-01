import { Router } from 'express';
import * as reportController from '../controller/reportController';

const route = Router();

route.post('/addReport', reportController.addReport);

export default route;