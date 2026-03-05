import type { Task } from '../types';

interface RemindersProps {
    tasks: Task[];
}

const Reminders = ({ tasks }: RemindersProps) => {
    const pendingTask = tasks.find((t) => t.status === 'pending');

    return (
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
            <h3 className="font-bold mb-6">Reminders</h3>
            <div className="space-y-4 flex-1 flex flex-col justify-center">
                {pendingTask ? (
                    <>
                        <div>
                            <p className="text-xl font-bold leading-tight mb-1 truncate">{pendingTask.title}</p>
                            <p className="text-xs text-slate-400 truncate">
                                Created:{' '}
                                {new Date(pendingTask.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        <button className="w-full py-3 mt-4 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 font-semibold hover:bg-primary-light transition-colors">
                            <span className="material-icons-round text-lg">videocam</span> Start Task
                        </button>
                    </>
                ) : (
                    <div className="text-center">
                        <p className="text-slate-500 text-sm">🎉 No pending tasks! You're all caught up.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reminders;
