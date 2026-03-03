import { useState, useEffect } from 'react';
import { Ship, Loader2, Anchor, Navigation, Calendar, Box, Activity } from 'lucide-react';
import { getShips } from '../services/api';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';
import { DataRow } from '../components/mobile/DataRow';
import { StatusBadge } from '../components/mobile/StatusBadge';

import { useNavigate } from 'react-router-dom';

const ShipPanel = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getShips();
                setData(Array.isArray(result) ? result : result?.data || []);
            } catch (err: any) {
                setError(err.message || 'Veriler yüklenemedi');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const LoadingState = () => (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin h-8 w-8 text-sky-500" />
            <span className="ml-2 text-slate-500">Yükleniyor...</span>
        </div>
    );

    return (
        <MobileContainer>
            {/* Header */}
            {/* Header Section */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-sky-50 dark:bg-sky-900/20 rounded-xl">
                        <Ship size={24} className="text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Gemi Listesi</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Filo yönetimi ve durumları</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <LoadingState />
            ) : error ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center text-sm font-medium">
                    {error}
                </div>
            ) : data.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <Ship className="mx-auto mb-2 opacity-50" size={48} />
                    <p>Kayıtlı gemi bulunamadı</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data.map((ship: any, i: number) => (
                        <MobileCard key={i} className="border-l-4 border-l-sky-500 dark:border-l-sky-500 relative overflow-hidden" onClick={() => navigate(`/detail/ship/${ship.id || i}`, { state: { data: ship } })}>
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Anchor size={120} />
                            </div>

                            <div className="flex justify-between items-start mb-3 relative z-10">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${ship.status === 'Seyir Halinde' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                    ship.status === 'Limanda' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' :
                                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                    }`}>
                                    <Activity size={12} />
                                    {ship.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 relative z-10">{ship.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium relative z-10">{ship.type} • {ship.flag}</p>

                            <div className="space-y-1 relative z-10">
                                <DataRow label="IMO No" value={ship.imo} icon={<Navigation size={14} className="text-sky-500" />} />
                                <DataRow label="Yapım Yılı" value={ship.buildYear} icon={<Calendar size={14} className="text-sky-500" />} />
                                <DataRow label="Kapasite" value={ship.capacity} icon={<Box size={14} className="text-sky-500" />} />
                            </div>
                        </MobileCard>
                    ))}
                </div>
            )}
        </MobileContainer>
    );
};

export default ShipPanel;
