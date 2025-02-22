import { Request, Response } from 'express';
import { Attendance,Class,ClassStudent } from '../models';
import { SUCCESS } from '../middleware/responseHandling';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';
import { NextFunction } from 'express-serve-static-core';
import { notAccessMessage, notFoundMessage } from '../utils/printMessage';

export default class AttendanceController{
  addRecord = async (req: Request, res: Response, next: any) => {
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
      if (!findClassStudent) throw new errHelper(errorTypes.forbidden, notAccessMessage('student'));
      const addRecord = await Attendance.create(req.body);
      return SUCCESS(req, res, addRecord);
    } catch (err) {
      return next(err);
    }
  };

  viewRecord = async (req: Request, res: Response, next: NextFunction) => {
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

  viewAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllAttendance = await Class.findAll({
        include: [
          {
            model: ClassStudent,
            as: 'Students',
            include: [
              Attendance
            ]
          }
        ]
      });
      if (!findAllAttendance.length) throw new errHelper(errorTypes.not_found, notFoundMessage('Schedule'));
      return SUCCESS(req, res, findAllAttendance);
    } catch (err) {
      return next(err);
    }
  };

  updateAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      const { student_id } = req.body;
      const findAttendance = await Attendance.findByPk(req.params.id);
      if (!findAttendance) throw new errHelper(errorTypes.not_found, notFoundMessage('Attendance'));
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
      if (!findClassStudent) throw new errHelper(errorTypes.forbidden, notAccessMessage('student'));

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

  deleteRecord = async (req: Request, res: Response, next: NextFunction) => {
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
      if (!findClassStudent) throw new errHelper(errorTypes.forbidden, notAccessMessage('student'));

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

  viewTeacherAttendance = async (req: Request, res: Response, next: NextFunction) => {
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
      if (!findAllAttendance.length) throw new errHelper(errorTypes.not_found, notFoundMessage('Attendance'));
      return SUCCESS(req, res, findAllAttendance);
    } catch (err) {
      return next(err);
    }
  };
}