import { useState, useEffect } from 'react';

const TimeTracker = () => {
    const [time, setTime] = useState(0); // Time in seconds
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isRunning) {
            interval = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, time]);

    // Format time: HH:MM:SS
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2);
    const getMinutes = `0${Math.floor((time % 3600) / 60)}`.slice(-2);
    const getSeconds = `0${(time % 60)}`.slice(-2);

    return (
        <div className="lg:col-span-3 bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-800 text-white overflow-hidden relative">
            <div className="relative z-10 flex flex-col justify-between h-full">
                <h3 className="text-sm font-medium">Time Tracker</h3>
                <div className="text-center my-6">
                    <h2 className="text-3xl font-bold tracking-widest font-mono">
                        {getHours}:{getMinutes}:{getSeconds}
                    </h2>
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 hover:bg-slate-200"
                        onClick={() => setIsRunning(!isRunning)}
                        title={isRunning ? 'Pause' : 'Start'}
                    >
                        <span className="material-icons-round text-xl">{isRunning ? 'pause' : 'play_arrow'}</span>
                    </button>
                    <button
                        className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600"
                        onClick={() => { setIsRunning(false); setTime(0); }}
                        title="Stop"
                    >
                        <span className="material-icons-round text-xl">stop</span>
                    </button>
                </div>
            </div>

            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                    <path d="M0,100 C20,120 40,80 60,100 C80,120 100,80 120,100 C140,120 160,80 180,100 C200,120 200,200 0,200 Z" fill="white" opacity="0.1"></path>
                    <path d="M0,120 C20,140 40,100 60,120 C80,140 100,100 120,120 C140,140 160,100 180,120 C200,140 200,200 0,200 Z" fill="white" opacity="0.1"></path>
                </svg>
            </div>
        </div>
    );
};

export default TimeTracker;
