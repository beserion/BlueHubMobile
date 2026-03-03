import { useState, useEffect, useCallback } from 'react';
import { CheckSquare, Loader2, Calendar, Filter } from 'lucide-react';
import { SearchInput } from '../components/mobile/SearchInput';
import { getTodos } from '../services/api';
import { useSignalREvent } from '../context/SignalRContext';
import { HubEvents } from '../services/signalr';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';
import { DataRow } from '../components/mobile/DataRow';
import { StatusBadge } from '../components/mobile/StatusBadge';

import { useNavigate } from 'react-router-dom';

const TodoPanel = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [status, setStatus] = useState(''); // Empty string for 'All'
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // SignalR: auto-refresh on real-time events
    const triggerRefresh = useCallback(() => setRefreshTrigger(prev => prev + 1), []);
    useSignalREvent(HubEvents.TodoUpdated, triggerRefresh);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params: any = {};
            if (status) params.status = status;
            if (searchQuery) params.kriter = searchQuery;
            if (startDate) params.startDate = new Date(startDate).toISOString();
            if (endDate) params.endDate = new Date(endDate).toISOString();
            const result = await getTodos(params);
            setData(Array.isArray(result) ? result : result?.data ? (Array.isArray(result.data) ? result.data : [result.data]) : []);
        } catch (err: any) {
            setError(err.message || 'Veriler yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    // Auto-refresh when filters change
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300); // 300ms debounce
        return () => clearTimeout(timer);
    }, [refreshTrigger, searchQuery, status, startDate, endDate]);

    const LoadingState = () => (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin h-8 w-8 text-emerald-500" />
            <span className="ml-2 text-slate-500">Yükleniyor...</span>
        </div>
    );

    return (
        <MobileContainer>
            {/* Header Section */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                        <CheckSquare size={24} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Yapılacak Listesi</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Görev ve ajanda takibi</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="w-full space-y-3">
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Görev Ara..."
                        className="bg-transparent dark:bg-transparent border-slate-200 dark:border-slate-800 shadow-sm"
                    />

                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <select value={status} onChange={e => setStatus(e.target.value)}
                                className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-800 appearance-none focus:outline-none">
                                <option value="">Tümü</option>
                                <option value="open">Açık</option>
                                <option value="closed">Kapalı</option>
                                <option value="pending">Beklemede</option>
                            </select>
                            <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                                className="w-full pl-8 pr-2 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-800" />
                        </div>
                        <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                                className="w-full pl-8 pr-2 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-800" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            {
                loading ? (
                    <LoadingState />
                ) : error ? (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center text-sm font-medium">
                        {error}
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <CheckSquare className="mx-auto mb-2 opacity-50" size={48} />
                        <p>Görev bulunamadı</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {data.map((row: any, i: number) => (
                            <MobileCard key={i} className="border-l-4 border-l-emerald-500 dark:border-l-emerald-500" onClick={() => navigate(`/detail/todo/${row.id || i}`, { state: { data: row } })}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-col">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded w-fit mb-1 ${row.priority === 'High' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                                            row.priority === 'Medium' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                                                'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                                            }`}>
                                            {row.priority || 'Normal'}
                                        </span>
                                        <h3 className="font-bold text-slate-800 dark:text-white line-clamp-2">{row.title || '—'}</h3>
                                    </div>
                                    <StatusBadge status={row.status === 'completed' ? 'success' : 'default'}>
                                        {row.status || 'Açık'}
                                    </StatusBadge>
                                </div>

                                <div className="space-y-1 border-t border-slate-50 dark:border-slate-800 pt-2 mt-2">
                                    <DataRow label="Atanan" value={row.assignee || '—'} />
                                    <DataRow label="Bitiş Tarihi" value={row.dueDate ? new Date(row.dueDate).toLocaleDateString('tr-TR') : '—'} />
                                </div>
                            </MobileCard>
                        ))}
                    </div>
                )
            }
        </MobileContainer >
    );
};

export default TodoPanel;