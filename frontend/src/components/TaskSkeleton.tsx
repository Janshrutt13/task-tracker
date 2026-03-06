const TaskSkeleton = () => {
    return (
        <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse"
                >
                    {/* Circle placeholder */}
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />

                    {/* Text lines */}
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4" />
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/2" />
                    </div>

                    {/* Badge placeholder */}
                    <div className="w-16 h-5 bg-slate-200 dark:bg-slate-700 rounded-full shrink-0" />
                </div>
            ))}
        </div>
    );
};

export default TaskSkeleton;
