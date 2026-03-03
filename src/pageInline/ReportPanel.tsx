import { useState, useEffect } from 'react';
import { BarChart3, Loader2, Calendar, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getIncomeStatement } from '../services/api';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';
import { DataRow } from '../components/mobile/DataRow';

const ReportPanel = () => {
    const [rawData, setRawData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params: any = {};
            if (startDate) params.startDate = new Date(startDate).toISOString();
            if (endDate) params.endDate = new Date(endDate).toISOString();
            const result = await getIncomeStatement(params);
            setRawData(result);
        } catch (err: any) {
            setError(err.message || 'Veriler yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Try to extract chart-friendly data
    const chartData = (() => {
        if (!rawData) return [];
        if (Array.isArray(rawData)) return rawData;
        if (rawData.data && Array.isArray(rawData.data)) return rawData.data;
        // If it's an object with key-value pairs, convert to chart data
        if (typeof rawData === 'object') {
            return Object.entries(rawData).map(([key, value]) => ({
                name: key,
                value: typeof value === 'number' ? value : 0,
            }));
        }
        return [];
    })();

    const LoadingState = () => (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin h-8 w-8 text-rose-500" />
            <span className="ml-2 text-slate-500">Rapor oluşturuluyor...</span>
        </div>
    );

    return (
        <MobileContainer>
            {/* Header */}
            {/* Header Section */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                        <BarChart3 size={24} className="text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Raporlar</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Finansal analiz ve gelir tablosu</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <MobileCard className="space-y-3 mb-4">
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
                <button onClick={fetchData} className="w-full py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors flex items-center justify-center gap-2">
                    <BarChart3 size={16} /> <span>Raporla</span>
                </button>
            </MobileCard>

            {/* Content */}
            {loading ? (
                <LoadingState />
            ) : error ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center text-sm font-medium">
                    {error}
                </div>
            ) : !rawData ? (
                <div className="text-center py-12 text-slate-400">
                    <BarChart3 className="mx-auto mb-2 opacity-50" size={48} />
                    <p>Veri bulunamadı</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Chart Card */}
                    <MobileCard className="p-4 h-80">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Finansal Görünüm</h3>
                        </div>
                        {chartData.length > 0 && (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                                        dy={10}
                                        height={60}
                                        angle={-45}
                                        textAnchor="end"
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                                        width={40}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <Bar dataKey="value" fill="#E11D48" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </MobileCard>

                    {/* Data Grid */}
                    {Array.isArray(chartData) && chartData.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {chartData.map((row: any, i: number) => (
                                <MobileCard key={i} className="border-l-4 border-l-rose-500 dark:border-l-rose-500">
                                    <div className="space-y-1">
                                        {Object.entries(row).map(([key, val]: [string, any], j: number) => (
                                            <DataRow
                                                key={j}
                                                label={key}
                                                value={val === null || val === undefined ? '—' : typeof val === 'number' ? val.toLocaleString('tr-TR') : String(val)}
                                            />
                                        ))}
                                    </div>
                                </MobileCard>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </MobileContainer>
    );
};

export default ReportPanel;
