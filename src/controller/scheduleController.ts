import { Request, Response, NextFunction } from 'express';
import { SUCCESS } from '../middleware/responseHandling';
import Schedule from '../models/Schedule';
import Class from '../models/Class';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';
import ClassStudent from '../models/ClassStudent';

export const addSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { class_id } = req.body;
    const { id } = req.user;
    const findClass = await Class.findByPk(class_id);
    if (!(findClass?.teacher_id === id)) {
      throw new errHelper(errorTypes.forbidden, 'Can not access this class');
    }

    const addSchedule = await Schedule.create(req.body);
    return SUCCESS(req, res, addSchedule);
  } catch (err) {
    return next(err);
  }
};

export const viewLecture = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(Object.keys(req.query).length)) {
      const date = new Date();
      req.query.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
    const { id } = req.user;
    const findClassStudent = await ClassStudent.findOne({
      where: {
        student_id: id,
      },
      attributes: ['class_id']
    });
    const findClass = findClassStudent?.class_id;
    const findDate = req.query.date;
    const findSchedule = await Schedule.findAll({
      where: {
        date: findDate,
        class_id: findClass
      }
    });
    if (findSchedule.length) return SUCCESS(req, res, findSchedule);
    else throw new errHelper(errorTypes.not_found, 'Schedule not found');
  } catch (err) {
    return next(err);
  }
};

export const classSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(Object.keys(req.query).length)) {
      const date = new Date();
      req.query.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
    const findDate = req.query.date;
    console.log(findDate, 'ds');
    const findSchedule = await Schedule.findAll({
      where: {
        date: findDate
      }
    });
    if (findSchedule.length) return SUCCESS(req, res, findSchedule);
    else throw new errHelper(errorTypes.not_found, 'Schedule not found');
  } catch (err) {
    return next(err);
  }
};