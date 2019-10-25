import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import config from '../../config/config';
import User, { IUser } from '../user/model';

import async from 'async';

const generateToken = (data: object): string => {
  return jwt.sign(data, config.JWT_ENCRYPTION, { expiresIn: config.JWT_EXPIRATION })
}

export default class AuthController {
  /**
   * @api {post} /v1/auth/register Register
   * @apiName Register
   * @apiGroup Auth
   * 
   * @apiParam {String} firstName
   * @apiParam {String} lastName
   * @apiParam {String} email
   * @apiParam {String} password
   * 
   * @apiSuccess {String} accessToken
   */
  public register = (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.error('firstName, lastName, email, password required');

    const hashPassword = async.apply(bcrypt.hash, password, config.SALT_ROUNDS);
    const createUser = (hash: string, cb: Function) => User.create({ firstName, lastName, email, password: hash }, cb);

    async.waterfall([hashPassword, createUser],
      (err, user) => {
        if (err) return res.error(err);

        const accessToken = generateToken({ email });

        return res.success({ accessToken })
      })
  }

  /**
   * @api {post} /v1/auth/login Login
   * @apiName Login
   * @apiGroup Auth
   * 
   * @apiParam {String} email
   * @apiParam {String} password
   * 
   * @apiSuccess {String} accessToken
   */
  public authenticate = (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password)
      return res.error('email, password required');

    const getUser = (cb: Function) => User.findOne({ email }, 'email password', cb);
    const comparePassword = (user: IUser, cb: Function) => {
      if (!user) return cb('Invalid credentials');

      bcrypt.compare(password, user.password, (err: Error, same: boolean) => {
        if (same === false) return cb('Invalid credentials');

        cb(null, user);
      })
    }

    async.waterfall([getUser, comparePassword],
      (err, user) => {
        if (err) return res.error(err);

        const email = (user as IUser).email;
        const accessToken = generateToken({ email });

        return res.success({ user, accessToken })
      }
    )
  }
}