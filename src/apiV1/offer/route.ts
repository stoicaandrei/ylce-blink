import { Router } from 'express';
import verifyToken from '../../helpers/verifyToken';
import Controller from './controller';

const offer: Router = Router();
const controller = new Controller();

offer.post('/update', verifyToken, controller.update);

export default offer;