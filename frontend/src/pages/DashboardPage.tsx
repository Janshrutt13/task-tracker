import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { fetchTasks as fetchTasksApi } from '../api/tasks';
import type { Task } from '../types';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import ProjectAnalytics from '../components/ProjectAnalytics';
import Reminders from '../components/Reminders';
import TeamCollaboration from '../components/TeamCollaboration';
import ProjectProgress from '../components/ProjectProgress';
import TimeTracker from '../components/TimeTracker';
import TaskModal from '../components/TaskModal';
import TaskItem from '../components/TaskItem';
import TaskSkeleton from '../components/TaskSkeleton';

const DashboardPage = () => {
    const { isAdmin } = useAuth();
    const { isDark, toggleDarkMode } = useTheme();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const fetchTasks = useCallback(async () => {
        try {
            const data = await fetchTasksApi();
            setTasks(data);
        } catch {
            // Error handled by axios interceptor
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleAddClick = () => {
        setEditingTask(null);
        setModalOpen(true);
    };

    const handleEditClick = (task: Task) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setEditingTask(null);
    };

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex font-sans">
            <Sidebar
                taskCount={totalTasks}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 overflow-y-auto">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <div className="px-4 sm:px-8 pb-8">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 mt-4 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-1 font-display">Dashboard</h1>
                            <p className="text-slate-500 dark:text-slate-400">Plan, prioritize, and accomplish your tasks with ease.</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddClick}
                                className="bg-primary text-white px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20"
                            >
                                <span className="material-icons-round">add</span> Add Project
                            </button>
                            <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-2.5 rounded-full font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                Import Data
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-8">
                            {/* Skeleton for stat cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 h-40 animate-pulse">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-6" />
                                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-3" />
                                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
                                    </div>
                                ))}
                            </div>
                            {/* Skeleton for task list */}
                            <TaskSkeleton />
                        </div>
                    ) : (
                        <>
                            {/* Stat Cards - 4 Columns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <StatCard
                                    label="Total Projects"
                                    value={totalTasks}
                                    variant="green"
                                    subtitle={<><span className="bg-white/20 px-1 rounded">5%</span> Increased from last month</>}
                                />
                                <StatCard
                                    label="Ended Projects"
                                    value={completedTasks}
                                    subtitle={<><span className="bg-primary/10 text-primary px-1 rounded">6%</span> Increased from last month</>}
                                />
                                <StatCard
                                    label="Running Projects"
                                    value={pendingTasks}
                                    subtitle={<><span className="bg-primary/10 text-primary px-1 rounded">2%</span> Increased from last month</>}
                                />
                                <StatCard
                                    label="Pending Project"
                                    value={pendingTasks}
                                    subtitle={<p className="text-[10px] text-primary font-medium">On Discuss</p>}
                                />
                            </div>

                            {/* Task List Section */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold">Tasks</h2>
                                    <span className="text-sm text-slate-400">{totalTasks} total</span>
                                </div>
                                {tasks.length === 0 ? (
                                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-12 text-center">
                                        <span className="material-icons-round text-5xl text-slate-300 dark:text-slate-600 mb-3 block">assignment</span>
                                        <p className="text-slate-500 text-sm">No tasks yet. Click "Add Project" to create your first task.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {tasks.map(task => (
                                            <TaskItem
                                                key={task.id}
                                                task={task}
                                                onRefresh={fetchTasks}
                                                onEdit={handleEditClick}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Middle Grid - 12 Columns */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                                <ProjectAnalytics tasks={tasks} />
                                <Reminders tasks={tasks} />
                            </div>

                            {/* Bottom Grid - 12 Columns */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {isAdmin ? (
                                    <TeamCollaboration tasks={tasks} />
                                ) : (
                                    <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                        <div className="text-center text-slate-500">
                                            <span className="material-icons-round text-4xl mb-2 opacity-50">folder_open</span>
                                            <p className="text-sm">Your personal workspace</p>
                                        </div>
                                    </div>
                                )}
                                <ProjectProgress tasks={tasks} />
                                <TimeTracker />
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Floating Dark Mode Toggle */}
            <button
                className="fixed bottom-6 right-6 w-12 h-12 bg-white dark:bg-slate-800 shadow-xl rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 z-50 transition-transform hover:scale-105"
                onClick={toggleDarkMode}
                title="Toggle Dark Mode"
            >
                {isDark ? (
                    <span className="material-icons-round text-yellow-400">light_mode</span>
                ) : (
                    <span className="material-icons-round text-slate-700">dark_mode</span>
                )}
            </button>

            <TaskModal
                isOpen={modalOpen}
                onClose={handleModalClose}
                onSuccess={fetchTasks}
                task={editingTask}
            />
        </div>
    );
};

export default DashboardPage;
