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
        attributes: ['teacher_id'],
        where: {
          teacher_id: id
        }
      }
    });
    if (!findClassStudent) throw new errHelper(errorTypes.forbidden, 'Can not access this Student!!');
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
    return SUCCESS(req, res, findAttendance);
  } catch (err) {
    return next(err);
  }
};

export const viewAttendance =async (req:Request,res:Response,next:NextFunction) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const { class_id } = req.query;
    const findSchedule = await ClassStudent.findAll({
      where: {
        class_id: class_id
      },
      attributes: ['student_id'],
      include: {
        model: Attendance,
        where: {
          date: date
        }
      }
    });
    if (!findSchedule.length) throw new errHelper(errorTypes.not_found, 'Schedule not found');
    return SUCCESS(req, res, findSchedule);
  } catch (err) {
    return next(err);
  }
};

export const updateAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user;
    const { student_id } = req.body;
    const findAttendance = await Attendance.findByPk(req.params.id);
    if (!findAttendance) throw new errHelper(errorTypes.not_found, 'Attendance not found');
    const findClassStudent = await ClassStudent.findOne({
      where: {
        student_id: student_id
      },
      attributes: ['class_id'],
      include: {
        model: Class,
        attributes: ['teacher_id'],
        where: {
          teacher_id: id
        }
      }
    });
    if (!findClassStudent) throw new errHelper(errorTypes.forbidden, 'Can not access this Student!!');

    await Attendance.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    return SUCCESS(req, res);
  } catch (err) {
    return next(err);
  }
};

export const deleteRecord =async (req:Request,res:Response,next:NextFunction) => {
  try {
    const { id } = req.user;
    const findTeacher = await Attendance.findByPk(req.params.id);
    const findStudentID = findTeacher?.student_id;

    const findClassStudent = await ClassStudent.findOne({
      where: {
        student_id: findStudentID
      },
      attributes: ['class_id'],
      include: {
        model: Class,
        attributes: ['teacher_id'],
        where: {
          teacher_id: id
        }
      }
    });
    if (!findClassStudent) throw new errHelper(errorTypes.forbidden, 'Can not access this Student!!');

    await Attendance.destroy({
      where: {
        id: req.params.id
      }
    });
    return SUCCESS(req, res);
  } catch (err) {
    return next(err);
  }
};

export const viewTeacherAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user;
    const findAllAttendance = await ClassStudent.findAll({
      attributes: ['student_id'],
      include: [
        {
          model: Class,
          where: {
            teacher_id: id
          },
          attributes: []
        },
        { model: Attendance },
      ]
    });
    if (!findAllAttendance.length) throw new errHelper(errorTypes.not_found, 'Attendance not found');
    return SUCCESS(req, res, findAllAttendance);
  } catch (err) {
    return next(err);
  }
};