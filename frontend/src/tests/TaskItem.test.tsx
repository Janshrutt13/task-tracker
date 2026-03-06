import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TaskItem from '../components/TaskItem';
import type { Task } from '../types';

// Mock dependencies
vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn(() => ({
        user: { id: 1, email: 'owner@test.com', role: 'user' },
        isAdmin: false,
    })),
}));

vi.mock('../api/tasks', () => ({
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
}));

vi.mock('../components/Toast', () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}));

const mockTask: Task = {
    id: 1,
    title: 'Test Task Title',
    description: 'Test description',
    status: 'pending',
    authorId: 1,
    createdAt: new Date().toISOString(),
};

describe('TaskItem', () => {
    const mockOnRefresh = vi.fn();
    const mockOnEdit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the task title', () => {
        render(
            <TaskItem task={mockTask} onRefresh={mockOnRefresh} onEdit={mockOnEdit} />
        );
        expect(screen.getByText('Test Task Title')).toBeInTheDocument();
    });

    it('renders the task description', () => {
        render(
            <TaskItem task={mockTask} onRefresh={mockOnRefresh} onEdit={mockOnEdit} />
        );
        expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('displays the correct status badge', () => {
        render(
            <TaskItem task={mockTask} onRefresh={mockOnRefresh} onEdit={mockOnEdit} />
        );
        expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('displays "Completed" badge for completed tasks', () => {
        const completedTask: Task = { ...mockTask, status: 'completed' };
        render(
            <TaskItem task={completedTask} onRefresh={mockOnRefresh} onEdit={mockOnEdit} />
        );
        expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('shows edit and delete buttons for the task owner', () => {
        render(
            <TaskItem task={mockTask} onRefresh={mockOnRefresh} onEdit={mockOnEdit} />
        );
        expect(screen.getByTitle('Edit Task')).toBeInTheDocument();
        expect(screen.getByTitle('Delete Task')).toBeInTheDocument();
    });

    it('calls onEdit with the task when Edit button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <TaskItem task={mockTask} onRefresh={mockOnRefresh} onEdit={mockOnEdit} />
        );
        await user.click(screen.getByTitle('Edit Task'));
        expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
    });

    it('calls deleteTask API when Delete button is clicked', async () => {
        const { deleteTask } = await import('../api/tasks');
        (deleteTask as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});
        const user = userEvent.setup();
        render(
            <TaskItem task={mockTask} onRefresh={mockOnRefresh} onEdit={mockOnEdit} />
        );
        await user.click(screen.getByTitle('Delete Task'));
        expect(deleteTask).toHaveBeenCalledWith(mockTask.id);
    });

    it('hides action buttons for non-owner, non-admin users', async () => {
        const { useAuth } = await import('../context/AuthContext');
        (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
            user: { id: 999, email: 'other@test.com', role: 'user' },
            isAdmin: false,
        });
        render(
            <TaskItem task={mockTask} onRefresh={mockOnRefresh} onEdit={mockOnEdit} />
        );
        expect(screen.queryByTitle('Edit Task')).not.toBeInTheDocument();
        expect(screen.queryByTitle('Delete Task')).not.toBeInTheDocument();
    });
});
