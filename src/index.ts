import express ,{ Express,urlencoded } from 'express';
import { config } from 'dotenv';
import { initRoutes } from './routes/index';
import './config/sequelize';
import errorHandling from './middleware/errorHandling';
import './middleware/auth';
import passport from 'passport';
import cors from 'cors';

config();

export default class Server{
  private server: Express;
  constructor() {
    this.server = express();
    this.server.use(urlencoded({
      extended: true
    }));
    this.server.use(passport.initialize());
    this.server.use(cors());
    initRoutes(this.server);
    this.server.use(errorHandling);
    this.server.listen(process.env.PORT);
  }
};

new Server();