import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { getAllUsers } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route (requires a valid JWT)
router.get('/profile', verifyToken, getProfile);

// Admin-only: get all users
router.get('/all-users', verifyToken, isAdmin, getAllUsers);

export default router;
