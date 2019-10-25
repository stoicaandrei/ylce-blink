import { Router } from 'express';
import verifyToken from '../../helpers/verifyToken';
import Controller from './controller';

const user: Router = Router();
const controller = new Controller();

user.get('/find-all', controller.findAll);
user.get('/:id', controller.findOne);
user.post('/delete/:id', controller.remove);

user.post('/update', verifyToken, controller.update);
user.post('/top-up', verifyToken, controller.topUp);
user.post('/withdraw', verifyToken, controller.withdraw);


export default user;