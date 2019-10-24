import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import config from '../../config/config';
import User from '../user/model';

import async from 'async'

export default class AuthController {
  public register = (req: Request, res: Response) => {
    const { name, lastName, email, password } = req.body;

    bcrypt.hash(password, config.SALT_ROUNDS, (err, hash) => {
      if (err) return res.error(err)
    });

    const hashPassword = async.apply(bcrypt.hash, password, config.SALT_ROUNDS);
    const createUser = (hash: string, cb: Function) => User.create({ name, lastName, email, password: hash }, cb);

    async.waterfall([hashPassword, createUser],
      (err, user) => {
        if (err) return res.error(err);

        return res.success(user)
      })
  }

  public authenticate = (req: Request, res: Response) => {
    const { email, password } = req.body;

    // const checkPassword = async.apply()

    // async.parallel([
    //   async.apply
    // ])
  }
}