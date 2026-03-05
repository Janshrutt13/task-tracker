import { useState, useEffect } from 'react';
import type { User, Task } from '../types';
import api from '../api/axios';

interface TeamCollaborationProps {
    tasks: Task[];
}

const TeamCollaboration = ({ tasks }: TeamCollaborationProps) => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/auth/all-users');
                setUsers(res.data);
            } catch {
                // silently fail for non-admin
            }
        };
        fetchUsers();
    }, []);

    const getUserTask = (userId: number) => {
        const userTasks = tasks.filter(t => t.authorId === userId);
        return userTasks.length > 0 ? userTasks[0] : null;
    };

    const getStatusStyles = (status?: string) => {
        if (status === 'completed') {
            return {
                text: 'Completed',
                classes: 'bg-green-100 dark:bg-green-950/40 text-green-600'
            };
        }
        return {
            text: 'Pending',
            classes: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600'
        };
    };

    return (
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold">Team Collaboration</h3>
                <button className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-300 flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-icons-round text-[14px]">add</span> Add Member
                </button>
            </div>

            <div className="space-y-4">
                {users.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">Loading team members...</p>
                ) : (
                    users.slice(0, 3).map((u) => {
                        const task = getUserTask(u.id);
                        const initials = (u.name || u.email).slice(0, 2).toUpperCase();
                        const statusInfo = getStatusStyles(task?.status);

                        return (
                            <div key={u.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                        {initials}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold truncate max-w-[150px]">{u.name || 'Team Member'}</p>
                                        <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                                            Working on <span className="text-slate-600 dark:text-slate-300 font-medium">
                                                {task ? task.title : 'No active tasks'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${statusInfo.classes}`}>
                                    {statusInfo.text}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default TeamCollaboration;
