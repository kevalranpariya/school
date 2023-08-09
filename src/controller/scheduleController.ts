import { Request, Response, NextFunction } from 'express';
import { SUCCESS } from '../middleware/responseHandling';
import { Schedule, Class, ClassStudent } from '../models';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';
import { notAccessMessage, notFoundMessage } from '../utils/printMessage';

export default class ScheduleController{
  addSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { class_id } = req.body;
      const { id } = req.user;
      const findClass = await Class.findByPk(class_id);
      if (!(findClass?.teacher_id === id)) {
        throw new errHelper(errorTypes.forbidden, notAccessMessage('class'));
      }

      const addSchedule = await Schedule.create(req.body);
      return SUCCESS(req, res, addSchedule);
    } catch (err) {
      return next(err);
    }
  };

  viewLecture = async (req: Request, res: Response, next: NextFunction) => {
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
      if (!findSchedule) throw new errHelper(errorTypes.not_found, notFoundMessage('Schedule'));
      return SUCCESS(req, res, findSchedule);

    } catch (err) {
      return next(err);
    }
  };

  updateSchedule = async (req: Request, res: Response, next: NextFunction) => {
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
      if (!findSchedule) throw new errHelper(errorTypes.forbidden, notAccessMessage('schedule'));
      const findClass = await Class.findByPk(class_id);
      if (!(findClass?.teacher_id == id)) throw new errHelper(errorTypes.forbidden, notAccessMessage('class'));
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

  classSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllSchedule = await Class.findAll({
        include: [
          {
            model: Schedule
          }
        ]
      });
      if (!findAllSchedule.length) throw new errHelper(errorTypes.not_found, notFoundMessage('Schedule'));
      return SUCCESS(req, res, findAllSchedule);
    } catch (err) {
      return next(err);
    }
  };

  deleteSchedule = async (req: Request, res: Response, next: NextFunction) => {
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
      if (!(findSchedule)) throw new errHelper(errorTypes.forbidden, notAccessMessage('schedule'));

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

  teacherClassSchedule = async (req: Request, res: Response, next: NextFunction) => {
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
      if (!findSchedule.length) throw new errHelper(errorTypes.not_found, notFoundMessage('Lectures'));
      return SUCCESS(req, res, findSchedule);
    } catch (err) {
      return next(err);
    }
  };
}