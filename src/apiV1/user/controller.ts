import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import config from '../../config/config';

import User from './model';
import Offer from '../offer/model';

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

    if (_.isEmpty(data)) return res.error('Empty arguments');

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
   */
  public topUp = (req: Request, res: Response) => {
    const { amount } = req.body;

    const updateUser = (cb: Function) =>
      User.findOneAndUpdate({ email: req.email }, { $inc: { amount } }, (err: Error) => cb(err));

    const updateOffer = (cb: Function) =>
      Offer.findOneAndUpdate({ userEmail: req.email }, { $inc: { amount } }, (err: Error) => cb(err));

    async.parallel([updateUser, updateOffer], (err) => {
      if (err) return res.error(err);

      res.success()
    })
  }
}