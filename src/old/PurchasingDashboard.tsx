import { FileText, Clock, AlertCircle, Building2, Layers, FileSpreadsheet, CreditCard } from 'lucide-react';
import { PieChart, Pie, Cell, Legend, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import { statusData, invoiceData, purchasingOrders } from '../data/mockData';

const PurchasingDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                <StatCard title="Siparişler" value="1,240" color="primary" icon={FileText} />
                <StatCard title="Bekleyen" value="45" color="warning" icon={Clock} />
                <StatCard title="Geciken" value="12" color="danger" icon={AlertCircle} />
                <StatCard title="Tedarikçi" value="1,075" color="success" icon={Building2} />
                <StatCard title="Gruplar" value="6" color="info" icon={Layers} />
                <StatCard title="Faturalar" value="128" color="purple" icon={FileSpreadsheet} />
                <StatCard title="Ödeme" value="₺10.6K" color="secondary" icon={CreditCard} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 h-[300px]">
                    <h3 className="font-bold text-slate-700 mb-4">Sipariş Durum Dağılımı</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                                <Cell fill="#22c55e" /><Cell fill="#eab308" /><Cell fill="#ef4444" />
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 h-[300px]">
                    <h3 className="font-bold text-slate-700 mb-4">Fatura Trendi</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={invoiceData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="v" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 font-bold">Son 5 Satın Alma Emri</div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr><th className="p-3">Sipariş No</th><th className="p-3">Tedarikçi</th><th className="p-3">Tarih</th><th className="p-3 text-end">Tutar</th><th className="p-3">Durum</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {purchasingOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="p-3 font-medium text-sky-600">{order.id}</td>
                                    <td className="p-3">{order.supplier}</td>
                                    <td className="p-3">{order.date}</td>
                                    <td className="p-3 text-end">{order.amount}</td>
                                    <td className="p-3"><span className={`${order.statusColor} px-2 py-1 rounded text-xs`}>{order.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PurchasingDashboard;
