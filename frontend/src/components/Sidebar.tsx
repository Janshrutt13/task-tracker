import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    taskCount: number;
}

const Sidebar = ({ taskCount }: SidebarProps) => {
    const { isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-col p-6 hidden lg:flex shrink-0 h-screen sticky top-0 overflow-y-auto">
            <div className="flex items-center gap-2 mb-10">
                <span className="text-xl font-bold tracking-tight font-display">Tasktracker</span>
            </div>

            <div className="space-y-8 flex-1">
                <section>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Menu</p>
                    <nav className="space-y-1">
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`
                            }
                        >
                            <span className="material-icons-round text-xl">dashboard</span> Dashboard
                        </NavLink>

                        <NavLink
                            to="/tasks"
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-icons-round text-xl">assignment</span> Tasks
                            </div>
                            {taskCount > 0 && (
                                <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">{taskCount}</span>
                            )}
                        </NavLink>

                        <NavLink to="/calendar" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-icons-round text-xl">calendar_today</span> Calendar
                        </NavLink>

                        <NavLink to="/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-icons-round text-xl">bar_chart</span> Analytics
                        </NavLink>

                        {isAdmin && (
                            <NavLink to="/team" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <span className="material-icons-round text-xl">group</span> Team
                            </NavLink>
                        )}
                    </nav>
                </section>

                <section>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">General</p>
                    <nav className="space-y-1">
                        <NavLink to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-icons-round text-xl">settings</span> Settings
                        </NavLink>

                        <NavLink to="/help" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-icons-round text-xl">help_outline</span> Help
                        </NavLink>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left font-medium"
                        >
                            <span className="material-icons-round text-xl">logout</span> Logout
                        </button>
                    </nav>
                </section>
            </div>

            <div className="mt-auto bg-slate-900 dark:bg-black rounded-2xl p-5 text-white relative overflow-hidden mt-6 flex-shrink-0">
                <div className="relative z-10">
                    <p className="text-sm font-semibold mb-1">Download our Mobile App</p>
                    <p className="text-[11px] text-slate-400 mb-4">Get easy in another way</p>
                    <button className="w-full py-2 bg-primary hover:bg-primary/90 transition-colors rounded-lg text-xs font-semibold">Download</button>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
            </div>
        </aside>
    );
};

export default Sidebar;
