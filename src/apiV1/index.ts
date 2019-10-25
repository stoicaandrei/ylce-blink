import { Router } from 'express';
import auth from './auth/route';
import user from './user/route';
import offer from './offer/route';
import loan from './loan/route';

const router = Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/offer', offer);
router.use('/loan', loan)

export default router;