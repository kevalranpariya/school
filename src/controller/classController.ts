import { Request, Response } from 'express';
import Class from '../models/Class';
import { SUCCESS } from '../middleware/responseHandling';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';
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
