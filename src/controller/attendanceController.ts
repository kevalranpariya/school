import { Request, Response } from 'express';
import Attendance from '../models/Attendance';
import { SUCCESS } from '../middleware/responseHandling';
import Class from '../models/Class';
import ClassStudent from '../models/ClassStudent';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';
import { NextFunction } from 'express-serve-static-core';

export const addRecord = async (req: Request, res: Response, next: any) => {
  try {
    const { id } = req.user;
    const { student_id } = req.body;
    const findClassStudent = await ClassStudent.findOne({
      where: {
        student_id: student_id
      },
      attributes: ['class_id'],
      include: {
        model: Class,
        attributes: ['teacher_id']
      }
    });
    const classTeacherId: number = findClassStudent?.Class?.teacher_id;
    if (!(classTeacherId == id)) throw new errHelper(errorTypes.forbidden, 'Can not access this Student!!');
    const addRecord = await Attendance.create(req.body);
    return SUCCESS(req, res, addRecord);
  } catch (err) {
    return next(err);
  }
};

export const viewRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user;
    const findAttendance = await Attendance.findAll({
      where: {
        student_id: id
      }
    });
    return SUCCESS(req,res,findAttendance);
  } catch (err) {
    return next(err);
  }
};