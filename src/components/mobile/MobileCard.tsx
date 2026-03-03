import React from 'react';

interface MobileCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const MobileCard: React.FC<MobileCardProps> = ({ children, className = '', onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/5 shadow-sm shadow-slate-200/50 dark:shadow-none p-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 ${onClick ? 'cursor-pointer active:scale-[0.98] hover:bg-white/80 dark:hover:bg-slate-900/80' : ''} ${className}`}
        >
            {children}
        </div>
    );
};
