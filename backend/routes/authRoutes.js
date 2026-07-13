import { Router } from 'express';
const router = Router();
import { loginUser } from '../controllers/authController.js';

router.post('/login', loginUser);

export default router;