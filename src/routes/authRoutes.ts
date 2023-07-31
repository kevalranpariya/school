import { Router } from 'express';
import * as authController from '../controller/authController';

const route = Router();

route.post('/register', authController.userRegister);

route.post('/login', authController.userLogin);

export default route;