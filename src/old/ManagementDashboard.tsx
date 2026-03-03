import { Calculator } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const ManagementDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 h-[350px]">
                    <h3 className="font-bold text-slate-700 mb-4">Satış Kanalları Gelir</h3>
                    <div className="h-[280px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={[{ name: 'Direkt', v: 62 }, { name: 'Distribütör', v: 40 }, { name: 'Online', v: 18 }, { name: 'Diğer', v: 3 }]} innerRadius={60} outerRadius={100} dataKey="v">
                                    <Cell fill="#0ea5e9" /><Cell fill="#22c55e" /><Cell fill="#eab308" /><Cell fill="#ef4444" />
                                </Pie>
                                <Legend verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-700 mb-4">Salesman Prim Simülasyonu</h3>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div><label className="text-xs text-slate-500">Hedef (₺)</label><input type="number" className="w-full border rounded p-1 text-sm" defaultValue="1000000" readOnly /></div>
                        <div><label className="text-xs text-slate-500">Gerçekleşen</label><input type="number" className="w-full border rounded p-1 text-sm" defaultValue="1250000" readOnly /></div>
                        <div><label className="text-xs text-slate-500">Komisyon %</label><input type="number" className="w-full border rounded p-1 text-sm" defaultValue="1.5" readOnly /></div>
                        <div><label className="text-xs text-slate-500">Prim %</label><input type="number" className="w-full border rounded p-1 text-sm" defaultValue="3.0" readOnly /></div>
                    </div>
                    <button className="w-full btn bg-sky-50 text-sky-600 py-2 rounded mb-4 font-medium"><Calculator size={16} className="inline mr-2" />Hesapla</button>
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div className="p-2 border rounded"><div className="text-slate-500 text-xs">Komisyon</div><div className="font-bold">₺18.7K</div></div>
                        <div className="p-2 border rounded"><div className="text-slate-500 text-xs">Prim</div><div className="font-bold">₺7.5K</div></div>
                        <div className="p-2 border rounded bg-green-50 border-green-200"><div className="text-green-700 text-xs">Toplam</div><div className="font-bold text-green-700">₺26.2K</div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagementDashboard;
