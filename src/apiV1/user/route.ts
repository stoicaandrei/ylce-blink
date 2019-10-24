import { Router } from 'express';
// import verifyToken from '../../helpers/verifyToken';
import Controller from './controller';

const user: Router = Router();
const controller = new Controller();

// Retrieve all Users
user.get('/find-all', controller.findAll);

// Retrieve a Specific User
user.get('/:id', controller.findOne);

// Update a User with Id
user.post('/update/:id', controller.update);

// Delete a User with Id
user.post('/delete/:id', controller.remove);

export default user;