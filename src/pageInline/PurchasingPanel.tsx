import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Users, Package, Truck, Loader2, ArrowRight } from 'lucide-react';
import { SearchInput } from '../components/mobile/SearchInput';
import { getPurchaseSummary, getLastInvoices, getTopSuppliers } from '../services/api';
import { useSignalREvent } from '../context/SignalRContext';
import { HubEvents } from '../services/signalr';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';
import { DataRow } from '../components/mobile/DataRow';
import { StatusBadge } from '../components/mobile/StatusBadge';

const PurchasingPanel = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const activeTab = searchParams.get('tab') || 'siparisler';

    // API state
    const [invoices, setInvoices] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // SignalR: auto-refresh on real-time events
    const triggerRefresh = useCallback(() => setRefreshTrigger(prev => prev + 1), []);
    useSignalREvent(HubEvents.PurchaseUpdated, triggerRefresh);

    const setActiveTab = (id: string) => {
        navigate(`?tab=${id}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (activeTab === 'siparisler') {
                    const [sum, inv] = await Promise.allSettled([
                        getPurchaseSummary(),
                        getLastInvoices(),
                    ]);
                    if (sum.status === 'fulfilled') setSummary(sum.value);
                    if (inv.status === 'fulfilled') {
                        const raw = inv.value;
                        const arr = raw?.items ?? raw?.invoiceList ?? (Array.isArray(raw) ? raw : []);
                        setInvoices(arr);
                    }
                } else if (activeTab === 'gruplar') {
                    const data = await getTopSuppliers();
                    const arr = data?.items ?? (Array.isArray(data) ? data : []);
                    setSuppliers(arr);
                }
            } catch (err: any) {
                setError(err.message || 'Veri yüklenirken hata oluştu');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeTab, refreshTrigger]);

    const purchasingMenu = [
        { id: 'siparisler', label: 'Siparişler', icon: ShoppingCart },
        { id: 'takip', label: 'Takip', icon: Users },
        { id: 'geciken', label: 'Geciken', icon: Package },
        { id: 'gruplar', label: 'Tedarikçiler', icon: Truck },
    ];

    const LoadingState = () => (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin h-8 w-8 text-sky-500" />
            <span className="ml-2 text-slate-500">Yükleniyor...</span>
        </div>
    );

    const filteredInvoices = invoices.filter(inv =>
        (inv.partnerName || inv.partner?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.invoiceNo || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderContent = () => {
        if (loading) return <LoadingState />;
        if (error) return <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center text-sm font-medium">{error}</div>;

        switch (activeTab) {
            case 'siparisler':
                return (
                    <div className="space-y-4 pb-20">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-sky-50 dark:bg-sky-900/20 rounded-xl">
                                    <ShoppingCart size={24} className="text-sky-600 dark:text-sky-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Siparişler</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Siparişler ve tedarik süreçleri</p>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="w-full">
                                <SearchInput
                                    value={searchQuery}
                                    onChange={setSearchQuery}
                                    placeholder="Sipariş veya cari ara..."
                                    className="bg-transparent dark:bg-transparent border-slate-200 dark:border-slate-800 shadow-sm"
                                />
                            </div>
                        </div>

                        {filteredInvoices.length > 0 ? (
                            <div className="space-y-3">
                                {filteredInvoices.map((inv: any, i: number) => (
                                    <MobileCard key={inv.id || i} className="border-l-4 border-l-sky-500 dark:border-l-sky-500" onClick={() => navigate(`/detail/invoice/${inv.id || i}`, { state: { data: inv } })}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 px-2 py-1 rounded inline-block mb-1 w-fit">
                                                    {inv.invoiceNo || inv.purchaseOrderNo || inv.id || '—'}
                                                </span>
                                                <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{inv.partnerName || inv.partner?.name || '—'}</h3>
                                            </div>
                                            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                                                {inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString('tr-TR') : '—'}
                                            </span>
                                        </div>

                                        <div className="pt-2 border-t border-slate-50 dark:border-slate-800">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-400 font-bold uppercase">Tutar</span>
                                                <div className="text-lg font-black text-slate-800 dark:text-white text-right">
                                                    {inv.gnlTotal != null ? new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(inv.gnlTotal) : '0,00'}
                                                    <span className="ml-1 text-xs font-bold text-sky-500">{inv.currency || 'TRY'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </MobileCard>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-400">
                                <ShoppingCart className="mx-auto mb-2 opacity-50" size={48} />
                                <p>Sipariş bulunamadı</p>
                            </div>
                        )}
                    </div>
                );
            case 'takip':
                return (
                    <div className="space-y-4 pb-20">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                    <Users size={24} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Sipariş Takibi</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Sipariş durumları</p>
                                </div>
                            </div>
                        </div>
                        <MobileCard className="text-center p-8">
                            <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Henüz Veri Yok</h3>
                            <p className="text-slate-500 mt-2 text-sm">Sipariş takip listesi ve detayları burada yer alacak.</p>
                        </MobileCard>
                    </div>
                );
            case 'geciken':
                return (
                    <div className="space-y-4 pb-20">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                                    <Package size={24} className="text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Geciken Siparişler</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Teslimatı gecikenler</p>
                                </div>
                            </div>
                        </div>
                        <MobileCard className="text-center p-8">
                            <Package className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Henüz Veri Yok</h3>
                            <p className="text-slate-500 mt-2 text-sm">Geciken sipariş listesi burada yer alacak.</p>
                        </MobileCard>
                    </div>
                );
            case 'gruplar':
                return (
                    <div className="space-y-4 pb-20">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                    <Truck size={24} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Tedarikçiler</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">En çok alım yapılanlar</p>
                                </div>
                            </div>
                        </div>

                        {suppliers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {suppliers.map((s: any, i: number) => (
                                    <MobileCard key={s.id || i} className="border-l-4 border-l-emerald-500 dark:border-l-emerald-500" onClick={() => navigate(`/detail/partner/${s.id || s.partnerId || i}`, { state: { data: s } })}>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full uppercase">#{i + 1}</span>
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate mb-2">{s.partnerName || s.name || s.supplierName || '—'}</h4>
                                        <div className="flex justify-between items-center text-sm border-t border-slate-50 dark:border-slate-800 pt-2">
                                            <span className="text-slate-400 font-bold uppercase text-[10px]">Toplam Tutar</span>
                                            <span className="font-bold text-slate-900 dark:text-white text-right">
                                                {s.totalAmount != null ? new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(s.totalAmount) : '—'}
                                            </span>
                                        </div>
                                    </MobileCard>
                                ))}
                            </div>
                        ) : (
                            <MobileCard className="text-center p-8">
                                <Truck className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                <p className="text-slate-500 text-sm">Tedarikçi verisi bulunamadı</p>
                            </MobileCard>
                        )}
                    </div>
                );
            default: return null;
        }
    };

    return (
        <MobileContainer className="pb-0">
            {renderContent()}

            {/* Bottom Menu */}
            <div className="fixed bottom-0 left-0 w-full p-4 z-30 pointer-events-none">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 max-w-sm mx-auto pointer-events-auto">
                    <nav className="grid grid-cols-4 gap-1">
                        {purchasingMenu.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setActiveTab(m.id)}
                                className={`
                                    flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 group w-full outline-none focus:outline-none tap-highlight-transparent
                                    ${activeTab === m.id
                                        ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-slate-800'
                                        : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }
                                `}
                            >
                                <m.icon size={20} className="mb-1" />
                                <span className="text-[10px] font-bold text-center leading-tight truncate w-full">{m.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </MobileContainer>
    );
};

export default PurchasingPanel;
