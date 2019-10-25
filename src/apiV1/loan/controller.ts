import { Request, Response } from 'express';

import Offer from '../offer/model';
import User, { IUser } from '../user/model';

import async from 'async';

export default class LoanController {
  public getOffer = (req: Request, res: Response) => {
    /**
     * get all offers that
     * 
     */
    const {
      amount,
      period
    } = req.query;

    if (!amount || !period)
      return res.error('amount, period required');

    const getUser = (cb: Function) => User.findOne({ email: req.email }, 'creditScore', cb);

    const getAllOffers = (user: IUser, cb: Function) => Offer.find(
      {
        risk: { $gte: 6 - user.creditScore },
        maxPeriod: { $gte: period }
      }
    ).sort({ rate: -1 }).exec(cb);

    async.waterfall([getUser, getAllOffers], console.log);
  }

  public getAll = (req: Request, res: Response) => {
    res.success({
      loans: [
        {
          _id: "1000",
          amount: 2000,
          period: 12,
          rate: 10,
          timestamp: new Date(),
          lenders: [
            {
              _id: "2000",
              amount: 100,
              period: 6,
              rate: 10
            },
            {
              _id: "2001",
              amount: 300,
              period: 3,
              rate: 10
            },
            {
              _id: "2002",
              amount: 1600,
              period: 12,
              rate: 10
            }
          ]
        }
      ]
    })
  }
}