import express ,{ Express,urlencoded } from 'express';
import { config } from 'dotenv';
import route from './routes/index';
import './config/sequelize';
import './models/User';
config();
const server:Express = express();
server.use(urlencoded());
server.use(route);

server.listen(process.env.PORT);