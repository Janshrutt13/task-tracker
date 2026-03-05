import { useMemo } from 'react';
import type { Task } from '../types';

interface ProjectAnalyticsProps {
    tasks: Task[];
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const ProjectAnalytics = ({ tasks }: ProjectAnalyticsProps) => {
    const dayCounts = useMemo(() => {
        const counts = [0, 0, 0, 0, 0, 0, 0];
        tasks.forEach((t) => {
            const day = new Date(t.createdAt).getDay();
            counts[day]++;
        });
        return counts;
    }, [tasks]);

    const maxCount = Math.max(...dayCounts, 1);

    // Mapping calculated heights to Tailwind visual classes for the bars
    const getBarClass = (ratio: number) => {
        if (ratio === 0) return 'striped-bar';
        if (ratio < 0.3) return 'bg-primary/30';
        if (ratio < 0.6) return 'bg-primary/60';
        if (ratio < 0.9) return 'bg-primary/80';
        return 'bg-primary';
    };

    return (
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold mb-6">Project Analytics</h3>
            <div className="flex items-end justify-between h-40 gap-3">
                {DAYS.map((day, i) => {
                    const count = dayCounts[i];
                    const ratio = count / maxCount;
                    // base height for empty is 24px (h-6), full is 100%
                    const percentHeight = count === 0 ? 15 : Math.max((ratio * 100), 20);
                    const isMax = count === maxCount && count > 0;

                    return (
                        <div key={i} className="flex-1 space-y-2 flex flex-col items-center justify-end relative h-full">
                            {isMax && (
                                <div className="absolute -top-6 bg-primary/10 text-primary text-[10px] px-1 rounded font-bold">
                                    {Math.round((count / tasks.length) * 100)}%
                                </div>
                            )}
                            <div
                                className={`w-full rounded-full ${getBarClass(ratio)}`}
                                style={{ height: `${percentHeight}%` }}
                            ></div>
                            <span className="text-[10px] text-slate-400">{day}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProjectAnalytics;
