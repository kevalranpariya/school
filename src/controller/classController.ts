import { Request, Response,NextFunction } from 'express';
import Class from '../models/Class';
import { SUCCESS } from '../middleware/responseHandling';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';
import ClassStudent from '../models/ClassStudent';
export const addClass = async (req: Request, res: Response, next: any) => {
  try {
    const createClass = await Class.create(req.body);
    SUCCESS(req, res, createClass);
  } catch (err) {
    next(err);
  }
};

export const removeClass = async(req: Request, res: Response, next: any) => {
  try {
    const id = req.params.id;
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

export const addStudent =async (req:Request,res:Response,next:NextFunction) => {
  try {
    const { class_id }:any = req.body;
    const { id }: any = req.user;
    const findClass: any = await Class.findByPk(class_id);
    if (!(findClass.teacher_id === id)) {
      throw new errHelper(errorTypes.forbidden, 'Can not access this class');
    }
    const assignStudent = await ClassStudent.create(req.body);
    return SUCCESS(req, res, assignStudent);
  } catch (err) {
    return next(err);
  }
};

export const removeStudent =async (req:Request, res:Response, next:NextFunction) => {
  try {
    const ClassStudentID: any = req.params.id;
    const { id }: any = req.user;
    const findClass: any = await ClassStudent.findByPk(ClassStudentID, {
      include: {
        model: Class,
        attributes: ['teacher_id']
      },
      attributes: ['id']
    });
    const classTeacherId: number = findClass?.Class.teacher_id;
    if (!(classTeacherId == id)) throw new errHelper(errorTypes.forbidden, 'Can not access this class');

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