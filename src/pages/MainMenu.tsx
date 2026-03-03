import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Activity, ArrowUpRight, Clock, DollarSign, LayoutDashboard, TrendingUp, Users, Loader2, FileText, Bell, Search, Menu, Filter, Calendar } from 'lucide-react';
import {
    getGeneralDashboard,
    getRequests,
    getRevenueByChannel,
    getLastInvoices
} from '../services/api';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';
import { StatusBadge } from '../components/mobile/StatusBadge';

// Helper for formatting currency
const formatCurrency = (amount: number, currency: string = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: currency }).format(amount);
}
const MainMenu = () => {
    const [stats, setStats] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [purchaseChartData, setPurchaseChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get current time for greeting
    const hour = new Date().getHours();
    let greeting = 'İyi Geceler';

    if (hour >= 5 && hour < 12) {
        greeting = 'Günaydın';
    } else if (hour >= 12 && hour < 18) {
        greeting = 'İyi Öğlenler';
    } else if (hour >= 18 && hour < 22) {
        greeting = 'İyi Akşamlar';
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. General Dashboard Stats
                try {
                    const dashboardRes = await getGeneralDashboard();
                    const dashboardData = dashboardRes?.data || dashboardRes;
                    let cards = [];
                    if (Array.isArray(dashboardData)) {
                        cards = dashboardData;
                    } else if (dashboardData?.cards && Array.isArray(dashboardData.cards)) {
                        cards = dashboardData.cards;
                    } else if (dashboardData?.items && Array.isArray(dashboardData.items)) {
                        cards = dashboardData.items;
                    }
                    setStats(cards || []);
                } catch (err) {
                    console.error("[MainMenu] Failed to load dashboard stats", err);
                }

                // 2. Recent Requests
                try {
                    const requestsRes = await getRequests({ startRow: 0, endRow: 10 });
                    const requestsData = requestsRes?.data || requestsRes || [];
                    const requestsList = Array.isArray(requestsData) ? requestsData : (requestsData.items || requestsData.requests || []);
                    const mappedRequests = requestsList.map((req: any) => ({
                        ...req,
                        requestNo: req.requestNo || req.trackingNumber || req.id,
                        partnerName: req.partnerName || req.customerName || req.responsibleUser || 'Cari Bilgisi Yok'
                    }));
                    setRequests(mappedRequests);
                } catch (err) {
                    console.error("[MainMenu] Failed to load requests", err);
                }

                // 3. Revenue Data
                try {
                    const revenueRes = await getRevenueByChannel();
                    const revenueData = revenueRes?.data || revenueRes || [];
                    const rawList = Array.isArray(revenueData) ? revenueData : [];
                    const chartData = rawList.map((item: any) => ({
                        name: item.channel || item.name || 'Diğer',
                        amount: item.revenue || item.amount || item.value || 0
                    }));
                    setRevenueData(chartData);
                } catch (err) {
                    console.error("[MainMenu] Failed to load revenue data", err);
                }

                // 4. Purchase/Invoice Data
                try {
                    const lastInvoicesRes = await getLastInvoices();
                    const invoicesData = lastInvoicesRes?.data || lastInvoicesRes;
                    const invoiceList = Array.isArray(invoicesData) ? invoicesData : (invoicesData?.items || []);
                    const monthlyMap = new Map<string, number>();
                    for (let i = 5; i >= 0; i--) {
                        const d = new Date();
                        d.setMonth(d.getMonth() - i);
                        const key = d.toLocaleString('tr-TR', { month: 'short' });
                        monthlyMap.set(key, 0);
                    }
                    invoiceList.forEach((inv: any) => {
                        if (inv.issueDate) {
                            const d = new Date(inv.issueDate);
                            const key = d.toLocaleString('tr-TR', { month: 'short' });
                            if (monthlyMap.has(key)) {
                                monthlyMap.set(key, (monthlyMap.get(key) || 0) + (inv.gnlTotal || inv.amount || 0));
                            }
                        }
                    });
                    const chartData = Array.from(monthlyMap.entries()).map(([name, value]) => ({ name, amount: value }));
                    setPurchaseChartData(chartData);
                } catch (err) {
                    console.error("[MainMenu] Failed to load invoice data", err);
                }

            } catch (error: any) {
                console.error("[MainMenu] Global Error", error);
                setError("Veriler yüklenirken bir hata oluştu: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getTrendColor = (percent: number, isPositiveGood: boolean) => {
        if (percent === 0) return 'text-slate-500 dark:text-slate-400';
        const isPositive = percent > 0;
        if (isPositiveGood) {
            return isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
        } else {
            return isPositive ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400';
        }
    };

    const renderTrend = (stat: any) => {
        const colorClass = getTrendColor(stat.changePercent, stat.isPositiveGood);
        const icon = stat.changePercent === 0 ? null : <TrendingUp className={`w-3 h-3 mr-1 ${stat.changePercent < 0 ? 'rotate-180' : ''}`} />;
        const sign = stat.changePercent > 0 ? '+' : '';
        return (
            <div className="mt-2 flex items-center text-xs">
                <span className={`${colorClass} flex items-center font-bold bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded`}>
                    {icon}
                    {stat.changePercent !== 0 ? `${sign}${stat.changePercent}%` : '—'}
                </span>
                <span className="text-slate-500 dark:text-slate-400 ml-2 font-medium">{stat.compareLabel || 'Geçen aya göre'}</span>
            </div>
        );
    };

    const getIconForKey = (key: string) => {
        const k = key?.toLowerCase() || '';
        if (k.includes('offer') || k.includes('teklif') || k.includes('project')) return <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
        if (k.includes('order') || k.includes('sipariş')) return <Clock className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
        if (k.includes('revenue') || k.includes('income') || k.includes('ciro') || k.includes('gelir')) return <DollarSign className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />;
        if (k.includes('staff') || k.includes('users') || k.includes('opportunit') || k.includes('fırsat')) return <Activity className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
        return <Activity className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
    };

    const getGradientForKey = (key: string) => {
        const k = key?.toLowerCase() || '';
        // Light mode: Subtle gradients, Dark mode: Deep gradients
        if (k.includes('offer') || k.includes('teklif')) return 'from-blue-50 to-blue-100/50 border-blue-200 dark:from-blue-500/20 dark:to-blue-600/5 dark:border-blue-500/20';
        if (k.includes('order') || k.includes('sipariş')) return 'from-amber-50 to-amber-100/50 border-amber-200 dark:from-amber-500/20 dark:to-amber-600/5 dark:border-amber-500/20';
        if (k.includes('revenue') || k.includes('income')) return 'from-emerald-50 to-emerald-100/50 border-emerald-200 dark:from-emerald-500/20 dark:to-emerald-600/5 dark:border-emerald-500/20';
        if (k.includes('staff') || k.includes('users')) return 'from-indigo-50 to-indigo-100/50 border-indigo-200 dark:from-indigo-500/20 dark:to-indigo-600/5 dark:border-indigo-500/20';
        return 'from-slate-50 to-slate-100/50 border-slate-200 dark:from-slate-700/50 dark:to-slate-800/10 dark:border-slate-700';
    };

    const getStatusType = (status: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
        if (!status) return 'default';
        const s = status.toLowerCase();
        if (s.includes('bekle') || s.includes('pending')) return 'warning';
        if (s.includes('onay') || s.includes('approv') || s.includes('open')) return 'success';
        if (s.includes('red') || s.includes('reject') || s.includes('cancel')) return 'error';
        return 'default';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 absolute inset-0 z-50">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-500 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full relative pb-20">
            <MobileContainer className="relative z-10 space-y-6">

                {/* Greeting Header */}
                <div className="flex items-center justify-between py-2">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Admin</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 flex items-center gap-2">
                            <Calendar size={14} className="text-blue-600 dark:text-blue-500" />
                            {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="p-1 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 flex">
                            <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-lg shadow-blue-500/20 transition-all">Genel Bakış</button>
                            <button className="px-4 py-2 rounded-lg text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors">Analizler</button>
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.key || index}
                            className={`relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br ${getGradientForKey(stat.key)} border backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-blue-500/10 group`}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 text-slate-900 dark:text-white">
                                {getIconForKey(stat.key)}
                            </div>

                            <div className="flex flex-col h-full justify-between relative z-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-inner">
                                            {getIconForKey(stat.key)}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider text-[10px]">{stat.label}</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{stat.valueFormatted || stat.value}</h3>
                                </div>
                                {renderTrend(stat)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 rounded-3xl p-[1px] bg-gradient-to-b from-white to-slate-50 dark:from-slate-700/50 dark:to-slate-800/20 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-blue-500/10">
                        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl h-full rounded-[23px] p-6 border border-white/40 dark:border-transparent">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <TrendingUp className="text-emerald-600 dark:text-emerald-500" size={20} />
                                        Gelir Analizi
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">Son 6 aylık gelir dağılımı</p>
                                </div>
                                <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors">
                                    <Filter size={16} />
                                </button>
                            </div>

                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(0,0,0,0.05)',
                                                backdropFilter: 'blur(8px)',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                            }}
                                            itemStyle={{ color: '#0f172a' }}
                                            formatter={(value: any) => formatCurrency(value)}
                                        />
                                        <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Quick Activity / Expenses */}
                    <div className="rounded-3xl p-[1px] bg-gradient-to-b from-white to-slate-50 dark:from-slate-700/50 dark:to-slate-800/20 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-blue-500/10">
                        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl h-full rounded-[23px] p-6 flex flex-col border border-white/40 dark:border-transparent">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <LayoutDashboard className="text-blue-600 dark:text-blue-500" size={20} />
                                        Giderler
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">Departman bazlı harcamalar</p>
                                </div>
                            </div>

                            <div className="flex-1 min-h-[250px] relative">
                                <div className="absolute inset-x-0 bottom-0 top-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={purchaseChartData}>
                                            <Tooltip
                                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                    borderRadius: '12px',
                                                    border: '1px solid rgba(0,0,0,0.05)',
                                                    backdropFilter: 'blur(8px)',
                                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                }}
                                                itemStyle={{ color: '#0f172a' }}
                                                formatter={(value: any) => formatCurrency(value)}
                                            />
                                            <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32}>
                                                {
                                                    purchaseChartData.map((entry, index) => (
                                                        <cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                                                    ))
                                                }
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions List */}
                <div className="rounded-3xl p-[1px] bg-gradient-to-b from-white to-slate-50 dark:from-slate-700/50 dark:to-slate-800/20 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-blue-500/10">
                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl h-full rounded-[23px] p-0 border border-white/40 dark:border-transparent">
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                <Activity className="text-violet-600 dark:text-violet-500" size={20} />
                                Son İşlemler
                            </h3>
                            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                                Tümünü Gör
                            </button>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            {requests.map((item: any, i: number) => (
                                <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <FileText size={18} className="text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                                                {item.requestNo}
                                            </h4>
                                            <span className="text-[10px] text-slate-500">
                                                {item.requestDate ? new Date(item.requestDate).toLocaleDateString() : ''}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[60%]">{item.partnerName}</p>
                                            <StatusBadge status={getStatusType(item.statusName || item.status)}>
                                                {item.statusName || item.status}
                                            </StatusBadge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {requests.length === 0 && (
                                <div className="p-10 text-center text-slate-500">Henüz işlem bulunmuyor.</div>
                            )}
                        </div>
                    </div>
                </div>

            </MobileContainer>
        </div>
    );
};

export default MainMenu;
