import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route (requires a valid JWT)
router.get('/profile', verifyToken, getProfile);

export default router;
