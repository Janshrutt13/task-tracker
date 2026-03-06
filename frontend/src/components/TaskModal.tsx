import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTask, updateTask } from '../api/tasks';
import { toast } from './Toast';
import type { Task } from '../types';
import { X } from 'lucide-react';
import { taskSchema, type TaskFormData } from '../lib/validation';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    task?: Task | null; // if provided, modal is in Edit mode
}

const TaskModal = ({ isOpen, onClose, onSuccess, task }: TaskModalProps) => {
    const isEditing = !!task;

    const {
        register: registerField,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            status: 'pending',
        },
    });

    // Pre-fill form when editing, reset when creating
    useEffect(() => {
        if (task) {
            reset({
                title: task.title,
                description: task.description || '',
                status: task.status,
            });
        } else {
            reset({
                title: '',
                description: '',
                status: 'pending',
            });
        }
    }, [task, isOpen, reset]);

    if (!isOpen) return null;

    const onSubmit = async (data: TaskFormData) => {
        try {
            if (isEditing && task) {
                await updateTask(task.id, {
                    title: data.title.trim(),
                    description: data.description?.trim() || undefined,
                    status: data.status,
                });
                toast.success('Task updated successfully!');
            } else {
                await createTask({
                    title: data.title.trim(),
                    description: data.description?.trim() || undefined,
                    status: data.status,
                });
                toast.success('Task created successfully!');
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            const msg = err.response?.data?.message
                || err.response?.data?.errors?.[0]
                || `Failed to ${isEditing ? 'update' : 'create'} task`;
            toast.error(msg);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-bold m-0">
                        {isEditing ? 'Edit Task' : 'Add New Task'}
                    </h2>
                    <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="task-title" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Title *
                        </label>
                        <input
                            id="task-title"
                            type="text"
                            className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all ${errors.title
                                    ? 'border-red-400 dark:border-red-500'
                                    : 'border-slate-200 dark:border-slate-700'
                                }`}
                            placeholder="e.g., Build Dashboard UI"
                            {...registerField('title')}
                            autoFocus
                        />
                        {errors.title && (
                            <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="task-desc" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Description
                        </label>
                        <textarea
                            id="task-desc"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all resize-y"
                            placeholder="Optional description..."
                            rows={3}
                            {...registerField('description')}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="task-status" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Status
                        </label>
                        <select
                            id="task-status"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                            {...registerField('status')}
                        >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            type="button"
                            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    {isEditing ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                isEditing ? 'Update Task' : 'Create Task'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
