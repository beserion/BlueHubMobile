import { useState, useEffect } from 'react';
import { CreditCard, Loader2, Search, Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { SearchInput } from '../components/mobile/SearchInput';
import { getPayments } from '../services/api';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';
import { DataRow } from '../components/mobile/DataRow';

const paymentTypes = [
    { value: '', label: 'Tümü' },
    { value: '1', label: 'Tip 1' },
    { value: '2', label: 'Tip 2' },
    { value: '3', label: 'Tip 3' },
    { value: '4', label: 'Tip 4' },
];

const PaymentPanel = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [currency, setCurrency] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const fetchData = async (p = page) => {
        setLoading(true);
        setError(null);
        try {
            const params: any = { currentpage: p, pagesize: pageSize };
            if (paymentType) params.paymentType = Number(paymentType);
            if (currency) params.currency = currency;
            if (search) params.kriter = search;
            if (startDate) params.startDate = new Date(startDate).toISOString();
            if (endDate) params.endDate = new Date(endDate).toISOString();
            const result = await getPayments(params);
            setData(Array.isArray(result) ? result : result?.data ? (Array.isArray(result.data) ? result.data : [result.data]) : []);
        } catch (err: any) {
            setError(err.message || 'Veriler yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handlePage = (dir: number) => {
        const newPage = page + dir;
        if (newPage < 1) return;
        setPage(newPage);
        fetchData(newPage);
    };

    const LoadingState = () => (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin h-8 w-8 text-green-500" />
            <span className="ml-2 text-slate-500">Yükleniyor...</span>
        </div>
    );

    return (
        <MobileContainer>
            {/* Header Section */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <CreditCard size={24} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Ödemeler</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Ödeme kayıtları ve takibi</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="w-full space-y-3">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Ödeme ara..."
                        className="bg-transparent dark:bg-transparent border-slate-200 dark:border-slate-800 shadow-sm"
                    />

                    <div className="grid grid-cols-2 gap-2">
                        <select value={paymentType} onChange={e => setPaymentType(e.target.value)}
                            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm border border-slate-200 dark:border-slate-700 focus:outline-none">
                            {paymentTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                        <input value={currency} onChange={e => setCurrency(e.target.value)} placeholder="Döviz (TRY)..."
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

                    <button onClick={() => { setPage(1); fetchData(1); }} className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
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
            ) : data.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <CreditCard className="mx-auto mb-2 opacity-50" size={48} />
                    <p>Ödeme bulunamadı</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {data.map((row: any, i: number) => (
                        <MobileCard key={i} className="border-l-4 border-l-green-500 dark:border-l-green-500">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                    #{row.id || i + 1}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {row.date ? new Date(row.date).toLocaleDateString('tr-TR') : 'Tarih Yok'}
                                </span>
                            </div>
                            <div className="space-y-1">
                                {Object.entries(row).slice(0, 8).map(([key, val]: [string, any], j: number) => {
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

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-2 mt-4">
                        <button onClick={() => handlePage(-1)} disabled={page <= 1}
                            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Sayfa {page}</span>
                        <button onClick={() => handlePage(1)} disabled={data.length < pageSize}
                            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </MobileContainer>
    );
};

export default PaymentPanel;
