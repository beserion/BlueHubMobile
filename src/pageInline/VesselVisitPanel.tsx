import { useState, useEffect, useCallback } from 'react';
import { Anchor, Loader2, Calendar, MapPin, Briefcase } from 'lucide-react';
import { SearchInput } from '../components/mobile/SearchInput';
import { getVesselVisits } from '../services/api';
import { useSignalREvent } from '../context/SignalRContext';
import { HubEvents } from '../services/signalr';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';
import { DataRow } from '../components/mobile/DataRow';
import { StatusBadge } from '../components/mobile/StatusBadge';

import { useNavigate } from 'react-router-dom';

const VesselVisitPanel = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // SignalR: auto-refresh on real-time events
    const triggerRefresh = useCallback(() => setRefreshTrigger(prev => prev + 1), []);
    useSignalREvent(HubEvents.VesselVisitUpdated, triggerRefresh);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params: any = {};
            if (search) params.kriter = search;
            if (startDate) params.startDate = new Date(startDate).toISOString();
            if (endDate) params.endDate = new Date(endDate).toISOString();
            const result = await getVesselVisits(params);
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
    }, [refreshTrigger, search, startDate, endDate]);

    const LoadingState = () => (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            <span className="ml-2 text-slate-500">Yükleniyor...</span>
        </div>
    );

    return (
        <MobileContainer>
            {/* Header Section */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <Anchor size={24} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Ziyaretler</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Operasyon ve ziyaret takibi</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="w-full space-y-3">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Gemi, Acente Ara..."
                        className="bg-transparent dark:bg-transparent border-slate-200 dark:border-slate-800 shadow-sm"
                    />
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
            {loading ? (
                <LoadingState />
            ) : error ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center text-sm font-medium">
                    {error}
                </div>
            ) : data.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <Anchor className="mx-auto mb-2 opacity-50" size={48} />
                    <p>Ziyaret bulunamadı</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {data.map((row: any, i: number) => {
                        const isActive = row.departureDate ? new Date(row.departureDate) > new Date() : true;
                        return (
                            <MobileCard key={i} className="border-l-4 border-l-blue-500 dark:border-l-blue-500" onClick={() => navigate(`/detail/vessel-visit/${row.id || i}`, { state: { data: row } })}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gemi</span>
                                        <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{row.vessel || '—'}</h3>
                                    </div>
                                    <StatusBadge status={isActive ? 'success' : 'default'}>
                                        {isActive ? 'Aktif' : 'Pasif'}
                                    </StatusBadge>
                                </div>

                                <div className="space-y-1 border-t border-slate-50 dark:border-slate-800 pt-2 mt-2">
                                    <DataRow label="Liman" value={row.port} icon={<MapPin size={14} className="text-blue-500" />} />
                                    <DataRow label="Acente" value={row.agent} icon={<Briefcase size={14} className="text-blue-500" />} />
                                    <DataRow label="Amaç" value={row.purpose} />
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-dashed border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">Geliş</span>
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{row.arrivalDate ? new Date(row.arrivalDate).toLocaleDateString('tr-TR') : '—'}</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">Gidiş</span>
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{row.departureDate ? new Date(row.departureDate).toLocaleDateString('tr-TR') : '—'}</span>
                                    </div>
                                </div>
                            </MobileCard>
                        );
                    })}
                </div>
            )}
        </MobileContainer>
    );
};

export default VesselVisitPanel;
