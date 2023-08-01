import { Router } from 'express';

import * as classController from '../controller/classController';
import checkUserRole from '../middleware/checkUserRole';

const route = Router();

route.post('/addClass', checkUserRole(['principal']),classController.addClass);

route.delete('/removeClass/:id', checkUserRole(['principal']), classController.removeClass);

route.post('/addStudent', checkUserRole(['teacher']), classController.addStudent);

route.delete('/removeStudent/:id', checkUserRole(['teacher']), classController.removeStudent);
export default route;