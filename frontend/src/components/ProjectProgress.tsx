import { useMemo } from 'react';
import type { Task } from '../types';

interface ProjectProgressProps {
    tasks: Task[];
}

const ProjectProgress = ({ tasks }: ProjectProgressProps) => {
    const { percent } = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { completed: total - completed, pending: total - completed, percent };
    }, [tasks]);

    // Gauge math (semi-circle)
    const arcLength = Math.PI * 40; // ~125.66
    const dashOffset = arcLength - (percent / 100) * arcLength;

    return (
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold mb-6">Project Progress</h3>
            <div className="flex flex-col items-center">
                <div className="relative w-48 h-24 mb-6">
                    <svg className="w-full" viewBox="0 0 100 50">
                        <defs>
                            <pattern height="4" id="striped-gradient" patternTransform="rotate(45)" patternUnits="userSpaceOnUse" width="4">
                                <rect className="dark:fill-slate-700" fill="#cbd5e1" height="4" width="2"></rect>
                            </pattern>
                        </defs>

                        {/* Background track (striped) */}
                        <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            fill="none"
                            stroke="url(#striped-gradient)"
                            strokeLinecap="round"
                            strokeWidth="12"
                        ></path>

                        {/* Filled track (solid green) */}
                        <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            fill="none"
                            stroke="#1B5E20"
                            strokeLinecap="round"
                            strokeWidth="12"
                            strokeDasharray={arcLength}
                            strokeDashoffset={dashOffset}
                            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                        ></path>
                    </svg>

                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                        <p className="text-3xl font-bold">{percent}%</p>
                        <p className="text-[9px] text-slate-400">Project Ended</p>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-[9px] text-slate-500">Completed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                        <span className="text-[9px] text-slate-500">Pending</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectProgress;
