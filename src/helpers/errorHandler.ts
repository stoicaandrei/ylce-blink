import * as httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import httpException from '../exceptions/httpException'

// These functions execute by default if the routes are invalid
export const notFound = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND);
  res.json({
    success: false,
    message: 'Requested Resource Not Found'
  });
  res.end();
}

export const internalServerError = (err: httpException, req: Request, res: Response) => {
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
  res.json({
    message: err.message,
    extra: err.extra,
    errors: err
  });
  res.end();
}