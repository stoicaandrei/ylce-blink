import { Router } from 'express';
import verifyToken from '../../helpers/verifyToken';
import Controller from './controller';

const user: Router = Router();
const controller = new Controller();

// Retrieve all Users
user.get('/find-all', verifyToken, controller.findAll);

// Retrieve a Specific User
user.get('/:id', controller.findOne);

// Delete a User with Id
user.post('/delete/:id', controller.remove);

user.post('/update', verifyToken, controller.update);


export default user;