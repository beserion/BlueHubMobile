import { useState, useEffect, useCallback } from 'react';
import { Users, Loader2, MapPin, Phone, Wallet } from 'lucide-react';
import { SearchInput } from '../components/mobile/SearchInput';
import { getPartners } from '../services/api';
import { useSignalREvent } from '../context/SignalRContext';
import { HubEvents } from '../services/signalr';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';
import { DataRow } from '../components/mobile/DataRow';
import { StatusBadge } from '../components/mobile/StatusBadge';

import { useNavigate } from 'react-router-dom';

const PartnerPanel = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // SignalR: auto-refresh on real-time events
    const triggerRefresh = useCallback(() => setRefreshTrigger(prev => prev + 1), []);
    useSignalREvent(HubEvents.PartnerUpdated, triggerRefresh);

    // Auto-refresh when filters change
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getPartners();
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
    }, [refreshTrigger, search]);

    const formatCurrency = (amount: number, currency: string = 'TRY') => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: currency }).format(amount);
    };

    const filteredData = data.filter((item: any) =>
        JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );

    const LoadingState = () => (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin h-8 w-8 text-cyan-500" />
            <span className="ml-2 text-slate-500">Yükleniyor...</span>
        </div>
    );

    return (
        <MobileContainer>
            {/* Header Section */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
                        <Users size={24} className="text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Hesaplar</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">İş ortakları ve bakiye</p>
                    </div>
                </div>

                {/* Search */}
                <div className="w-full">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Cari Ara..."
                        className="bg-transparent dark:bg-transparent border-slate-200 dark:border-slate-800 shadow-sm"
                    />
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <LoadingState />
            ) : error ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center text-sm font-medium">
                    {error}
                </div>
            ) : filteredData.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <Users className="mx-auto mb-2 opacity-50" size={48} />
                    <p>Cari bulunamadı</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredData.map((row: any, i: number) => (
                        <MobileCard key={i} className="border-l-4 border-l-cyan-500 dark:border-l-cyan-500" onClick={() => navigate(`/detail/partner/${row.id || i}`, { state: { data: row } })}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{row.name || '—'}</h3>
                                    <span className="text-xs text-slate-400 font-medium">{row.type || '—'}</span>
                                </div>
                                <StatusBadge status={row.balance >= 0 ? 'success' : 'error'}>
                                    {formatCurrency(row.balance, row.currency)}
                                </StatusBadge>
                            </div>

                            <div className="space-y-1 pt-2 border-t border-slate-50 dark:border-slate-800">
                                <DataRow label="Şehir" value={row.city || '—'} icon={<MapPin size={14} className="text-cyan-500" />} />
                                <DataRow label="Telefon" value={row.phone || '—'} icon={<Phone size={14} className="text-cyan-500" />} />
                            </div>
                        </MobileCard>
                    ))}
                </div>
            )}
        </MobileContainer>
    );
};

export default PartnerPanel;
