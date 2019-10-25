import { Request, Response } from 'express';

import Offer from './model';
import User, { IUser } from '../user/model';

import async from 'async';

export default class OfferController {
  /**
   * @api {post} /v1/offer/create Create new offer
   * @apiName Create
   * @apiGroup Offer
   * 
   * @apiHeader {String} Authorization Bearer token
   * 
   * @apiParam {Number} maxPeriod (months) min: 1
   * @apiParam {Number} risk min: 1, max: 5
   * @apiParam {Number} rate min: 1
   */
  public create = (req: Request, res: Response) => {
    const {
      maxPeriod,
      risk,
      rate
    } = req.body;

    if (!maxPeriod || !risk || !rate)
      return res.error('maxPeriod, risk, rate required');

    const getUser = (cb: Function) => User.findOne({ email: req.email }, 'amount', cb);

    const createOffer = (user: IUser, cb: Function) =>
      Offer.create({ userEmail: req.email, maxPeriod, risk, rate, amount: user.amount }, cb)

    async.waterfall([getUser, createOffer], (err) => {
      if (err) return res.error(err);

      res.success()
    })
  }

  /**
   * @api {post} /v1/offer/update Update the offer
   * @apiName Update
   * @apiGroup Offer
   * 
   * @apiHeader {String} Authorization Bearer token
   * 
   * @apiParam {Number} maxPeriod (months) min: 1
   * @apiParam {Number} risk min: 1, max: 5
   * @apiParam {Number} rate min: 1
   */
  public update = (req: Request, res: Response) => {
    const {
      maxPeriod,
      risk,
      rate
    } = req.body;

    if (!maxPeriod || !risk || !rate)
      return res.error('maxPeriod, risk, rate required');

    Offer.findOneAndUpdate({ userEmail: req.email }, { maxPeriod, risk, rate }, (err: Error) => {
      if (err) return res.error(err);

      res.success()
    })
  }
}
