import { Request, Response, NextFunction } from 'express';

const success = function (this: Response, data: any = null) {
  this.status(200).send({
    success: true,
    data
  });
}

const error = function (this: Response, err: any = 'Unexpected error occurred.', status = 500) {
  this.status(200).send({
    success: false,
    message: (err instanceof Error ? err.message : err.toString()),
    data: null
  });
}

export default (req: Request, res: Response, next: NextFunction) => {
  res.success = success;
  res.error = error;
  next();
}