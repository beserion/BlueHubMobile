import { ArrowUp, ArrowDown, CheckCircle, FileText, Building2, Banknote } from 'lucide-react';
import { LineChart, Line, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import { cashFlow } from '../data/mockData';

const FinanceDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatCard title="Bugün Ödenecek" value="0,00" color="danger" icon={ArrowUp} />
                <StatCard title="Bugün Tahsilat" value="0,00" color="success" icon={ArrowDown} />
                <StatCard title="Bekleyen Onay" value="3" color="warning" icon={CheckCircle} />
                <StatCard title="Açık İşlem" value="5" color="info" icon={FileText} />
                <StatCard title="Banka Toplam" value="₺450K" color="primary" icon={Building2} />
                <StatCard title="Kasa Toplam" value="₺25K" color="secondary" icon={Banknote} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-700 mb-4">Bugünkü Plan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h6 className="text-xs font-bold text-rose-600 uppercase mb-2">Tedarikçi Ödemeleri</h6>
                            <div className="text-sm text-slate-500 italic">Kayıt yok</div>
                        </div>
                        <div>
                            <h6 className="text-xs font-bold text-emerald-600 uppercase mb-2">Müşteri Tahsilatları</h6>
                            <div className="text-sm text-slate-500 italic">Kayıt yok</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-700 mb-4">Nakit Akışı</h3>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={cashFlow}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" hide />
                                <Tooltip />
                                <Line type="monotone" dataKey="in" stroke="#22c55e" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="out" stroke="#ef4444" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-700 mb-4">Açık Finansal İşlemler</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Tür</th><th className="p-3">Belge</th><th className="p-3">Tarih</th><th className="p-3 text-end">Tutar</th><th className="p-3">Döviz</th><th className="p-3">Durum</th></tr></thead>
                        <tbody>
                            <tr><td colSpan={6} className="p-4 text-center text-slate-400 italic">Kayıt yok</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FinanceDashboard;
