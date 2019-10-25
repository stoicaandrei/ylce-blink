import { Router } from 'express';
import auth from './auth/route';
import user from './user/route';
import offer from './offer/route';

const router = Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/offer', offer);

export default router;