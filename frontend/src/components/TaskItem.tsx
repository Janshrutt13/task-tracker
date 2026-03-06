import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateTask as updateTaskApi, deleteTask as deleteTaskApi } from '../api/tasks';
import { toast } from './Toast';
import { Trash2, Edit3, CheckCircle, Circle } from 'lucide-react';
import type { Task } from '../types';

interface TaskItemProps {
    task: Task;
    onRefresh: () => void;
    onEdit: (task: Task) => void;
}

const TaskItem = ({ task, onRefresh, onEdit }: TaskItemProps) => {
    const { user, isAdmin } = useAuth();
    const [toggling, setToggling] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const canModify = isAdmin || task.authorId === user?.id;

    const handleToggleStatus = async () => {
        if (toggling) return;
        setToggling(true);
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        try {
            await updateTaskApi(task.id, { status: newStatus });
            toast.success(`Task marked as ${newStatus}`);
            onRefresh();
        } catch {
            toast.error('Failed to update task status');
        } finally {
            setToggling(false);
        }
    };

    const handleDelete = async () => {
        if (deleting) return;
        setDeleting(true);
        try {
            await deleteTaskApi(task.id);
            toast.success('Task deleted successfully');
            onRefresh();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to delete task';
            toast.error(`API Error: ${msg}`);
        } finally {
            setDeleting(false);
        }
    };

    const isCompleted = task.status === 'completed';

    return (
        <div className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Status Toggle */}
                <button
                    onClick={handleToggleStatus}
                    disabled={toggling}
                    className={`shrink-0 transition-all duration-200 ${isCompleted
                            ? 'text-primary hover:text-primary-light'
                            : 'text-slate-300 dark:text-slate-600 hover:text-primary'
                        } ${toggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={`Mark as ${isCompleted ? 'pending' : 'completed'}`}
                >
                    {isCompleted ? (
                        <CheckCircle size={22} strokeWidth={2.5} />
                    ) : (
                        <Circle size={22} strokeWidth={2} />
                    )}
                </button>

                {/* Task Content */}
                <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold truncate transition-all ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
                        }`}>
                        {task.title}
                    </p>
                    {task.description && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                            {task.description}
                        </p>
                    )}
                    <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1">
                        {new Date(task.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                        })}
                    </p>
                </div>
            </div>

            {/* Status Badge */}
            <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full mr-3 ${isCompleted
                    ? 'bg-green-100 dark:bg-green-950/40 text-green-600'
                    : 'bg-amber-100 dark:bg-amber-950/40 text-amber-600'
                }`}>
                {isCompleted ? 'Completed' : 'Pending'}
            </span>

            {/* Action Buttons — visible to owner or admin */}
            {canModify && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Edit Task"
                    >
                        <Edit3 size={15} />
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className={`p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors ${deleting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        title="Delete Task"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskItem;
