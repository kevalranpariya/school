import { Request, Response, NextFunction } from 'express';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';
import { notAccessMessage } from '../utils/printMessage';

export default (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.user;
    if (req.user && allowedRoles.includes(role)) {
      next();
    } else {
      throw new errHelper(errorTypes.forbidden, notAccessMessage('URL'));
    }
  } catch (err) {
    return next(err);
  }
};