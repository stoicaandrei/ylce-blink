import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import config from '../../config/config';
import User from './model';

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

  public update = (req: Request, res: Response) => {
    const { name, lastName, email, password } = req.body;
    const id = req.params.id;

    User.findByIdAndUpdate(id, { name, lastName, email, password }, (err) => {
      if (err) return res.error(err)

      return res.success()
    })
  }

  public remove = (req: Request, res: Response) => {
    const id = req.params.id;

    User.findByIdAndRemove(id, err => {
      if (err) return res.error(err)

      return res.success()
    })
  }
}