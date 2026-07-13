import { Router } from 'express';
const router = Router();
import { loginUser } from '../controllers/authController';

router.post('/login', loginUser);

export default router;