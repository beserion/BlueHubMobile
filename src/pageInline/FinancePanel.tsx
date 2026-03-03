import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    FileText,
    Receipt,
    CreditCard,
    Zap,
    DollarSign,
    Users,
    Briefcase,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2,
    BarChart2
} from 'lucide-react';
import { SearchInput } from '../components/mobile/SearchInput';
import { getInvoices, getPayments, getVouchers, getIncomeStatement } from '../services/api';
import { useSignalREvent } from '../context/SignalRContext';
import { HubEvents } from '../services/signalr';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';
import { DataRow } from '../components/mobile/DataRow';
import { StatusBadge } from '../components/mobile/StatusBadge';

// Helper for formatting currency
export const formatCurrency = (amount: number, currency: string = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: currency }).format(amount);
};

const FinancePanel = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const activeTab = searchParams.get('tab') || 'hesap-plani';

    // Account Plan state (from API)
    const [accountPlan, setAccountPlan] = useState<any[]>([]);
    // Income Statement state (from API)
    const [incomeData, setIncomeData] = useState<any[]>([]);


    // Dashboard state
    const [dashData, setDashData] = useState<any>(null);
    // Invoice state
    const [invoices, setInvoices] = useState<any[]>([]);
    const [invSearch, setInvSearch] = useState('');
    const [invType, setInvType] = useState('');
    const [invStatus, setInvStatus] = useState('');
    const [invStartDate, setInvStartDate] = useState('');
    const [invEndDate, setInvEndDate] = useState('');
    // Payment state
    const [payments, setPayments] = useState<any[]>([]);
    const [paySearch, setPaySearch] = useState('');
    const [payType, setPayType] = useState('');
    const [payCurrency, setPayCurrency] = useState('');
    const [payStartDate, setPayStartDate] = useState('');
    const [payEndDate, setPayEndDate] = useState('');
    const [payPage, setPayPage] = useState(1);
    // Voucher state
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [vocSearch, setVocSearch] = useState('');
    const [vocType, setVocType] = useState('');
    const [vocStartDate, setVocStartDate] = useState('');
    const [vocEndDate, setVocEndDate] = useState('');
    const [vocPage, setVocPage] = useState(1);

    const pageSize = 20;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // SignalR: auto-refresh on real-time events
    const triggerRefresh = useCallback(() => setRefreshTrigger(prev => prev + 1), []);
    useSignalREvent(HubEvents.InvoiceUpdated, triggerRefresh);
    useSignalREvent(HubEvents.PaymentUpdated, triggerRefresh);
    useSignalREvent(HubEvents.VoucherUpdated, triggerRefresh);
    useSignalREvent(HubEvents.DashboardUpdated, triggerRefresh);
    const setActiveTab = (id: string) => {
        navigate(`?tab=${id}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (activeTab === 'hesap-plani') {
                    // MOCK DATA START
                    const mockAccountPlan = [
                        { id: 1, accountCode: '100', accountName: 'KASA HESABI', balanceTL: 45250.00, level: 1 },
                        { id: 2, accountCode: '100.01', accountName: 'MERKEZ KASA', balanceTL: 25000.00, level: 2 },
                        { id: 3, accountCode: '100.02', accountName: 'ŞUBE KASA', balanceTL: 20250.00, level: 2 },
                        { id: 4, accountCode: '102', accountName: 'BANKALAR', balanceTL: 1250000.00, level: 1 },
                        { id: 5, accountCode: '102.01', accountName: 'İŞ BANKASI', balanceTL: 750000.00, level: 2 },
                        { id: 6, accountCode: '102.02', accountName: 'GARANTİ BANKASI', balanceTL: 500000.00, level: 2 },
                        { id: 7, accountCode: '120', accountName: 'ALICILAR', balanceTL: 850000.00, level: 1 },
                        { id: 8, accountCode: '120.01', accountName: 'YURTİÇİ ALICILAR', balanceTL: 600000.00, level: 2 },
                        { id: 9, accountCode: '120.02', accountName: 'YURTDIŞI ALICILAR', balanceTL: 250000.00, level: 2 },
                        { id: 10, accountCode: '153', accountName: 'TİCARİ MALLAR', balanceTL: 2150000.00, level: 1 },
                        { id: 11, accountCode: '320', accountName: 'SATICILAR', balanceTL: 450000.00, level: 1 },
                    ];
                    setAccountPlan(mockAccountPlan);
                } else if (activeTab === 'gelir-tablosu') {
                    const result = await getIncomeStatement();
                    const arr = Array.isArray(result) ? result : result?.items ?? result?.data ?? [];
                    setIncomeData(arr);
                } else if (activeTab === 'faturalar') {
                    const params: any = {};
                    if (invType) params.invoiceType = Number(invType);
                    if (invStatus) params.status = invStatus;
                    if (invStartDate) params.startDate = new Date(invStartDate).toISOString();
                    if (invEndDate) params.endDate = new Date(invEndDate).toISOString();
                    const result = await getInvoices(params);
                    const arr = result?.invoiceList ?? result?.items ?? (Array.isArray(result) ? result : []);
                    setInvoices(arr);

                } else if (activeTab === 'fisler') {
                    const params: any = { page: vocPage, pageSize };
                    if (vocType) params.voucherType = Number(vocType);
                    if (vocStartDate) params.startDate = new Date(vocStartDate).toISOString();
                    if (vocEndDate) params.endDate = new Date(vocEndDate).toISOString();
                    const result = await getVouchers(params);
                    const arr = result?.voucherList ?? result?.items ?? (Array.isArray(result) ? result : []);
                    setVouchers(arr);
                }
            } catch (err: any) {
                setError(err.message || 'Veri yüklenirken hata oluştu');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeTab, refreshTrigger, invType, vocType, vocPage, pageSize, invStatus, invStartDate, invEndDate, vocStartDate, vocEndDate]);

    const financeMenu = [
        { id: 'hesap-plani', label: 'Hesap Planı', icon: BarChart2 },
        { id: 'gelir-tablosu', label: 'Gelirler', icon: TrendingUp },
        { id: 'faturalar', label: 'Faturalar', icon: FileText },
        { id: 'fisler', label: 'Fişler', icon: Receipt },
    ];

    const LoadingState = () => (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            <span className="ml-2 text-slate-500">Yükleniyor...</span>
        </div>
    );



    const fetchInvoices = async () => {
        setLoading(true); setError(null);
        try {
            const params: any = {};
            if (invType) params.invoiceType = Number(invType);
            if (invStatus) params.status = invStatus;
            if (invStartDate) params.startDate = new Date(invStartDate).toISOString();
            if (invEndDate) params.endDate = new Date(invEndDate).toISOString();
            const result = await getInvoices(params);
            const arr = result?.invoiceList ?? result?.items ?? (Array.isArray(result) ? result : []);
            setInvoices(arr);
        } catch (err: any) { setError(err.message); } finally { setLoading(false); }
    };

    const fetchVouchers = async (p = vocPage) => {
        setLoading(true); setError(null);
        try {
            const params: any = { page: p, pageSize };
            if (vocType) params.voucherType = Number(vocType);
            if (vocStartDate) params.startDate = new Date(vocStartDate).toISOString();
            if (vocEndDate) params.endDate = new Date(vocEndDate).toISOString();
            const result = await getVouchers(params);
            const arr = result?.voucherList ?? result?.items ?? (Array.isArray(result) ? result : []);
            setVouchers(arr);
        } catch (err: any) { setError(err.message); } finally { setLoading(false); }
    };

    const renderContent = () => {
        if (loading) return <LoadingState />;
        if (error) return <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm">{error}</div>;

        switch (activeTab) {
            case 'hesap-plani': {
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                    <BarChart2 size={24} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Hesap Planı</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Toplam Kayıt: {accountPlan.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {accountPlan.map((item: any) => (
                                <MobileCard
                                    key={item.id}
                                    className={`
                                        ${item.level === 1 ? 'border-l-8 border-l-blue-500 dark:border-l-blue-500' : ''}
                                        ${item.level === 2 ? 'border-l-4 border-l-green-400 dark:border-l-green-400 ml-2' : ''}
                                        ${item.level === 3 ? 'border-l-6 border-l-slate-300 dark:border-l-slate-700 ml-4' : ''}
                                    `}
                                    onClick={() => navigate(`/detail/account/${item.id}`, { state: { data: item } })}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-tighter uppercase block mb-0.5">{item.accountCode}</span>
                                            <h4 className={`text-sm ${item.level === 1 ? 'font-black' : item.level === 2 ? 'font-bold' : 'font-semibold'} text-slate-800 dark:text-slate-100`}>
                                                {item.accountName}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end pt-2 border-t border-slate-50 dark:border-slate-800">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bakiye</div>
                                        <div className="text-base font-black text-slate-900 dark:text-slate-100 text-right">
                                            {formatCurrency(item.balanceTL || 0, 'TRY')}
                                        </div>
                                    </div>
                                </MobileCard>
                            ))}
                        </div>
                    </div>
                );
            }
            case 'gelir-tablosu': {
                const incomeItems = incomeData.filter((item: any) =>
                    (item.accountCode && (item.accountCode.startsWith('60') || item.accountCode.startsWith('64') || item.accountCode.startsWith('67'))) ||
                    (item.code && (item.code.startsWith('60') || item.code.startsWith('64') || item.code.startsWith('67')))
                );
                const expenseItems = incomeData.filter((item: any) =>
                    (item.accountCode && (item.accountCode.startsWith('61') || item.accountCode.startsWith('62') || item.accountCode.startsWith('63') || item.accountCode.startsWith('65') || item.accountCode.startsWith('68') || item.accountCode.startsWith('7'))) ||
                    (item.code && (item.code.startsWith('61') || item.code.startsWith('62') || item.code.startsWith('63') || item.code.startsWith('65') || item.code.startsWith('68') || item.code.startsWith('7')))
                );

                const totalIncome = incomeItems.reduce((acc: number, item: any) => acc + Math.abs(item.balance ?? item.credit ?? item.amount ?? 0), 0);
                const totalExpense = expenseItems.reduce((acc: number, item: any) => acc + Math.abs(item.balance ?? item.debit ?? item.amount ?? 0), 0);
                const netProfit = totalIncome - totalExpense;

                return (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                    <TrendingUp size={24} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Gelir Tablosu</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Kar/Zarar Durumu</p>
                                </div>
                            </div>
                        </div>

                        <MobileCard className="!bg-emerald-600 !text-white p-6">

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <p className="text-xs font-bold text-emerald-100 uppercase mb-1">Dönem Net Kâr</p>
                                <p className="text-3xl font-black text-white text-right">
                                    {formatCurrency(netProfit)}
                                </p>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="bg-white/5 rounded-lg p-3">
                                    <span className="text-xs text-emerald-100 block mb-1 text-right">Gelirler</span>
                                    <span className="font-bold text-lg text-white text-right block">{formatCurrency(totalIncome)}</span>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                    <span className="text-xs text-emerald-100 block mb-1 text-right">Giderler</span>
                                    <span className="font-bold text-lg text-white text-right block">{formatCurrency(totalExpense)}</span>
                                </div>
                            </div>
                        </MobileCard>




                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-700 dark:text-slate-300 ml-1">Gelir Kalemleri</h4>
                            {incomeItems.length > 0 ? incomeItems.map((item: any, idx: number) => (
                                <MobileCard key={idx} className="border-l-4 border-l-emerald-500 dark:border-l-emerald-500">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase block">{item.accountCode || item.code}</span>
                                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.accountName || item.name}</span>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 text-right">
                                            {formatCurrency(Math.abs(item.balance ?? item.credit ?? item.amount ?? 0))}
                                        </span>
                                    </div>
                                </MobileCard>
                            )) : <div className="text-center text-slate-400 py-4">Veri yok</div>}

                            <h4 className="font-bold text-slate-700 dark:text-slate-300 ml-1 mt-6">Gider Kalemleri</h4>
                            {expenseItems.length > 0 ? expenseItems.map((item: any, idx: number) => (
                                <MobileCard key={idx} className="border-l-4 border-l-rose-500 dark:border-l-rose-500">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase block">{item.accountCode || item.code}</span>
                                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.accountName || item.name}</span>
                                        </div>
                                        <span className="text-sm font-bold text-rose-600 dark:text-rose-400 text-right">
                                            {formatCurrency(Math.abs(item.balance ?? item.debit ?? item.amount ?? 0))}
                                        </span>
                                    </div>
                                </MobileCard>
                            )) : <div className="text-center text-slate-400 py-4">Veri yok</div>}
                        </div>
                    </div>
                );
            }
            case 'faturalar': {
                const filtered = invSearch ? invoices.filter((item: any) => JSON.stringify(item).toLowerCase().includes(invSearch.toLowerCase())) : invoices;
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                    <FileText size={24} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Faturalar</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Fatura ve finansal takipler</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <SearchInput
                                    value={invSearch}
                                    onChange={setInvSearch}
                                    placeholder="Fatura No / Cari Ara..."
                                    className="bg-transparent dark:bg-transparent border-slate-200 dark:border-slate-800 shadow-sm"
                                />
                                <div className="flex gap-2">
                                    <select value={invType} onChange={e => setInvType(e.target.value)}
                                        className="flex-1 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg text-sm border border-slate-200 dark:border-slate-800 outline-none">
                                        <option value="">Tüm Tipler</option>
                                        <option value="1">Alış Faturası</option>
                                        <option value="2">Satış Faturası</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {filtered.length === 0 ? (
                                <div className="text-center py-10 text-slate-400">Kayıt bulunamadı</div>
                            ) : (
                                filtered.map((item: any, i: number) => (
                                    <MobileCard key={i} onClick={() => navigate(`/detail/invoice/${item.id || i}`, { state: { data: item } })}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                                    <FileText size={16} className="text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">#{item.voucherId || '—'}</span>
                                            </div>
                                            <StatusBadge status="default">{item.invoiceType === 1 ? 'Alış' : 'Satış'}</StatusBadge>
                                        </div>

                                        <div className="mb-3">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Firma</span>
                                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{item.companyId || '—'}</h3>
                                        </div>

                                        <div className="space-y-1 pt-3 border-t border-slate-50 dark:border-slate-800">
                                            <DataRow label="Partner" value={item.partnerId || '—'} />
                                            <DataRow label="Proje" value={item.projectId || '—'} />
                                        </div>
                                    </MobileCard>
                                ))
                            )}
                        </div>
                    </div>
                );
            }
            case 'fisler': {
                const filtered = vocSearch ? vouchers.filter((item: any) => JSON.stringify(item).toLowerCase().includes(vocSearch.toLowerCase())) : vouchers;
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                                    <Receipt size={24} className="text-violet-600 dark:text-violet-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Fişler</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Fiş ve makbuz yönetimi</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <SearchInput
                                    value={vocSearch}
                                    onChange={setVocSearch}
                                    placeholder="Fiş No / Açıklama..."
                                    className="bg-transparent dark:bg-transparent border-slate-200 dark:border-slate-800 shadow-sm"
                                />
                                <div className="flex gap-2">
                                    <select value={vocType} onChange={e => setVocType(e.target.value)}
                                        className="flex-1 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg text-sm border border-slate-200 dark:border-slate-800 outline-none">
                                        <option value="">Tüm Tipler</option>
                                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 35, 36, 37].map(v => (
                                            <option key={v} value={String(v)}>Tip {v}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {filtered.length === 0 ? (
                                <div className="text-center py-10 text-slate-400">Kayıt bulunamadı</div>
                            ) : (
                                filtered.map((item: any, i: number) => (
                                    <MobileCard key={i} onClick={() => navigate(`/detail/voucher/${item.id || i}`, { state: { data: item } })}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                                                    <Receipt size={16} className="text-violet-600 dark:text-violet-400" />
                                                </div>
                                                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">#{item.voucherNo || '—'}</span>
                                            </div>
                                            <StatusBadge status={item.type === 'Tahsilat' ? 'success' : item.type === 'Tediye' ? 'error' : 'default'}>
                                                {item.type || '—'}
                                            </StatusBadge>
                                        </div>

                                        <div className="mb-3">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Açıklama</span>
                                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2">{item.description || '—'}</h3>
                                        </div>

                                        <div className="space-y-1 pt-3 border-t border-slate-50 dark:border-slate-800">
                                            <DataRow label="Tutar" value={formatCurrency(item.amount, item.currency)} className="font-bold text-slate-900 dark:text-white" />
                                        </div>
                                    </MobileCard>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between p-2">
                            <button onClick={() => { const p = vocPage - 1; if (p < 1) return; setVocPage(p); fetchVouchers(p); }} disabled={vocPage <= 1}
                                className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm disabled:opacity-50">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm font-medium text-slate-500">Sayfa {vocPage}</span>
                            <button onClick={() => { const p = vocPage + 1; setVocPage(p); fetchVouchers(p); }} disabled={vouchers.length < pageSize}
                                className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm disabled:opacity-50">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                );
            }
            default:
                return null;
        }
    };

    return (
        <MobileContainer className="pb-24">
            {renderContent()}

            <div className="fixed bottom-0 left-0 lg:left-72 right-0 p-4 z-30 pointer-events-none">
                <div id="bottombar" className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 max-w-lg mx-auto pointer-events-auto">
                    <nav className="grid grid-cols-4 gap-1">
                        {financeMenu.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setActiveTab(m.id)}
                                className={`
                                flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 group w-full outline-none focus:outline-none tap-highlight-transparent
                                ${activeTab === m.id
                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800'
                                        : 'text-slate-400 dark:text-slate-500 active:text-blue-600 dark:active:text-blue-400'
                                    }
                                `}
                            >
                                <m.icon size={20} strokeWidth={2.5} className="mb-1" />
                                <span className="text-[10px] font-semibold">{m.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </MobileContainer>
    );
};

export default FinancePanel;
