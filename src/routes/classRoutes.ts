import { Router } from 'express';

import * as classController from '../controller/classController';
import checkUserRole from '../middleware/checkUserRole';

const route = Router();

route.post('/addClass', checkUserRole(['principal']),classController.addClass);

route.delete('/removeClass/:id', checkUserRole(['principal']), classController.removeClass);

route.put('/classUpdate/:id', checkUserRole(['principal']), classController.classUpdate);

route.post('/addStudent', checkUserRole(['teacher']), classController.addStudent);

route.put('/updateStudentClass/:id', checkUserRole(['teacher']), classController.updateStudentClass);

route.delete('/removeStudent/:id', checkUserRole(['teacher']), classController.removeStudent);

route.get('/allClass', checkUserRole(['principal']), classController.allClass);

route.get('/allStudentClass', checkUserRole(['teacher']), classController.allStudentClass);

export default route;