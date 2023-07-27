import { Response, Request } from 'express';
import User from '../models/User';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export const userRegister = async (req: Request, res: Response) => {
  try {
    const userCreate = await User.create(req.body);
    res.status(200).json({
      userCreate
    });
  } catch (err) {
    console.log(err);
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const findUser: any = await User.findOne({
      where: {
        username
      }
    });
      if (findUser && await compare(password, findUser.password)) {
        console.log(findUser)
          const token = await sign({ username : findUser.username,password : findUser.password}, 'Scerect');
        console.log(token)
    } else console.log('Not found User');
  } catch (err) {
    console.log(err);
  }
};
