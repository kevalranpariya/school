import express ,{ Express,urlencoded } from 'express';
import { config } from 'dotenv';
import route from './routes/index';
import './config/sequelize';
import errorHandling from './middleware/errorHandling';
import './middleware/auth';
import passport from 'passport';

config();
const server:Express = express();
server.use(urlencoded());
server.use(passport.initialize());
server.use(route);

server.use(errorHandling);

server.listen(process.env.PORT);