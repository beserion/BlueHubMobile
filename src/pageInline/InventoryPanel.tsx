import { useState, useEffect, useCallback } from 'react';
import { Package, Loader2, MapPin, Building2 } from 'lucide-react';
import { SearchInput } from '../components/mobile/SearchInput';
import { getWarehouses } from '../services/api';
import { useSignalREvent } from '../context/SignalRContext';
import { HubEvents } from '../services/signalr';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';

import { useNavigate } from 'react-router-dom';

const InventoryPanel = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // SignalR: auto-refresh on real-time events
    const triggerRefresh = useCallback(() => setRefreshTrigger(prev => prev + 1), []);
    useSignalREvent(HubEvents.InventoryUpdated, triggerRefresh);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getWarehouses();
                setData(Array.isArray(result) ? result : result?.data ? (Array.isArray(result.data) ? result.data : [result.data]) : []);
            } catch (err: any) {
                setError(err.message || 'Veriler yüklenemedi');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [refreshTrigger]);

    const filteredData = data.filter((item: any) =>
        JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );

    const LoadingState = () => (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin h-8 w-8 text-amber-500" />
            <span className="ml-2 text-slate-500">Depolar yükleniyor...</span>
        </div>
    );

    return (
        <MobileContainer>
            {/* Header Section */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                        <Package size={24} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Depo Paneli</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Depo listesi ve envanter</p>
                    </div>
                </div>

                {/* Search */}
                <div className="w-full">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Depo ara..."
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
                    <Package className="mx-auto mb-2 opacity-50" size={48} />
                    <p>Depo bulunamadı</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredData.map((row: any, i: number) => {
                        const displayName = row.name || row.warehouseName || row.depoAdi || 'Depo';
                        const code = row.code || row.warehouseCode || row.kodu || '—';
                        const country = row.country || row.ulke || '—';
                        const town = row.town || row.ilce || '';
                        const city = row.city || row.il || '';
                        const location = [town, city].filter(Boolean).join('/');

                        return (
                            <MobileCard key={i} className="border-l-4 border-l-amber-500 dark:border-l-amber-500" onClick={() => navigate(`/detail/warehouse/${row.id || i}`, { state: { data: row } })}>
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Building2 size={16} className="text-amber-500" />
                                        <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{displayName}</h3>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase">
                                        {code}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                        <MapPin size={14} className="text-amber-500" />
                                        <span>{location || 'Konum Yok'}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{country}</span>
                                </div>
                            </MobileCard>
                        );
                    })}
                </div>
            )}
        </MobileContainer>
    );
};

export default InventoryPanel;
