import { Request, Response } from 'express';

import Offer, { IOffer } from '../offer/model';
import User, { IUser } from '../user/model';
import Loan, { ILoan } from './model';

import async from 'async';
import moment from 'moment';

export default class LoanController {
  /**
   * @api {post} /v1/loan/get-offer Get loan offer
   * @apiName GetOffer
   * @apiGroup Loan
   * 
   * @apiHeader {String} Authorization Bearer token
   * 
   * @apiParam {Number} amount
   * @apiParam {Number} period (months) min: 1
   */
  public getOffer = (req: Request, res: Response) => {
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
        maxPeriod: { $gte: period },
        userEmail: { $ne: req.email }
      }
    ).sort({ rate: 1 }).exec(cb);

    const calculateOffer = (offers: IOffer[], cb: Function) => {
      let denominator = 0;
      let nominator = 0;

      let backers = [];

      for (let i = 0; i < offers.length; i++) {
        let offer = offers[i];
        if (nominator >= amount)
          break;

        if (nominator + offer.amount > amount)
          offer.amount = amount - nominator;

        nominator += offer.amount;
        denominator += offer.amount * offer.rate;

        backers.push({
          userEmail: offer.userEmail,
          amount: offer.amount,
          rate: offer.rate
        });
      }

      const rate = (denominator / nominator).toFixed(2);

      const dueDate = moment().add(`${period} months`);

      Loan.create({
        approved: false,
        userEmail: req.email,
        amount: nominator,
        rate,
        period,
        dueDate,
        backers
      }, cb);
    }

    async.waterfall([getUser, getAllOffers, calculateOffer], (err, loan) => {
      if (err) return res.error(err);

      (loan as any).backers = undefined;

      res.success({ loan });
    });
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