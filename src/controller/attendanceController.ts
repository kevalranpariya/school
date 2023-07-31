import { Request, Response } from 'express';
import Attendance from '../models/Attendance';
import { SUCCESS } from '../middleware/responseHandling';

export const addRecord = async (req: Request, res: Response, next: any) => {
  try {
    const addRecord = await Attendance.create(req.body);
    return SUCCESS(req, res);
  } catch (err) {
    return next(err);
  }
};