import { useState, useEffect, useCallback } from 'react';
import { Users, Loader2, MapPin, Phone, Wallet, Building2, ShoppingCart, Factory, UserCheck } from 'lucide-react';
import { SearchInput } from '../components/mobile/SearchInput';
import { getPartnerBalance, getPartners } from '../services/api';
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
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [viewMode, setViewMode] = useState<'list' | 'summary'>('list');

    // SignalR: auto-refresh on real-time events
    const triggerRefresh = useCallback(() => setRefreshTrigger(prev => prev + 1), []);
    useSignalREvent(HubEvents.PartnerUpdated, triggerRefresh);

    const extractItems = (result: any): any[] => {
        if (Array.isArray(result)) return result;
        if (!result) return [];
        if (result.partners && Array.isArray(result.partners)) return result.partners;
        if (result.items && Array.isArray(result.items)) return result.items;
        if (result.data && Array.isArray(result.data)) return result.data;
        return [];
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Try partner-balance first (actual partner list with balances)
            const result = await getPartnerBalance({ companyId: 0, startRow: 0, endRow: 200 });
            const items = extractItems(result);
            if (items.length > 0) {
                setData(items);
                setViewMode('list');
                return;
            }
        } catch {
            // partner-balance failed, try summary
        }

        // Fallback: Partner/list dashboard summary
        try {
            const dashResult = await getPartners();
            if (dashResult && typeof dashResult === 'object' && !Array.isArray(dashResult)) {
                setSummary(dashResult);
                // partnerGroupList can serve as a browsable list
                const groups = dashResult.partnerGroupList || [];
                setData(groups);
                setViewMode('summary');
            } else {
                setError('Cari verileri yüklenemedi');
            }
        } catch (err2: any) {
            setError('Sunucu bağlantı hatası: ' + (err2.message || 'Bilinmeyen hata'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timer);
    }, [refreshTrigger, search]);

    const formatCurrency = (amount: number, currency: string = 'TRY') => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: currency }).format(amount);
    };

    // Filter for summary mode (group list items have text/value)
    const filteredData = viewMode === 'summary'
        ? data.filter((item: any) => (item.text || '').toLowerCase().includes(search.toLowerCase()))
        : data.filter((item: any) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()));

    const LoadingState = () => (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin h-8 w-8 text-cyan-500" />
            <span className="ml-2 text-slate-500">Yükleniyor...</span>
        </div>
    );

    // Summary dashboard cards
    const SummaryCards = () => {
        if (!summary) return null;
        const cards = [
            { label: 'Müşteriler', value: summary.customers || 0, icon: UserCheck, color: 'emerald' },
            { label: 'Tedarikçiler', value: summary.suppliers || 0, icon: ShoppingCart, color: 'blue' },
            { label: 'Üreticiler', value: summary.makers || 0, icon: Factory, color: 'purple' },
        ];
        return (
            <div className="grid grid-cols-3 gap-2 mb-4">
                {cards.map((c, i) => (
                    <div key={i} className={`bg-${c.color}-50 dark:bg-${c.color}-900/20 rounded-xl p-3 text-center`}>
                        <c.icon size={20} className={`mx-auto mb-1 text-${c.color}-600 dark:text-${c.color}-400`} />
                        <div className={`text-lg font-bold text-${c.color}-700 dark:text-${c.color}-300`}>{c.value.toLocaleString('tr-TR')}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{c.label}</div>
                    </div>
                ))}
            </div>
        );
    };

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
            ) : (
                <>
                    {/* Summary mode: show dashboard cards + group list */}
                    {viewMode === 'summary' && <SummaryCards />}

                    {viewMode === 'summary' && filteredData.length > 0 && (
                        <>
                            <h2 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Cari Gruplar ({filteredData.length})</h2>
                            <div className="space-y-2">
                                {filteredData.map((row: any, i: number) => (
                                    <MobileCard key={i} className="border-l-4 border-l-cyan-500 dark:border-l-cyan-500">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold text-sm">
                                                {(row.text || '?').charAt(0)}
                                            </div>
                                            <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{row.text || '—'}</span>
                                        </div>
                                    </MobileCard>
                                ))}
                            </div>
                        </>
                    )}

                    {viewMode === 'summary' && filteredData.length === 0 && (
                        <div className="text-center py-12 text-slate-400">
                            <Users className="mx-auto mb-2 opacity-50" size={48} />
                            <p>Cari grup bulunamadı</p>
                        </div>
                    )}

                    {/* List mode: show individual partner cards */}
                    {viewMode === 'list' && filteredData.length === 0 && (
                        <div className="text-center py-12 text-slate-400">
                            <Users className="mx-auto mb-2 opacity-50" size={48} />
                            <p>Cari bulunamadı</p>
                        </div>
                    )}

                    {viewMode === 'list' && filteredData.length > 0 && (
                        <div className="space-y-3">
                            {filteredData.map((row: any, i: number) => (
                                <MobileCard key={i} className="border-l-4 border-l-cyan-500 dark:border-l-cyan-500" onClick={() => navigate(`/detail/partner/${row.id || i}`, { state: { data: row } })}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex flex-col">
                                            <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{row.partnerName || row.name || row.shortName || '—'}</h3>
                                            <span className="text-xs text-slate-400 font-medium">{row.partnerType || row.type || '—'}</span>
                                        </div>
                                        <StatusBadge status={row.balance >= 0 ? 'success' : 'error'}>
                                            {formatCurrency(row.balance, row.currency)}
                                        </StatusBadge>
                                    </div>

                                    <div className="space-y-1 pt-2 border-t border-slate-50 dark:border-slate-800">
                                        <DataRow label="Şehir" value={row.city || '—'} icon={<MapPin size={14} className="text-cyan-500" />} />
                                        <DataRow label="Telefon" value={row.phone1 || row.mobilePhone || row.phone || '—'} icon={<Phone size={14} className="text-cyan-500" />} />
                                    </div>
                                </MobileCard>
                            ))}
                        </div>
                    )}
                </>
            )}
        </MobileContainer>
    );
};

export default PartnerPanel;
