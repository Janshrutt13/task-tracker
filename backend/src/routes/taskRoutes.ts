import { Router } from 'express';
import { getTasks, createTask, deleteTask } from '../controllers/taskController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validateTask } from '../middleware/validationMiddleware.js';

const router = Router();

// Apply auth middleware to all task routes
router.use(verifyToken);

// Routes
router.get('/', getTasks);
router.post('/', createTask);
router.delete('/:id', deleteTask);
router.post('/', verifyToken, validateTask, createTask);

export default router;

