import { Router } from 'express';
import verifyToken from '../../helpers/verifyToken';
import Controller from './controller';

const lending: Router = Router();
const controller = new Controller();

lending.get('/get-lendings', verifyToken, controller.getLendings)

export default lending;