import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import config from '../config/config';

interface jwtResponse {
  email: string
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  // check header or url parameters or post parameters for token
  const { authorization } = req.headers;

  if (!authorization) {
    return res.error('No token provided', 403)
  }

  const token: string = authorization.split(' ')[1];

  jwt.verify(token, config.JWT_ENCRYPTION, (err, decoded) => {
    if (err) return res.error(err);

    req.email = (decoded as jwtResponse).email;
    next()
  })
};

export default verifyToken;