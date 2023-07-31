import statusCode from '../constant/statusCode';
import { Request, Response } from 'express';
export const SUCCESS = (req:Request, res:Response, data?:any) => {
  return res.status(statusCode.SUCCESS).json({
    status_code: statusCode.SUCCESS,
    data,
    message: 'Operation successfully done'
  });
};