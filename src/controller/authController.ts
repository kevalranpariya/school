import { Response, Request, NextFunction } from 'express';
import User from '../models/User';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SUCCESS } from '../middleware/responseHandling';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';

export const userRegister = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const userCreate = await User.create(req.body);
    return SUCCESS(req, res, userCreate);
  } catch (err) {
    return next(err);
  }
};

export const userLogin = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { username, password } = req.body;
    const findUser = await User.findOne({
      where: {
        username
      }
    });
    if (findUser && await compare(password, findUser.password)) {
      const { id,username,role } = findUser;
      const token = sign({ id, username, role }, 'justInfoSECRET');
      findUser.token = token;
      await findUser.save();
      return SUCCESS(req, res, token);
    } else throw new errHelper(errorTypes.not_found,'User data & Password not found');
  } catch (err) {
    return next(err);
  }
};
