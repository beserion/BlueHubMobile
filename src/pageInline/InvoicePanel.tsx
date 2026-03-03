import { useState, useEffect } from 'react';
import { FileText, Loader2, Search, Calendar, Filter } from 'lucide-react';
import { SearchInput } from '../components/mobile/SearchInput';
import { getInvoices } from '../services/api';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';
import { DataRow } from '../components/mobile/DataRow';
import { StatusBadge } from '../components/mobile/StatusBadge';

const InvoicePanel = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [invoiceType, setInvoiceType] = useState('');
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params: any = {};
            if (invoiceType) params.invoiceType = Number(invoiceType);
            if (status) params.status = status;
            if (startDate) params.startDate = new Date(startDate).toISOString();
            if (endDate) params.endDate = new Date(endDate).toISOString();
            const result = await getInvoices(params);
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
                        <FileText size={24} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Faturalar</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Fatura kayıtları ve takibi</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="w-full space-y-3">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Fatura ara..."
                        className="bg-transparent dark:bg-transparent border-slate-200 dark:border-slate-800 shadow-sm"
                    />

                    <div className="grid grid-cols-2 gap-2">
                        <select value={invoiceType} onChange={e => setInvoiceType(e.target.value)}
                            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm border border-slate-200 dark:border-slate-700 focus:outline-none">
                            <option value="">Tip: Tümü</option>
                            <option value="1">Tip 1</option>
                            <option value="2">Tip 2</option>
                        </select>
                        <input value={status} onChange={e => setStatus(e.target.value)} placeholder="Durum..."
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm border border-slate-200 dark:border-slate-700 focus:outline-none"
                        />
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

                    <button onClick={fetchData} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Filtrele
                    </button>
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
                    <FileText className="mx-auto mb-2 opacity-50" size={48} />
                    <p>Fatura bulunamadı</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredData.map((row: any, i: number) => (
                        <MobileCard key={i} className="border-l-4 border-l-blue-500 dark:border-l-blue-500">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                                    #{row.id || i + 1}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {row.date ? new Date(row.date).toLocaleDateString('tr-TR') : 'Tarih Yok'}
                                </span>
                            </div>

                            <div className="space-y-1">
                                {Object.entries(row).slice(0, 6).map(([key, val]: [string, any], j: number) => {
                                    if (key === 'id' || key === 'date') return null;
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

export default InvoicePanel;
