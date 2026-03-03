import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder = 'Ara...',
    className = ''
}) => {
    return (
        <div className={`relative flex items-center w-full ${className}`}>
            <span className="absolute left-3 text-slate-400 text-sm font-medium pointer-events-none">
                Ara...
            </span>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder !== 'Ara...' ? placeholder : ''}
                className="w-full pl-14 pr-10 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100 placeholder-transparent"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {value && (
                    <button
                        onClick={() => onChange('')}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
                <div className="p-1.5 bg-blue-500 text-white rounded-lg shadow-sm shadow-blue-500/30">
                    <Search size={16} />
                </div>
            </div>
        </div>
    );
};
