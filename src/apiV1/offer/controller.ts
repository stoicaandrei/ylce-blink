import { Request, Response } from 'express';

import Offer from './model';
import User, { IUser } from '../user/model';

import async from 'async';
import _ from 'lodash';

export default class OfferController {
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
      minCreditScore,
      rate
    } = req.body;

    if (!maxPeriod || !minCreditScore || !rate)
      return res.error('maxPeriod, minCreditScore, rate required', 400);

    const getUser = (cb: Function) =>
      User.findOne(
        { email: req.email },
        'amount',
        cb
      )

    const getOffer = (cb: Function) =>
      Offer.findOne({ userEmail: req.email }, cb);

    async.parallel([getUser, getOffer], (err, data) => {
      if (err) return res.error(err);

      if (!data) return res.error();

      const amount = (data as any)[0].amount;
      let offer = (data as any)[1];

      if (!offer) offer = new Offer();

      offer.maxPeriod = maxPeriod;
      offer.minCreditScore = minCreditScore;
      offer.rate = rate;
      offer.amount = amount;

      offer.save((err: Function) => {
        if (err) return res.error(err);

        return res.success();
      })
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