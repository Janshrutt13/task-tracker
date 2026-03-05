import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user } = useAuth();

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : user?.email?.slice(0, 2).toUpperCase() || 'U';

    const displayName = user?.name || (user?.role === 'admin' ? 'Admin' : 'User');

    return (
        <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-8 py-4 flex items-center justify-between">
            <div className="relative w-full max-w-xl">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                    className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl pl-12 pr-16 py-3 shadow-sm focus:ring-2 focus:ring-primary/20 outline-none text-sm text-slate-900 dark:text-slate-100"
                    placeholder="Search task"
                    type="text"
                />
                <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 border border-slate-200 dark:border-slate-700 rounded text-[10px] text-slate-400 font-sans">⌘F</kbd>
            </div>

            <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm text-slate-500 hover:text-primary transition-colors">
                    <span className="material-icons-round">mail_outline</span>
                </button>
                <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm text-slate-500 hover:text-primary transition-colors">
                    <span className="material-icons-round text-2xl">notifications_none</span>
                </button>

                <div className="flex items-center gap-3 ml-4 bg-white dark:bg-slate-900 py-1 pl-1 pr-4 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {initials}
                    </div>
                    <div>
                        <p className="text-xs font-bold leading-tight truncate max-w-[120px]">{displayName}</p>
                        <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{user?.email}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
