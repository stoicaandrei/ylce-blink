import { Router } from 'express';
// import verifyToken from '../../helpers/verifyToken';
import Controller from './controller';

const auth: Router = Router();
const controller = new Controller();

// Register new user
auth.post('/register', controller.register)

export default auth;