import { useState, useEffect, useCallback } from 'react';
import { Truck, Loader2, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { SearchInput } from '../components/mobile/SearchInput';
import { getLogisticProfitability } from '../services/api';
import { useSignalREvent } from '../context/SignalRContext';
import { HubEvents } from '../services/signalr';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';
import { DataRow } from '../components/mobile/DataRow';
import { StatusBadge } from '../components/mobile/StatusBadge';

import { useNavigate } from 'react-router-dom';

const LogisticPanel = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // SignalR: auto-refresh on real-time events
    const triggerRefresh = useCallback(() => setRefreshTrigger(prev => prev + 1), []);
    useSignalREvent(HubEvents.LogisticUpdated, triggerRefresh);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params: any = {};
            const result = await getLogisticProfitability(params);
            setData(Array.isArray(result) ? result : result?.data ? (Array.isArray(result.data) ? result.data : [result.data]) : []);
        } catch (err: any) {
            setError(err.message || 'Veriler yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [refreshTrigger]);

    // Format currency helper
    const formatCurrency = (amount: number, currency: string = 'TRY') => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: currency }).format(amount);
    };

    return (
        <MobileContainer>
            {/* Header Section */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                        <Truck size={24} className="text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Lojistik</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Sevkiyat ve karlılık takibi</p>
                    </div>
                </div>

                {/* Search Input */}
                <div className="w-full">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Sefer / Rota ara..."
                        className="bg-transparent dark:bg-transparent border-slate-200 dark:border-slate-800 shadow-sm"
                    />
                </div>
            </div>

            {/* Content Section */}
            <div className="min-h-[300px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="animate-spin text-teal-500" size={32} />
                        <span className="text-sm text-slate-500">Yükleniyor...</span>
                    </div>
                ) : error ? (
                    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 p-6 rounded-2xl text-center">
                        <p className="text-rose-600 dark:text-rose-400 text-sm font-bold">{error}</p>
                    </div>
                ) : data.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-10 text-center">
                        <Truck className="mx-auto text-slate-200 dark:text-slate-800 mb-3" size={48} />
                        <p className="text-slate-400 dark:text-slate-500 font-bold text-sm">Kayıt bulunamadı</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {data.filter((item: any) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase())).map((row: any, i: number) => {
                            const mainTitle = row.route || row.rota || row.cari || row.customerName || 'Sefer Bilgisi';
                            const badgeInfo = row.plate || row.plaka || row.invoiceNo || row.fisNo || '—';
                            const amount = row.profit || row.kar || row.amount || row.tutar || 0;
                            const currency = row.currency || row.doviz || 'TRY';
                            const isPositive = amount >= 0;

                            return (
                                <MobileCard key={i} onClick={() => navigate(`/detail/logistic/${row.id || i}`, { state: { data: row } })}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                                                <Target className="text-teal-600 dark:text-teal-400" size={16} />
                                            </div>
                                            <StatusBadge status="default">{badgeInfo}</StatusBadge>
                                        </div>
                                        {/* Optional: Add status or date here if available */}
                                    </div>

                                    <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4 line-clamp-2">
                                        {mainTitle}
                                    </h3>

                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 space-y-1">
                                        <DataRow
                                            label="Durum"
                                            value={
                                                <div className="flex items-center gap-1 justify-end">
                                                    {isPositive ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-rose-500" />}
                                                    <span className={isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                                                        {isPositive ? 'Kar' : 'Zarar'}
                                                    </span>
                                                </div>
                                            }
                                        />
                                        <DataRow
                                            label="Tutar"
                                            value={formatCurrency(amount, currency)}
                                            valueClassName={isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}
                                        />
                                    </div>

                                    <button className="w-full mt-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                                        <span>Detayları Gör</span>
                                    </button>
                                </MobileCard>
                            );
                        })}
                    </div>
                )}
            </div>
        </MobileContainer>
    );
};

export default LogisticPanel;
