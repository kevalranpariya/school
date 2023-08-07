import { Request, Response, NextFunction } from 'express';
import Class from '../models/Class';
import { SUCCESS } from '../middleware/responseHandling';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';
import ClassStudent from '../models/ClassStudent';
import User from '../models/User';

export const addClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createClass = await Class.create(req.body);
    SUCCESS(req, res, createClass);
  } catch (err) {
    next(err);
  }
};

export const removeClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: number = Number(req.params.id);
    const findClass = await Class.findByPk(id);
    if (findClass) {
      await Class.destroy({
        where: { id }
      });
      return SUCCESS(req, res,);
    } else throw new errHelper(errorTypes.not_found, 'Class not found');
  } catch (err) {
    next(err);
  }
};

export const classUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const findClass = await Class.findByPk(id);
    if (!findClass) throw new errHelper(errorTypes.not_found, 'Class not found');

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

export const addStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { class_id } = req.body;
    const { id } = req.user;
    const findClass = await Class.findByPk(class_id);
    if (!(findClass?.teacher_id === id)) {
      throw new errHelper(errorTypes.forbidden, 'Can not access this class');
    }
    const assignStudent = await ClassStudent.create(req.body);
    return SUCCESS(req, res, assignStudent);
  } catch (err) {
    return next(err);
  }
};

export const removeStudent = async (req: Request, res: Response, next: NextFunction) => {
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

export const updateStudentClass = async (req: Request, res: Response, next: NextFunction) => {
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

export const allClass = async (req:Request,res:Response,next:NextFunction) => {
  try {
    const findAllClass = await Class.findAll({
      include: {
        model: User,
        as: 'Teacher',
        attributes: [ 'id','username' ]
      }
    });
    return SUCCESS(req,res,findAllClass);
  } catch (err) {
    return next(err);
  }
};

export const allStudentClass = async (req: Request, res: Response, next: NextFunction) => {
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