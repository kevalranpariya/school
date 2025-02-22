import statusCode from '../constant/statusCode';
import errorTypes from '../utils/errorTypes';
import { NextFunction, Request, Response } from 'express';
const errorResponse = (err:any, req: Request, res: Response) => {
  return res.status(err.statusCode).json({
    statusCode: err.statusCode,
    message: err.message
  });
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  switch (err.name) {
    case errorTypes.bad_request:
      err.statusCode = statusCode.BAD_REQUEST;
      return errorResponse(err, req, res);
    case errorTypes.unauthorized:
      err.statusCode = statusCode.UNAUTHORIZED;
      return errorResponse(err, req, res);
    case errorTypes.forbidden:
      err.statusCode = statusCode.FORBIDDEN;
      return errorResponse(err, req, res);
    case errorTypes.not_found:
      err.statusCode = statusCode.NOT_FOUND;
      return errorResponse(err, req, res);
    case errorTypes.validation:
      err.statusCode = statusCode.BAD_REQUEST;
      return errorResponse(err, req, res);
    default:
      err.statusCode = statusCode.BAD_REQUEST;
      return errorResponse(err, req, res);
      next(err);
  }
};