import { Request, Response } from 'express';
import Attendance from '../models/Attendance';
import { SUCCESS } from '../middleware/responseHandling';
import Class from '../models/Class';
import ClassStudent from '../models/ClassStudent';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';

export const addRecord = async (req: Request, res: Response, next: any) => {
  try {
    const { id }: any = req.user;
    const { student_id }: any = req.body;
    const findClassStudent:any = await ClassStudent.findOne({
      where: {
        student_id: student_id
      },
      attributes: ['class_id'],
      include: {
        model: Class,
        attributes: ['teacher_id']
      }
    });
    const classTeacherId: number = findClassStudent?.Class.teacher_id;
    if (!(classTeacherId == id)) throw new errHelper(errorTypes.forbidden, 'Can not access this Student!!');
    const addRecord = await Attendance.create(req.body);
    return SUCCESS(req, res, addRecord);
  } catch (err) {
    return next(err);
  }
};