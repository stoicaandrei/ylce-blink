import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import config from '../../config/config';
import User, { IUser } from '../user/model';

import async from 'async'

export default class AuthController {
  public register = (req: Request, res: Response) => {
    const { name, lastName, email, password } = req.body;

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

    const getUser = (cb: Function) => User.findOne({ email }, 'email password', cb);
    const comparePassword = (user: IUser, cb: Function) => {
      if (!user) return cb('Invalid credentials');

      bcrypt.compare(password, user.password, (err: Error, same: boolean) => {
        if (same === false) return cb('Invalid credentials');

        cb(null, user);
      })
    }

    // const checkPassword = async.apply()

    // async.parallel([
    //   async.apply
    // ])
  }
}