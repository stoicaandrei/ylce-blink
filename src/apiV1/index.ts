import { Router } from 'express';
import auth from './auth/route';
import user from './user/route';
import offer from './offer/route';
import loan from './loan/route';
import lending from './lending/route';

const router = Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/offer', offer);
router.use('/lending', lending)

export default router;