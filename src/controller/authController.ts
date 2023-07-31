import { Response, Request } from 'express';
import User from '../models/User';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SUCCESS } from '../middleware/responseHandling';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';

export const userRegister = async (req: Request, res: Response,next:any) => {
  try {
    const userCreate = await User.create(req.body);
    res.status(200).json({
      userCreate
    });
  } catch (err) {
    return next(err);
  }
};

export const userLogin = async (req: Request, res: Response,next:any) => {
  try {
    const { username, password } = req.body;
    const findUser:any = await User.findOne({
      where: {
        username
      }
    });
    if (findUser && await compare(password, findUser.password)) {
      const token = sign({
        id: findUser.id,
        username: findUser.username,
        role: findUser.role
      }, 'Scercet');
      await User.update({ token: token }, {
        where: {
          id: findUser.id,
        }
      });
      return SUCCESS(req, res, token);
    } else throw new errHelper(errorTypes.not_found,'User data & Password not found');

  } catch (err) {
    return next(err);
  }
};
