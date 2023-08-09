import { Router } from 'express';
import { AuthController } from '../controller';

export default (route: Router): Router => {
  const authController = new AuthController();

  route.post('/register', authController.userRegister);
  route.post('/login', authController.userLogin);
  return route;
};