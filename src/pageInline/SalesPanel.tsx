import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, DollarSign, Blocks, Loader2, CheckCircle2, TrendingUp, FileBarChart, Package, BarChart3 } from 'lucide-react';
import { getRequests, getOffers, getProducts, getSalesReports } from '../services/api';
import { useSignalREvent } from '../context/SignalRContext';
import { HubEvents } from '../services/signalr';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';
import { DataRow } from '../components/mobile/DataRow';
import { StatusBadge } from '../components/mobile/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const activeTab = searchParams.get('tab') || 'dashboard';

    // API state
    const [requests, setRequests] = useState<any[]>([]);
    const [offers, setOffers] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [reports, setReports] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // SignalR: auto-refresh on real-time events
    const triggerRefresh = useCallback(() => setRefreshTrigger(prev => prev + 1), []);
    useSignalREvent(HubEvents.OrderUpdated, triggerRefresh);
    useSignalREvent(HubEvents.OfferUpdated, triggerRefresh);
    useSignalREvent(HubEvents.RequestUpdated, triggerRefresh);

    const setActiveTab = (id: string) => {
        navigate(`?tab=${id}`);
    };

    // Fetch data based on active tab
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (activeTab === 'dashboard') {
                    try {
                        const reqData = await getRequests({ startRow: 0, endRow: 10 });
                        const arr = reqData?.requests ?? (Array.isArray(reqData) ? reqData : []);
                        setRequests(arr);
                    } catch { /* requests failed, continue */ }
                } else if (activeTab === 'talepler') {
                    const data = await getRequests({ startRow: 0, endRow: 50 });
                    const arr = data?.requests ?? (Array.isArray(data) ? data : []);
                    setRequests(arr);
                } else if (activeTab === 'teklifler') {
                    const data = await getOffers({ startRow: 0, endRow: 50 });
                    const arr = data?.offers ?? (Array.isArray(data) ? data : []);
                    setOffers(arr);
                } else if (activeTab === 'urunler') {
                    const data = await getProducts();
                    setProducts(Array.isArray(data) ? data : []);
                } else if (activeTab === 'raporlar') {
                    const data = await getSalesReports();
                    setReports(data);
                }
            } catch (err: any) {
                setError(err.message || 'Veri yüklenirken hata oluştu');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeTab, refreshTrigger]);

    const salesMenu = [
        { id: 'dashboard', label: 'Özet', icon: TrendingUp },
        { id: 'talepler', label: 'Talepler', icon: Briefcase },
        { id: 'teklifler', label: 'Teklifler', icon: DollarSign },
        { id: 'urunler', label: 'Ürünler', icon: Blocks },
        { id: 'raporlar', label: 'Raporlar', icon: FileBarChart }
    ];

    const LoadingState = () => (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            <span className="ml-2 text-slate-500">Yükleniyor...</span>
        </div>
    );

    const EmptyState = ({ text }: { text: string }) => (
        <div className="text-center py-12 text-slate-400">
            <Briefcase className="mx-auto mb-2 opacity-50" size={48} />
            <p>{text}</p>
        </div>
    );

    const renderContent = () => {
        if (loading) return <LoadingState />;
        if (error) return <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center text-sm font-medium">{error}</div>;

        switch (activeTab) {
            case 'talepler':
                return (
                    <div className="space-y-4 pb-20">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                    <Briefcase size={24} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Talepler</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Müşteri talepleri listesi</p>
                                </div>
                            </div>
                        </div>

                        {requests.length > 0 ? (
                            <div className="space-y-3">
                                {requests.map((req: any, i: number) => (
                                    <MobileCard key={req.id || i} className="border-l-4 border-l-blue-500 dark:border-l-blue-500" onClick={() => navigate(`/detail/request/${req.id || i}`, { state: { data: req } })}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded w-fit mb-1">
                                                    {req.requestNo || req.id || '—'}
                                                </span>
                                                <h4 className="font-bold text-slate-800 dark:text-white line-clamp-1">{req.partnerName || '—'}</h4>
                                            </div>
                                            <StatusBadge status={req.status === 'Onaylandı' ? 'success' : 'default'}>{req.status || '—'}</StatusBadge>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-slate-400 font-medium border-t border-slate-50 dark:border-slate-800 pt-2 mt-2">
                                            <span>Tarih:</span>
                                            <span className="text-slate-700 dark:text-slate-200">{req.requestDate ? new Date(req.requestDate).toLocaleDateString('tr-TR') : '—'}</span>
                                        </div>
                                    </MobileCard>
                                ))}
                            </div>
                        ) : <EmptyState text="Talep bulunamadı" />}
                    </div>
                );
            case 'teklifler':
                return (
                    <div className="space-y-4 pb-20">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                    <DollarSign size={24} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Teklifler</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Verilen teklifler</p>
                                </div>
                            </div>
                        </div>

                        {offers.length > 0 ? (
                            <div className="space-y-3">
                                {offers.map((offer: any, i: number) => (
                                    <MobileCard key={offer.id || i} className="border-l-4 border-l-emerald-500 dark:border-l-emerald-500" onClick={() => navigate(`/detail/offer/${offer.id || i}`, { state: { data: offer } })}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded w-fit mb-1">
                                                    {offer.offerCode || offer.id || '—'}
                                                </span>
                                                <h4 className="font-bold text-slate-800 dark:text-white line-clamp-1">{offer.partnerName || '—'}</h4>
                                            </div>
                                            <StatusBadge status={offer.status === 'Onaylandı' ? 'success' : 'default'}>{offer.status || '—'}</StatusBadge>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-slate-800 mt-2">
                                            <span className="text-xs text-slate-400 font-bold uppercase">Tutar</span>
                                            <span className="text-lg font-black text-slate-900 dark:text-white text-right">
                                                {offer.ttlAmount != null ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: offer.currency || 'TRY' }).format(offer.ttlAmount) : '—'}
                                            </span>
                                        </div>
                                    </MobileCard>
                                ))}
                            </div>
                        ) : <EmptyState text="Teklif bulunamadı" />}
                    </div>
                );
            case 'urunler':
                return (
                    <div className="space-y-4 pb-20">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                                    <Blocks size={24} className="text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Ürünler</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Ürün yönetimi ve stok</p>
                                </div>
                            </div>
                        </div>

                        {products.length > 0 ? (
                            <div className="space-y-3">
                                {products.map((prod: any, i: number) => (
                                    <MobileCard key={prod.id || i} className="border-l-4 border-l-amber-500 dark:border-l-amber-500" onClick={() => navigate(`/detail/product/${prod.id || i}`, { state: { data: prod } })}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded w-fit mb-1">
                                                    {prod.code || '—'}
                                                </span>
                                                <h4 className="font-bold text-slate-800 dark:text-white line-clamp-1">{prod.name || '—'}</h4>
                                                <span className="text-xs text-slate-400">{prod.category || 'Genel'}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="block font-black text-slate-900 dark:text-white text-lg">
                                                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: prod.currency || 'TRY' }).format(prod.price || 0)}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">{prod.unit || 'Adet'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800 mt-2">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                <Package size={14} className="text-amber-500" />
                                                <span>Stok:</span>
                                                <span className={`${(prod.stock || 0) < 20 ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>
                                                    {prod.stock || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </MobileCard>
                                ))}
                            </div>
                        ) : <EmptyState text="Ürün bulunamadı" />}
                    </div>
                );
            case 'raporlar':
                return (
                    <div className="space-y-4 pb-20">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                    <FileBarChart size={24} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Raporlar</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Satış analizleri</p>
                                </div>
                            </div>
                        </div>

                        {reports ? (
                            <div className="space-y-4">
                                <MobileCard className="p-4 h-64">
                                    <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4 flex items-center gap-2">
                                        <BarChart3 size={16} className="text-purple-500" />
                                        Günlük Satışlar
                                    </h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={reports.dailySales || []}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                            <XAxis dataKey="date" hide />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Bar dataKey="amount" fill="#A855F7" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </MobileCard>

                                <MobileCard>
                                    <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                                        En Çok Satan Ürünler
                                    </h3>
                                    <div className="space-y-3">
                                        {(reports.topSellingProducts || []).map((prod: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center text-sm">
                                                <span className="text-slate-600 dark:text-slate-400 font-medium">{prod.name}</span>
                                                <span className="font-bold text-slate-800 dark:text-white text-right">
                                                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(prod.amount)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </MobileCard>
                            </div>
                        ) : <EmptyState text="Rapor verisi bulunamadı" />}
                    </div>
                );
            case 'dashboard':
            default:
                return (
                    <div className="space-y-4 pb-20">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                    <TrendingUp size={24} className="text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Özet</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Genel bakış</p>
                                </div>
                            </div>
                        </div>

                        {requests.length > 0 ? (
                            <div className="space-y-3">
                                {requests.slice(0, 5).map((req: any, i: number) => (
                                    <MobileCard key={req.id || i} className="border-l-4 border-l-blue-500 dark:border-l-blue-500" onClick={() => navigate(`/detail/request/${req.id || i}`, { state: { data: req } })}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded w-fit mb-1">
                                                    {req.requestNo || req.id || '—'}
                                                </span>
                                                <h4 className="font-bold text-slate-800 dark:text-white line-clamp-1">{req.partnerName || '—'}</h4>
                                            </div>
                                            <StatusBadge status={req.status === 'Onaylandı' ? 'success' : 'default'}>{req.status || '—'}</StatusBadge>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-slate-400 font-medium border-t border-slate-50 dark:border-slate-800 pt-2 mt-2">
                                            <span>Tarih:</span>
                                            <span className="text-slate-700 dark:text-slate-200">{req.requestDate ? new Date(req.requestDate).toLocaleDateString('tr-TR') : '—'}</span>
                                        </div>
                                    </MobileCard>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-slate-400 text-xs">Kayıt yok</div>
                        )}
                    </div>
                );
        }
    };

    return (
        <MobileContainer className="pb-0">
            {renderContent()}

            {/* Bottom Menu */}
            <div className="fixed bottom-0 left-0 w-full p-4 z-30 pointer-events-none">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 max-w-lg mx-auto pointer-events-auto">
                    <nav className="grid grid-cols-5 gap-1">
                        {salesMenu.map((m) => (
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

export default SalesDashboard;
