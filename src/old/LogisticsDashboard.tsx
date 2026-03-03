import { Truck, AlertTriangle, Boxes, CalendarCheck, Bell, DollarSign, CheckCircle, Ship } from 'lucide-react';
import StatCard from '../components/StatCard';
import { logisticsShipments } from '../data/mockData';

const LogisticsDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatCard title="Bugünkü Sevkiyat" value="2" color="primary" icon={Truck} />
                <StatCard title="Geciken Yükler" value="0" color="danger" icon={AlertTriangle} />
                <StatCard title="Limandaki Yük" value="5" color="info" icon={Boxes} />
                <StatCard title="Ort. Teslim" value="14 Gün" color="success" icon={CalendarCheck} />
                <StatCard title="Uyarılar" value="0" color="warning" icon={Bell} />
                <StatCard title="Maliyet/Ton" value="$45" color="secondary" icon={DollarSign} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 h-full">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center"><Bell size={18} className="mr-2 text-amber-500" /> Son Uyarılar</h3>
                    <div className="flex items-center justify-center h-40 text-slate-400 italic">
                        <CheckCircle size={24} className="mr-2" /> Açık uyarı yok
                    </div>
                    <button className="w-full btn bg-amber-50 text-amber-600 py-2 rounded text-sm font-medium">Tüm Uyarılar</button>
                </div>
                <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center"><Ship size={18} className="mr-2 text-sky-500" /> Son Sevkiyatlar</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">No</th><th className="p-3">Çıkış</th><th className="p-3">Varış</th><th className="p-3">ETA</th><th className="p-3">Durum</th></tr></thead>
                            <tbody className="divide-y divide-slate-100">
                                {logisticsShipments.map(shipment => (
                                    <tr key={shipment.no} className="hover:bg-slate-50">
                                        <td className="p-3 font-medium">{shipment.no}</td>
                                        <td className="p-3">{shipment.origin}</td>
                                        <td className="p-3">{shipment.dest}</td>
                                        <td className="p-3">{shipment.eta}</td>
                                        <td className="p-3"><span className={`${shipment.statusColor} px-2 py-1 rounded text-xs`}>{shipment.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogisticsDashboard;
