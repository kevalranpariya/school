import { Request, Response, NextFunction } from 'express';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';

export default (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.user;
    if (req.user && allowedRoles.includes(role)) {
      next();
    } else {
      throw new errHelper(errorTypes.forbidden, 'Insufficient role access.');
    }
  } catch (err) {
    return next(err);
  }
};