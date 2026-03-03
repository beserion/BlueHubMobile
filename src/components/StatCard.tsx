import { ArrowUp, ArrowDown } from 'lucide-react';
import { MobileCard } from './mobile/MobileCard';

interface StatCardProps {
    title: string;
    value: string;
    subValue?: string;
    icon: any;
    color: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'secondary';
    isTrendUp?: boolean;
    onClick?: () => void;
}

const StatCard = ({ title, value, subValue, icon: Icon, color, isTrendUp, onClick }: StatCardProps) => {
    const colorMap: any = {
        primary: 'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400',
        success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
        warning: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
        danger: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
        info: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
        purple: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
        secondary: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    };

    return (
        <MobileCard
            className="flex items-start justify-between hover:shadow-md transition-all duration-300"
            onClick={onClick}
        >
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wide">{title}</p>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1 tracking-tight">{value}</h3>
                {subValue && (
                    <p className={`text-xs mt-2 font-bold flex items-center ${isTrendUp === true ? 'text-emerald-600 dark:text-emerald-400' : isTrendUp === false ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`}>
                        {isTrendUp === true && <ArrowUp size={14} className="mr-1" />}
                        {isTrendUp === false && <ArrowDown size={14} className="mr-1" />}
                        {subValue}
                    </p>
                )}
            </div>
            <div className={`p-3 rounded-xl ${colorMap[color] || colorMap.primary} shadow-sm`}>
                <Icon size={24} />
            </div>
        </MobileCard>
    );
};

export default StatCard;
