import { Router } from 'express';
import verifyToken from '../../helpers/verifyToken';
import Controller from './controller';

const loan: Router = Router();
const controller = new Controller();

loan.get('/get-offer', verifyToken, controller.getOffer);
loan.get('/get-loans', verifyToken, controller.getLoans);
loan.get('/get-all', controller.getAll)

loan.post('/approve', verifyToken, controller.approveOffer);

export default loan;