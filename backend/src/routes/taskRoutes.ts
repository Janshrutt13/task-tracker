import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validateTask } from '../middleware/validationMiddleware.js';

const router = Router();

// Apply auth middleware to all task routes
router.use(verifyToken);

// Routes
router.get('/', getTasks);
router.post('/', validateTask, createTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
