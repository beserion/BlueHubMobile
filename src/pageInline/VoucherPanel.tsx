import { useState, useEffect } from 'react';
import { Receipt, Loader2, Search, Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { SearchInput } from '../components/mobile/SearchInput';
import { getVouchers } from '../services/api';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';
import { DataRow } from '../components/mobile/DataRow';

const VoucherPanel = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [voucherType, setVoucherType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const fetchData = async (p = page) => {
        setLoading(true);
        setError(null);
        try {
            const params: any = { page: p, pageSize };
            if (voucherType) params.voucherType = Number(voucherType);
            if (startDate) params.startDate = new Date(startDate).toISOString();
            if (endDate) params.endDate = new Date(endDate).toISOString();
            const result = await getVouchers(params);

            // Handle different API response structures
            let items: any[] = [];
            if (Array.isArray(result)) {
                items = result;
            } else if (result?.data) {
                items = Array.isArray(result.data) ? result.data : [result.data];
            } else if (result?.items) {
                items = result.items;
            }

            setData(items);
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

    const handlePage = (dir: number) => {
        const newPage = page + dir;
        if (newPage < 1) return;
        setPage(newPage);
        fetchData(newPage);
    };

    const LoadingState = () => (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
            <span className="ml-2 text-slate-500">Yükleniyor...</span>
        </div>
    );

    return (
        <MobileContainer>
            {/* Header */}
            {/* Header Section */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                        <Receipt size={24} className="text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Fişler</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Fiş ve makbuz kayıtları</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="w-full space-y-3">
                    <div className="relative">
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            placeholder="Ara..."
                            className="bg-transparent dark:bg-transparent border-slate-200 dark:border-slate-800 shadow-sm"
                        />
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <select value={voucherType} onChange={e => setVoucherType(e.target.value)}
                                className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-700 appearance-none focus:outline-none">
                                <option value="">Tüm Tipler</option>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 35, 36, 37].map(v => (
                                    <option key={v} value={String(v)}>Tip {v}</option>
                                ))}
                            </select>
                            <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
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
                    <button onClick={() => { setPage(1); fetchData(1); }} className="w-full py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
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
                    <Receipt className="mx-auto mb-2 opacity-50" size={48} />
                    <p>Kayıt bulunamadı</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredData.map((row: any, i: number) => (
                        <MobileCard key={i} className="border-l-4 border-l-orange-500 dark:border-l-orange-500">
                            <div className="space-y-1">
                                {Object.entries(row).slice(0, 8).map(([key, val]: [string, any], j: number) => (
                                    <DataRow
                                        key={j}
                                        label={key}
                                        value={val === null || val === undefined ? '—' : typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                    />
                                ))}
                            </div>
                        </MobileCard>
                    ))}

                    <div className="flex items-center justify-between pt-4">
                        <button
                            onClick={() => handlePage(-1)}
                            disabled={page <= 1}
                            className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 disabled:opacity-50"
                        >
                            <ChevronLeft size={20} className="text-slate-600 dark:text-slate-400" />
                        </button>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Sayfa {page}</span>
                        <button
                            onClick={() => handlePage(1)}
                            disabled={data.length < pageSize}
                            className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 disabled:opacity-50"
                        >
                            <ChevronRight size={20} className="text-slate-600 dark:text-slate-400" />
                        </button>
                    </div>
                </div>
            )}
        </MobileContainer>
    );
};

export default VoucherPanel;
