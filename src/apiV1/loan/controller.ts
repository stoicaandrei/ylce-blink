import { Request, Response } from 'express';

import Offer, { IOffer } from '../offer/model';
import User, { IUser } from '../user/model';
import Loan, { ILoan } from './model';
import Lending, { ILending } from '../lending/model';

import async from 'async';
import moment from 'moment';

export default class LoanController {
  /**
   * @api {get} /v1/loan/get-offer Get loan offer
   * @apiName GetOffer
   * @apiGroup Loan
   * 
   * @apiHeader {String} Authorization Bearer token
   * 
   * @apiParam {Number} amount
   * @apiParam {Number} period (months) min: 1
   * 
   * @apiSuccess {Object} loan
   * 
   * @apiSuccessExample {json} Success-Example:
   * {
   *  loan: {
   *    _id: String,
   *    amount: Number,
   *    rate: Number,
   *    period: Number,
   *    dueDate: Date,
   *    paybackAmount: Number
   *  }
   * }
   */
  public getOffer = (req: Request, res: Response) => {
    let {
      amount,
      period
    } = req.query;

    amount = parseInt(amount);
    period = parseInt(period);

    if (!amount || !period)
      return res.error('amount, period required', 400);

    const getUser = (cb: Function) => User.findOne({ email: req.email }, 'creditScore', cb);

    const getAllOffers = (user: IUser, cb: Function) => Offer.find(
      {
        risk: { $gte: 6 - user.creditScore },
        maxPeriod: { $gte: period },
        userEmail: { $ne: req.email },
        amount: { $gte: 0 }
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

      if (nominator === 0) return res.error('not enough lenders for this amount', 400);

      const rate = (denominator / nominator);

      const dueDate = moment().add(`${period} months`);

      const paybackAmount = amount + amount * (rate / 12 / 100) * 3;

      Loan.create({
        approved: false,
        userEmail: req.email,
        amount: nominator,
        rate: rate.toFixed(2),
        period,
        dueDate,
        paybackAmount: paybackAmount.toFixed(2),
        backers
      }, cb);
    }

    async.waterfall([getUser, getAllOffers, calculateOffer], (err, loan) => {
      if (err) {
        console.log((err as any).message);
        return res.error(err);
      }
      (loan as any).backers = undefined;

      res.success({ loan });
    });
  }

  /**
   * @api {post} /v1/loan/approve Approve Loan
   * @apiName Approve Loan
   * @apiGroup Loan
   * 
   * @apiHeader {String} Authorization Bearer token
   * 
   * @apiParam {String} loanId
   * 
   * @apiSuccess {Object} loan
   * 
   * @apiSuccessExample {json} Success-Example:
   * {
   *  loan: {
   *    _id: String,
   *    amount: Number,
   *    rate: Number,
   *    period: Number,
   *    dueDate: Date,
   *    paybackAmount: Number
   *  }
   * }
   */
  public approveOffer = (req: Request, res: Response) => {
    const { loanId } = req.body;

    const getLoan = (cb: any) =>
      Loan.findById(loanId, cb);

    const takeMoney = (loan: ILoan, cb: any) => {
      async.each(loan.backers, (lending: any, cb: any) => {

        const createLending = (cb: any) =>
          Lending.create({
            loanId,
            ...lending, // userEmail, amount, rate
            period: loan.period,
            dueDate: loan.dueDate,
            paybackAmount: loan.paybackAmount
          }, cb);

        const decreaseUserMoney = (cb: any) =>
          User.findOneAndUpdate(
            { email: lending.userEmail },
            { $inc: { amount: lending.amount * -1 } },
            cb);

        const decreaseOfferMoney = (cb: any) =>
          Offer.findOneAndUpdate(
            { userEmail: lending.userEmail },
            { $inc: { amount: lending.amount * -1 } },
            cb
          )

        async.parallel([createLending, decreaseUserMoney, decreaseOfferMoney], cb);

      }, (err) => cb(err, loan))
    }

    const giveMoney = (loan: ILoan, cb: any) =>
      User.findOneAndUpdate(
        { email: loan.userEmail },
        { $inc: { amount: loan.amount } },
        (err) => cb(err));

    const approveLoan = (cb: any) =>
      Loan.findByIdAndUpdate(
        loanId,
        { approved: true, backers: undefined },
        cb);


    async.waterfall([getLoan, takeMoney, giveMoney, approveLoan], (err, loan) => {
      if (err) return res.error(err);

      res.success({ loan })
    })
  }

  /**
   * @api {get} /v1/loan/get-loans Get loans
   * @apiName GetLoans
   * @apiGroup Loan
   * 
   * @apiHeader {String} Authorization Bearer token
   * 
   * @apiSuccess {Object[]} loans
   * 
   * @apiSuccessExample {json} Success-Example:
   * {
   *  loan: [{
   *    _id: String,
   *    amount: Number,
   *    paybackAmount: Number,
   *    rate: Number,
   *    period: Number,
   *    dueDate: Date,
   *  }]
   * }
   */
  public getLoans = (req: Request, res: Response) => {
    Loan.find(
      { userEmail: req.email },
      'amount paybackAmount rate period dueDate',
      (err: Error, loans: ILoan[]) => {
        if (err) return res.error(err);

        res.success({ loans })
      })
  }

  // public payLoan = (req: Request, res: Response) => {
  //   const { loanId } = req.body;

  //   const getLoan = (cb: Function) => Loan.findById(loanId, cb);
  //   const getUser = (cb: Function) => User.findOne({ email: req.email }, 'amount', cb);

  //   const getLendings = (cb: Function) => Lending.find({ loanId }, cb)

  //   const payBackers = (lendings: ILending[], cb: any) => {

  //     async.each(lendings, (lending: ILending, cb: any) => {

  //       User.findOneAndUpdate({ email: lending.userEmail }, { $inc: { amount: lending.amount } }, cb);

  //     }, cb)
  //   }
  // }

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