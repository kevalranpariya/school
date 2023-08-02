import { Request, Response, NextFunction } from 'express';

export default (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const { role }:any = req.user;
  if (req.user && allowedRoles.includes(role)) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden. Insufficient role access.' });
  }
};