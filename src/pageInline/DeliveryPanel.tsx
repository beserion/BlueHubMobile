import { useState, useEffect } from 'react';
import { Truck, Loader2, Search, Calendar, Filter, FileText } from 'lucide-react';
import { SearchInput } from '../components/mobile/SearchInput';
import { getDeliveries } from '../services/api';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';
import { DataRow } from '../components/mobile/DataRow';
import { StatusBadge } from '../components/mobile/StatusBadge';

const deliveryTypes = [
    { value: '', label: 'Tümü' },
    { value: '1', label: 'Tip 1' },
    { value: '2', label: 'Tip 2' },
    { value: '3', label: 'Tip 3' },
    { value: '4', label: 'Tip 4' },
];

const DeliveryPanel = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params: any = {};
            if (type) params.type = Number(type);
            if (startDate) params.startDate = new Date(startDate).toISOString();
            if (endDate) params.endDate = new Date(endDate).toISOString();
            const result = await getDeliveries(params);
            setData(Array.isArray(result) ? result : result?.data ? (Array.isArray(result.data) ? result.data : [result.data]) : []);
        } catch (err: any) {
            setError(err.message || 'Veriler yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

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
            {/* Header */}
            {/* Header Section */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
                        <Truck size={24} className="text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Teslimatlar</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Sevkiyat ve teslimat operasyonları</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="w-full space-y-3">
                    <div className="relative">
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            placeholder="Teslimat ara..."
                            className="bg-transparent dark:bg-transparent border-slate-200 dark:border-slate-800 shadow-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <select
                            value={type}
                            onChange={e => setType(e.target.value)}
                            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm border border-slate-200 dark:border-slate-700 focus:outline-none"
                        >
                            {deliveryTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                        <button onClick={fetchData} className="px-3 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors">
                            Uygula
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                                className="w-full pl-8 pr-2 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-700" />
                        </div>
                        <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                                className="w-full pl-8 pr-2 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-700" />
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
            ) : filteredData.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <Truck className="mx-auto mb-2 opacity-50" size={48} />
                    <p>Kayıt bulunamadı</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredData.map((row: any, i: number) => (
                        <MobileCard key={i} className="border-l-4 border-l-cyan-500 dark:border-l-cyan-500">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 px-2 py-1 rounded">
                                    #{row.id || i + 1}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {row.date ? new Date(row.date).toLocaleDateString('tr-TR') : 'Tarih Yok'}
                                </span>
                            </div>

                            <div className="space-y-1">
                                {Object.entries(row).slice(0, 6).map(([key, val]: [string, any], j: number) => {
                                    if (key === 'id' || key === 'date') return null; // Skip already shown fields
                                    return (
                                        <DataRow
                                            key={j}
                                            label={key}
                                            value={val === null || val === undefined ? '—' : typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                        />
                                    );
                                })}
                            </div>
                        </MobileCard>
                    ))}
                </div>
            )}
        </MobileContainer>
    );
};

export default DeliveryPanel;
