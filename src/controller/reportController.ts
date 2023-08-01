import { Request, Response, NextFunction } from 'express';
import Report from '../models/Report';
import { SUCCESS } from '../middleware/responseHandling';
export const addReport = async (req: Request, res:Response, next:NextFunction) => {
  try {
    const { id }: any = req.user;
    req.body.teacher_id = id;
    const addReport = await Report.create(req.body);
    return SUCCESS(req, res, addReport);
  } catch (err) {
    return next(err);
  }
};