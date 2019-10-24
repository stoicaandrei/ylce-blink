import { Router } from 'express';
import auth from './auth/route';
import user from './user/route';

const router = Router();

router.use('/auth', auth);
router.use('/user', user);

export default router;