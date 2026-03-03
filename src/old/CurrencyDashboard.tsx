import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { currencyTrendData } from '../data/mockData';

const CurrencyDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex border-b">
                    <button className="px-6 py-3 font-medium text-sky-600 border-b-2 border-sky-600 bg-sky-50">USD Trend</button>
                    <button className="px-6 py-3 font-medium text-slate-500 hover:bg-slate-50">Multi Trend</button>
                </div>
                <div className="p-6">
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={currencyTrendData}>
                                <defs>
                                    <linearGradient id="colorUsd" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Area type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} fill="url(#colorUsd)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrencyDashboard;
