import { UsersRound, CheckCircle2, UserPlus, Plane, Fingerprint, BarChart3 } from 'lucide-react';
import StatCard from '../components/StatCard';
import { hrNewHires } from '../data/mockData';

const HRDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Toplam Personel" value="6" color="primary" icon={UsersRound} />
                <StatCard title="Aktif Personel" value="5" color="success" icon={CheckCircle2} />
                <StatCard title="Bu Ay Gelen" value="1" color="info" icon={UserPlus} />
                <StatCard title="Bekleyen İzin" value="0" color="warning" icon={Plane} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-700 mb-4">Son İşe Alınanlar</h3>
                    <div className="space-y-3">
                        {hrNewHires.map((hire, index) => (
                            <div key={index} className="flex items-center p-2 hover:bg-slate-50 rounded">
                                <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs mr-3">{hire.initial}</div>
                                <div><p className="text-sm font-bold text-slate-800">{hire.name}</p><p className="text-xs text-slate-500">{hire.date}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-700 mb-4">Bekleyen İzin Talepleri</h3>
                    <div className="flex items-center justify-center h-40 text-slate-400 italic">Bekleyen izin talebi yok.</div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-700 mb-4">Hızlı İşlemler</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 border rounded-xl hover:bg-sky-50 hover:border-sky-200 transition-colors flex flex-col items-center gap-2 text-sky-700">
                        <UserPlus size={24} /><span className="text-sm font-medium">Personel Ekle</span>
                    </button>
                    <button className="p-4 border rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition-colors flex flex-col items-center gap-2 text-emerald-700">
                        <Plane size={24} /><span className="text-sm font-medium">İzin Talebi</span>
                    </button>
                    <button className="p-4 border rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex flex-col items-center gap-2 text-indigo-700">
                        <Fingerprint size={24} /><span className="text-sm font-medium">Puantaj</span>
                    </button>
                    <button className="p-4 border rounded-xl hover:bg-amber-50 hover:border-amber-200 transition-colors flex flex-col items-center gap-2 text-amber-700">
                        <BarChart3 size={24} /><span className="text-sm font-medium">Raporlar</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HRDashboard;
