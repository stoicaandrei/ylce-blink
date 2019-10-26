import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import config from '../../config/config';

import User, { IUser } from './model';
import Offer, { IOffer } from '../offer/model';
import Lending, { ILending } from '../lending/model';

import _ from 'lodash';
import async from 'async';

export default class UserController {
  public findAll = (req: Request, res: Response) => {
    User.find({}, (err, users) => {
      if (err) return res.error(err)

      if (!users) return res.error('Users not found', 404)

      return res.success(users)
    })
  }

  public findOne = (req: Request, res: Response) => {
    const id = req.params.id;
    User.findById(id, (err, user) => {
      if (err) return res.error(err);

      if (!user) return res.error('User not found', 404)

      return res.success(user)
    })
  }

  public remove = (req: Request, res: Response) => {
    const id = req.params.id;

    User.findByIdAndRemove(id, err => {
      if (err) return res.error(err)

      return res.success()
    })
  }

  /**
   * @api {post} /v1/user/update Update user info
   * @apiName Update
   * @apiGroup User
   * 
   * @apiHeader {String} Authorization Bearer token
   * 
   * @apiParam {String} [firstName]
   * @apiParam {String} [lastName]
   * @apiParam {String} [birthDate]
   * @apiParam {String} [country]
   * @apiParam {String} [employmentIndustry]
   * @apiParam {String} [incomeBracket]
   */
  public update = (req: Request, res: Response) => {
    const {
      firstName,
      lastName,
      birthDate,
      country,
      employmentIndustry,
      incomeBracket
    } = req.body;

    // provisory data
    let _data = {
      firstName,
      lastName,
      birthDate,
      country,
      employmentIndustry,
      incomeBracket
    }

    // cleaned data
    const data = _.omitBy(_data, _.isUndefined);

    if (_.isEmpty(data)) return res.error('Empty arguments', 400);

    User.findOneAndUpdate({ email: req.email }, data, (err) => {
      if (err) return res.error(err);

      res.success();
    })
  }

  /**
   * @api {post} /v1/user/top-up Top Up
   * @apiName TopUp
   * @apiGroup User
   * 
   * @apiHeader {String} Authorization Bearer token
   * 
   * @apiParam {Number} amount
   * 
   * @apiSuccess {Number} newAmount
   */
  public topUp = (req: Request, res: Response) => {
    const { amount } = req.body;

    let newAmount: number;

    const updateUser = (cb: Function) =>
      User.findOneAndUpdate({ email: req.email }, { $inc: { amount } }, { new: true }, (err, user) => {
        newAmount = (user as any).amount;
        cb(err);
      });

    const updateOffer = (cb: Function) =>
      Offer.findOneAndUpdate({ userEmail: req.email }, { $inc: { amount } }, (err: Error) => cb(err));

    async.parallel([updateUser, updateOffer], (err) => {
      if (err) return res.error(err);

      res.success({ newAmount })
    })
  }

  /**
   * @api {post} /v1/user/withdraw Withdraw
   * @apiName Withdraw
   * @apiGroup User
   * 
   * @apiHeader {String} Authorization Bearer token
   * 
   * @apiParam {Number} amount
   * 
   * @apiSuccess {Number} newAmount
   */
  public withdraw = (req: Request, res: Response) => {
    let { amount } = req.body;
    amount *= -1;

    let newAmount: number;

    const updateUser = (cb: Function) =>
      User.findOneAndUpdate({ email: req.email }, { $inc: { amount } }, { new: true }, (err, user) => {
        newAmount = (user as any).amount;
        cb(err);
      });

    const updateOffer = (cb: Function) =>
      Offer.findOneAndUpdate({ userEmail: req.email }, { $inc: { amount } }, (err: Error) => cb(err));

    async.parallel([updateUser, updateOffer], (err) => {
      if (err) return res.error(err);

      res.success({ newAmount })
    })
  }

  /**
   * @api {get} /v1/user/get-data Get User Data
   * @apiName GetData
   * @apiGroup User
   * 
   * @apiHeader {String} Authorization Bearer token
   * 
   * @apiSuccess {Object} User
   * 
   * @apiSuccessExample {json} Success-Example:
   * {
   *  user: {
   *   email: String,
   *   birthDate: Date,
   *   country: String,
   *   employmentIndustry: String,
   *   incomeBracket: String,
   *   amount: Number,
   *   creditScore: Number,
   *  }
   * }
   */
  public getUserData = (req: Request, res: Response) => {
    User.findOne(
      { email: req.email },
      '-password -createdAt -updatedAt',
      (err: Error, user: IUser) => {
        if (err) return res.error(err);

        if (!user) return res.error('User not found', 404);

        res.success({ user });
      })
  }

  /**
   * @api {get} /v1/user/get-lender-data Get Lender Data
   * @apiName GetLenderData
   * @apiGroup User
   * 
   * @apiHeader {String} Authorization Bearer token
   * 
   * @apiSuccess {Number} cash
   * @apiSuccess {Number} investedAmount
   * @apiSuccess {Object} offer
   * 
   * @apiSuccessExample {json} Success-Example:
   * {
   *  offer: {
   *    amount: Number,
   *    rate: Number,
   *    maxPeriod: Number,
   *    minCreditScore: Number
   *  }
   * }
   */
  public getLenderData = (req: Request, res: Response) => {
    const getUser = (cb: Function) =>
      User.findOne(
        { email: req.email },
        'amount',
        cb);

    const getLendings = (cb: Function) =>
      Lending.find(
        { userEmail: req.email },
        'amount paybackAmount rate period dueDate',
        cb);

    const getOffer = (cb: Function) =>
      Offer.findOne({ userEmail: req.email }, cb);

    async.parallel([getUser, getLendings], (err, data) => {
      if (err) return res.error(err);

      if (!data) return res.error();

      const user: IUser = (data as any)[0];
      const lendings: ILending[] = (data as any)[1];
      let offer: any = (data as any)[2];

      if (!user || !lendings) return res.error();

      if (!offer)
        offer = {
          amount: 0,
          rate: 0,
          maxPeriod: 0,
          minCreditScore: 0
        }

      let investedAmount = 0;
      let avgRate = '';

      for (let i = 0; i < lendings.length; i++) {
        const lending = lendings[0];

        investedAmount += lending.amount;
      }

      res.success({
        cash: user.amount,
        investedAmount,

        offer
      })
    })
  }
}