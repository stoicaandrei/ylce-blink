import { Request, Response } from 'express';

import Lending, { ILending } from './model';

export default class LendingController {
  /**
   * @api {get} /v1/lending/get-lendings Get lendings
   * @apiName GetLendings
   * @apiGroup Loan
   * 
   * @apiHeader {String} Authorization Bearer token
   * 
   * @apiSuccess {Object[]} lendings
   * 
   * @apiSuccessExample {json} Success-Example:
   * {
   *  loan: [{
   *    amount: Number,
   *    paybackAmount: Number,
   *    rate: Number,
   *    period: Number,
   *    dueDate: Date,
   *  }]
   * }
   */
  public getLendings = (req: Request, res: Response) => {
    Lending.find(
      { userEmail: req.email },
      'amount paybackAmount rate period dueDate',
      (err: Error, lendings: ILending) => {
        if (err) return res.error(err);

        res.success({ lendings })
      })
  }
}