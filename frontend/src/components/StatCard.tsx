interface StatCardProps {
    label: string;
    value: number;
    subtitle: React.ReactNode;
    variant?: 'default' | 'green';
}

const StatCard = ({ label, value, subtitle, variant = 'default' }: StatCardProps) => {
    if (variant === 'green') {
        return (
            <div className="bg-primary p-6 rounded-3xl text-white flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                    <span className="text-sm font-medium opacity-90">{label}</span>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="material-icons-round text-sm">north_east</span>
                    </div>
                </div>
                <div>
                    <h2 className="text-4xl font-bold mb-2">{value}</h2>
                    <div className="text-[10px] flex items-center gap-1 opacity-80">
                        {subtitle}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-slate-500">{label}</span>
                <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                    <span className="material-icons-round text-sm">north_east</span>
                </div>
            </div>
            <div>
                <h2 className="text-4xl font-bold mb-2">{value}</h2>
                <div className="text-[10px] flex items-center gap-1 text-slate-500">
                    {subtitle}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
