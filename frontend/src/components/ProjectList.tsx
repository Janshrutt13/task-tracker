import type { Task } from '../types';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from './Toast';

interface ProjectListProps {
    tasks: Task[];
    onRefresh: () => void;
    onAddClick: () => void;
}

const ICONS = [
    { icon: 'code', bgClass: 'bg-indigo-100 dark:bg-indigo-900/30', colorClass: 'text-indigo-600' },
    { icon: 'sync_alt', bgClass: 'bg-teal-100 dark:bg-teal-900/30', colorClass: 'text-teal-600' },
    { icon: 'category', bgClass: 'bg-amber-100 dark:bg-amber-900/30', colorClass: 'text-amber-600' },
    { icon: 'speed', bgClass: 'bg-orange-100 dark:bg-orange-900/30', colorClass: 'text-orange-600' },
];

const ProjectList = ({ tasks, onRefresh, onAddClick }: ProjectListProps) => {
    const { user, isAdmin } = useAuth();
    const displayTasks = tasks.slice(0, 4); // Match 4 items to fit layout nicely

    const handleDelete = async (taskId: number) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            toast.success('Task deleted successfully');
            onRefresh();
        } catch {
            toast.error('Failed to delete task');
        }
    };

    const handleToggleStatus = async (task: Task) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        try {
            await api.patch(`/tasks/${task.id}`, { status: newStatus });
            onRefresh();
        } catch {
            toast.error('Failed to update task');
        }
    };

    return (
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold">Project</h3>
                <button
                    onClick={onAddClick}
                    className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 flex items-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                    <span className="material-icons-round text-[14px]">add</span> New
                </button>
            </div>

            <div className="space-y-4">
                {displayTasks.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No tasks found.</p>
                ) : (
                    displayTasks.map((task, i) => {
                        const iconSet = ICONS[i % ICONS.length];
                        const canDelete = isAdmin || task.authorId === user?.id;

                        return (
                            <div key={task.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <button
                                        className={`w-8 h-8 rounded-lg ${iconSet.bgClass} flex items-center justify-center ${iconSet.colorClass} hover:opacity-80 transition-opacity`}
                                        onClick={() => handleToggleStatus(task)}
                                        title={`Mark as ${task.status === 'completed' ? 'pending' : 'completed'}`}
                                    >
                                        <span className="material-icons-round text-sm">
                                            {task.status === 'completed' ? 'check' : iconSet.icon}
                                        </span>
                                    </button>
                                    <div>
                                        <p className={`text-xs font-bold ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                                            {task.title}
                                        </p>
                                        <p className="text-[9px] text-slate-400">
                                            Added: {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                {canDelete && (
                                    <button
                                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDelete(task.id)}
                                        title="Delete"
                                    >
                                        <span className="material-icons-round text-sm">delete</span>
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ProjectList;
