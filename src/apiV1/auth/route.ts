import { Router } from 'express';
// import verifyToken from '../../helpers/verifyToken';
import Controller from './controller';

const auth: Router = Router();
const controller = new Controller();

auth.post('/register', controller.register)
auth.post('/login', controller.authenticate)

export default auth;