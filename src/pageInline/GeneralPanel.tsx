import { useState, useEffect, useCallback } from 'react';
import { Loader2, BarChart3, Users, FileText, ShoppingCart, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getOperationalSummary, getCustomersByChannel, getRevenueByChannel } from '../services/api';
import { useSignalREvent } from '../context/SignalRContext';
import { HubEvents } from '../services/signalr';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';

const GeneralPanel = () => {
    const [summary, setSummary] = useState<any>(null);
    const [customersByChannel, setCustomersByChannel] = useState<any[]>([]);
    const [revenueByChannel, setRevenueByChannel] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // SignalR: auto-refresh on real-time events
    const triggerRefresh = useCallback(() => setRefreshTrigger(prev => prev + 1), []);
    useSignalREvent(HubEvents.DashboardUpdated, triggerRefresh);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [sum, cust, rev] = await Promise.allSettled([
                    getOperationalSummary(),
                    getCustomersByChannel(),
                    getRevenueByChannel(),
                ]);
                if (sum.status === 'fulfilled') setSummary(sum.value);
                if (cust.status === 'fulfilled') {
                    const arr = Array.isArray(cust.value) ? cust.value : cust.value?.data || [];
                    setCustomersByChannel(arr);
                }
                if (rev.status === 'fulfilled') {
                    const arr = Array.isArray(rev.value) ? rev.value : rev.value?.data || [];
                    setRevenueByChannel(arr);
                }
            } catch (err: any) {
                setError(err.message || 'Veri yüklenirken hata oluştu');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [refreshTrigger]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                <span className="ml-3 text-slate-500">Genel veriler yükleniyor...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm">
                {error}
            </div>
        );
    }

    // KPI values
    const activeProjects = summary?.activeProjects ?? summary?.aktifProjeler ?? '—';
    const totalCustomers = summary?.totalCustomers ?? summary?.toplamMusteri ?? '—';
    const totalOffers = summary?.totalOffers ?? summary?.toplamTeklif ?? '—';
    const totalOrders = summary?.totalOrders ?? summary?.toplamSiparis ?? '—';

    return (
        <MobileContainer>
            {/* Header */}
            {/* Header Section */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                        <BarChart3 size={24} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Genel Panel</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Sistem operasyonel performansı</p>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MobileCard className="p-4 border-t-4 border-t-blue-500">
                    <div className="flex justify-between items-start mb-2">
                        <TrendingUp className="text-blue-500" size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Aktif Proje</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">{activeProjects}</p>
                </MobileCard>

                <MobileCard className="p-4 border-t-4 border-t-emerald-500">
                    <div className="flex justify-between items-start mb-2">
                        <Users className="text-emerald-500" size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Müşteri</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">{totalCustomers}</p>
                </MobileCard>

                <MobileCard className="p-4 border-t-4 border-t-amber-500">
                    <div className="flex justify-between items-start mb-2">
                        <FileText className="text-amber-500" size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Teklif</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">{totalOffers}</p>
                </MobileCard>

                <MobileCard className="p-4 border-t-4 border-t-purple-500">
                    <div className="flex justify-between items-start mb-2">
                        <ShoppingCart className="text-purple-500" size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Sipariş</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">{totalOrders}</p>
                </MobileCard>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distribution Card */}
                <MobileCard className="flex flex-col h-full">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-base">Kanal Dağılımı</h3>
                    </div>
                    <div className="flex-1">
                        {customersByChannel.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {customersByChannel.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <span className="text-xs font-bold text-slate-500 uppercase">{item.channelName || item.kanalAdi || 'Kanal'}</span>
                                        <span className="text-lg font-black text-slate-800 dark:text-white">{item.count ?? item.sayi ?? 0}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                                <Users size={32} className="opacity-20 mb-2" />
                                <p className="text-sm">Veri yok</p>
                            </div>
                        )}
                    </div>
                </MobileCard>

                {/* Performance Chart Card */}
                <MobileCard className="flex flex-col h-full">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-5 bg-emerald-500 rounded-full"></div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-base">Gelir Performansı</h3>
                    </div>
                    <div className="flex-1 min-h-[250px]">
                        {revenueByChannel.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={revenueByChannel}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                        itemStyle={{ color: '#0f172a' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#22c55e"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <TrendingUp size={32} className="opacity-20 mb-2" />
                                <p className="text-sm">Veri yok</p>
                            </div>
                        )}
                    </div>
                </MobileCard>
            </div>
        </MobileContainer>
    );
};

export default GeneralPanel;
