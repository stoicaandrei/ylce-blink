import { Router } from 'express';
import verifyToken from '../../helpers/verifyToken';
import Controller from './controller';

const loan: Router = Router();
const controller = new Controller();

loan.get('/get-offer', verifyToken, controller.getOffer);

loan.get('/get-all', controller.getAll)

export default loan;