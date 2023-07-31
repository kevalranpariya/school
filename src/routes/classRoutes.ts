import { Router } from 'express';

import * as classController from '../controller/classController';

const route = Router();

route.post('/addClass', classController.addClass);

route.delete('/removeClass/:id', classController.removeClass);

export default route;