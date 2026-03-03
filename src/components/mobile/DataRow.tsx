import React from 'react';

interface DataRowProps {
    label: string;
    value: React.ReactNode;
    className?: string;
    valueClassName?: string;
}

export const DataRow: React.FC<DataRowProps> = ({ label, value, className = '', valueClassName = '' }) => {
    return (
        <div className={`flex justify-between items-start py-2 border-b border-slate-50 last:border-0 dark:border-slate-800 ${className}`}>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</span>
            <span className={`text-sm text-slate-900 dark:text-slate-200 font-semibold text-right ${valueClassName}`}>
                {value}
            </span>
        </div>
    );
};
