import { Request, Response, NextFunction } from 'express';
import { Class, ClassStudent, User } from '../models';
import { SUCCESS } from '../middleware/responseHandling';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';
import { notAccessMessage, notFoundMessage } from '../utils/printMessage';

export default class ClassController {
  allStudentClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      const findClassStudent = await ClassStudent.findAll({
        attributes: ['class_id'],
        include: [
          {
            model: Class,
            where: {
              teacher_id: id
            },
            attributes: []
          },
          {
            model: User,
            as: 'Student',
            attributes: [ 'id', 'username' ]
          }
        ]
      });
      return SUCCESS(req, res, findClassStudent);
    } catch (err) {
      return next(err);
    }
  };

  allClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllClass = await Class.findAll({
        include: {
          model: User,
          as: 'Teacher',
          attributes: [ 'id', 'username' ]
        }
      });
      return SUCCESS(req, res, findAllClass);
    } catch (err) {
      return next(err);
    }
  };

  updateStudentClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { class_id } = req.body;
      const { id } = req.user;
      const findClass = await Class.findByPk(class_id);
      if (!(findClass?.teacher_id === id)) {
        throw new errHelper(errorTypes.forbidden, 'Can not access this class');
      }
      await ClassStudent.update(req.body, {
        where: { id: req.params.id }
      });
      return SUCCESS(req, res);
    } catch (err) {
      return next(err);
    }
  };

  removeStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ClassStudentID: number = Number(req.params.id);
      const { id } = req.user;
      const findClass = await ClassStudent.findByPk(ClassStudentID, {
        include: {
          model: Class,
          attributes: ['teacher_id'],
          where: {
            teacher_id: id
          }
        },
        attributes: ['id']
      });
      if (!findClass) throw new errHelper(errorTypes.forbidden, 'Can not access this class');

      await ClassStudent.destroy({
        where: {
          id: ClassStudentID
        }
      });
      return SUCCESS(req, res);
    } catch (err) {
      return next(err);
    }
  };

  addStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { class_id } = req.body;
      const { id } = req.user;
      const findClass = await Class.findByPk(class_id);
      if (!(findClass?.teacher_id === id)) {
        throw new errHelper(errorTypes.forbidden, notAccessMessage('class'));
      }
      const assignStudent = await ClassStudent.create(req.body);
      return SUCCESS(req, res, assignStudent);
    } catch (err) {
      return next(err);
    }
  };

  classUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const findClass = await Class.findByPk(id);
      if (!findClass) throw new errHelper(errorTypes.not_found, notFoundMessage('Class'));

      await Class.update(req.body, {
        where: {
          id
        }
      });
      return SUCCESS(req, res);
    } catch (err) {
      return next(err);
    }
  };

  removeClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: number = Number(req.params.id);
      const findClass = await Class.findByPk(id);
      if (findClass) {
        await Class.destroy({
          where: { id }
        });
        return SUCCESS(req, res,);
      } else throw new errHelper(errorTypes.not_found, notFoundMessage('Class'));
    } catch (err) {
      next(err);
    }
  };

  addClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createClass = await Class.create(req.body);
      SUCCESS(req, res, createClass);
    } catch (err) {
      next(err);
    }
  };
}