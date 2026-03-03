import { CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { salesWorkload, salesRequests, proposalStatus } from '../data/mockData';

const SalesDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center"><CheckCircle2 className="mr-2 text-sky-500" size={20} /> Bugünkü İş Yükü</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {salesWorkload.map((item, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-slate-50">
                            <p className="text-slate-500 text-xs">{item.label}</p>
                            <p className="text-xl font-bold text-slate-800">{item.value}</p>
                        </div>
                    ))}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500"><tr><th className="p-2">Tip</th><th className="p-2">Ref</th><th className="p-2">Müşteri</th><th className="p-2">Durum</th><th className="p-2 text-end">SLA</th></tr></thead>
                        <tbody>
                            {salesRequests.map((req, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-2"><span className="badge bg-slate-100 px-2 py-0.5 rounded text-xs">{req.type}</span></td>
                                    <td className="p-2 font-medium">{req.ref}</td>
                                    <td className="p-2">{req.customer}</td>
                                    <td className="p-2"><span className={req.color}>{req.status}</span></td>
                                    <td className="p-2 text-end">{req.sla}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-700 mb-4">Teklif Durumları</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={proposalStatus}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Bar dataKey="v" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-700 mb-4">Performans</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1"><span>Dönüşüm Oranı</span><span className="font-bold">18.5%</span></div>
                            <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{ width: '18.5%' }}></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1"><span>Ort. Hazırlama</span><span className="font-bold">42 dk</span></div>
                            <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }}></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesDashboard;
