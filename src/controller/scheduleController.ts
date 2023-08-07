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
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const { id } = req.user;
    const findSchedule = await ClassStudent.findOne({
      where: {
        student_id: id
      },
      include: {
        model: Schedule,
        where: {
          date: date
        }
      }
    });
    if (!findSchedule) throw new errHelper(errorTypes.not_found, 'Schedule not found');
    return SUCCESS(req, res, findSchedule);

  } catch (err) {
    return next(err);
  }
};

export const updateSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { class_id } = req.body;
    const { id } = req.user;
    const findSchedule = await Schedule.findByPk(req.params.id, {
      include: {
        model: Class,
        attributes: ['teacher_id'],
        where: {
          teacher_id: id
        }
      },
      attributes: ['class_id']
    });
    if (!findSchedule) throw new errHelper(errorTypes.forbidden, 'Can not access this schedule');
    const findClass = await Class.findByPk(class_id);
    if (!(findClass?.teacher_id == id)) throw new errHelper(errorTypes.forbidden, 'Can not access this class');
    await Schedule.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    return SUCCESS(req, res);
  } catch (err) {
    return next(err);
  }
};

export const classSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const { class_id } = req.query;
    const findSchedule = await ClassStudent.findOne({
      where: {
        class_id: class_id
      },
      attributes: ['class_id'],
      include: {
        model: Schedule,
        where: {
          date: date
        }
      }
    });
    if (!findSchedule) throw new errHelper(errorTypes.not_found, 'Schedule not found');
    return SUCCESS(req, res, findSchedule);
  } catch (err) {
    return next(err);
  }
};

export const deleteSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user;
    const findSchedule = await Schedule.findByPk(req.params.id, {
      include: {
        model: Class,
        attributes: ['teacher_id'],
        where: {
          teacher_id: id
        }
      },
      attributes: ['class_id']
    });
    if (!(findSchedule)) throw new errHelper(errorTypes.forbidden, 'Can not access this schedule');

    await Schedule.destroy({
      where: {
        id: req.params.id
      }
    });
    return SUCCESS(req, res);
  } catch (err) {
    return next(err);
  }
};

export const teacherClassSchedule = async (req:Request,res:Response,next:NextFunction) => {
  try {
    const { id } = req.user;
    const findSchedule = await Schedule.findAll({
      include: {
        model: Class,
        where: {
          teacher_id: id
        },
        attributes: []
      }
    });
    if (!findSchedule.length) throw new errHelper(errorTypes.not_found, 'Today has no lectures');
    return SUCCESS(req, res, findSchedule);
  } catch (err) {
    return next(err);
  }
};