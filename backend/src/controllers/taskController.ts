import type { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../types/index.js';

const prisma = new PrismaClient();

// GET/tasks — Admins see all tasks, users see only their own
export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;

        // Conditionally build the where clause — never pass `undefined` as a value
        const where = user?.role === 'admin' ? {} : { authorId: user!.id };

        const tasks = await prisma.task.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// POST/tasks — Create a new task for the authenticated user
export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description } = req.body;
        const authorId = req.user?.id;

        if (!authorId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                authorId,
            },
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Removed updateTask as requested
// DELETE/tasks/:id — Delete a task
export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const taskId = parseInt(req.params['id'] ?? '', 10);
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const task = await prisma.task.findUnique({ where: { id: taskId } });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Only the task owner or an admin can delete a task
        if (task.authorId !== user.id && user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await prisma.task.delete({ where: { id: taskId } });

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};