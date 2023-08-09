import { Request, Response, NextFunction } from 'express';
import { Report } from '../models';
import { SUCCESS } from '../middleware/responseHandling';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';
import { notAccessMessage } from '../utils/printMessage';

export default class ReportController{
  addReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      req.body.teacher_id = id;
      const addReport = await Report.create(req.body);
      return SUCCESS(req, res, addReport);
    } catch (err) {
      return next(err);
    }
  };

  viewReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllReport = await Report.findAll({});
      return SUCCESS(req, res, findAllReport);
    } catch (err) {
      return next(err);
    }
  };

  updateReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      req.body.teacher_id = id;
      const findTeacher = await Report.findByPk(req.params.id);
      if (!(findTeacher?.teacher_id == id)) throw new errHelper(errorTypes.forbidden, notAccessMessage('report'));
      await Report.update(req.body, {
        where: {
          id: req.params.id
        },
        returning: true
      });
      return SUCCESS(req, res);
    } catch (err) {
      return next(err);
    }
  };

  deleteReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      const findTeacher = await Report.findByPk(req.params.id);
      if (!(findTeacher?.teacher_id == id)) throw new errHelper(errorTypes.forbidden, notAccessMessage('report'));

      await Report.destroy({
        where: {
          id: req.params.id
        }
      });
      return SUCCESS(req, res);
    } catch (err) {
      return next(err);
    }
  };
}