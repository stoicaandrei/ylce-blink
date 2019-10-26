import { Request, Response } from 'express';

import Offer from './model';
import User, { IUser } from '../user/model';

import async from 'async';
import _ from 'lodash';

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
      return res.error('maxPeriod, risk, rate required', 400);

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
      return res.error('maxPeriod, risk, rate required', 400);

    Offer.findOneAndUpdate({ userEmail: req.email }, { maxPeriod, risk, rate }, (err: Error) => {
      if (err) return res.error(err);

      res.success();
    })
  }
}

// const map = (n: number, start1: number, stop1: number, start2: number, stop2: number) => {
//   return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
// };

// const populateOffers = () => {
//   let offers = [];

//   for (let i = 0; i < 1000; i++) {

//     let offer: any = {};

//     let chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
//     let string = '';
//     for (var ii = 0; ii < 15; ii++) {
//       string += chars[Math.floor(Math.random() * chars.length)];
//     }
//     string += '@domain.com';

//     offer.userEmail = string;
//     offer.amount = _.random(300, 1000);

//     offer.risk = _.random(1, 5);
//     offer.rate = map(offer.risk, 1, 5, 4, 15) + _.random(-1.0, 1.0);
//     offer.maxPeriod = [1, 3, 6, 12][_.random(0, 3)];


//     offers.push(offer);
//   }

//   // Offer.create(offers, err => console.log(err))
// }

// populateOffers()