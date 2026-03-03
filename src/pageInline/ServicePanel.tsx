import { useState, useEffect } from 'react';
import { Wrench, Loader2, Calendar, User, Ship } from 'lucide-react';
import { getServices } from '../services/api';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';
import { DataRow } from '../components/mobile/DataRow';
import { StatusBadge } from '../components/mobile/StatusBadge';

import { useNavigate } from 'react-router-dom';

const ServicePanel = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getServices();
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
            <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
            <span className="ml-2 text-slate-500">Yükleniyor...</span>
        </div>
    );

    return (
        <MobileContainer>
            {/* Header */}
            {/* Header Section */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                        <Wrench size={24} className="text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Servis Listesi </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Hizmet kayıtları ve operasyon</p>
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
                    <Wrench className="mx-auto mb-2 opacity-50" size={48} />
                    <p>Servis kaydı bulunamadı</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {data.map((service: any, i: number) => (
                        <MobileCard key={i} className="border-l-4 border-l-orange-500 dark:border-l-orange-500" onClick={() => navigate(`/detail/service/${service.id || i}`, { state: { data: service } })}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{service.serviceNo}</span>
                                    <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{service.subject}</h3>
                                </div>
                                <StatusBadge status={service.status === 'Tamamlandı' ? 'success' : service.status === 'Devam Ediyor' ? 'warning' : 'default'}>
                                    {service.status}
                                </StatusBadge>
                            </div>

                            <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
                                {service.description}
                            </div>

                            <div className="space-y-1">
                                <DataRow label="Tarih" value={service.date} icon={<Calendar size={14} className="text-orange-500" />} />
                                <DataRow label="Teknisyen" value={service.technician} icon={<User size={14} className="text-orange-500" />} />
                                <DataRow label="Gemi" value={service.vessel} icon={<Ship size={14} className="text-orange-500" />} />
                            </div>
                        </MobileCard>
                    ))}
                </div>
            )}
        </MobileContainer>
    );
};

export default ServicePanel;
