import { Router } from 'express';
import userAuth from './userAuth';
const route = Router();

route.use('/', userAuth);

export default route;