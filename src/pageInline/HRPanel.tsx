import { useState, useEffect, useCallback } from 'react';
import { Users, FileText, CalendarOff, ClipboardList, Loader2, Briefcase, Phone, Mail, User, Clock3, Calendar } from 'lucide-react';
import { SearchInput } from '../components/mobile/SearchInput';
import { getEmployees, getContracts, getLeaves, getAttendanceReport } from '../services/api';
import { useSignalREvent } from '../context/SignalRContext';
import { HubEvents } from '../services/signalr';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';
import { DataRow } from '../components/mobile/DataRow';
import { StatusBadge } from '../components/mobile/StatusBadge';

const tabs = [
    { id: 'employees', label: 'Çalışanlar', icon: Users },
    { id: 'contracts', label: 'Sözleşmeler', icon: FileText },
    { id: 'leaves', label: 'İzinler', icon: CalendarOff },
    { id: 'attendance', label: 'Devam Durumu', icon: ClipboardList },
];

import { useNavigate } from 'react-router-dom';

const HRPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('employees');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // SignalR: auto-refresh on real-time events
    const triggerRefresh = useCallback(() => setRefreshTrigger(prev => prev + 1), []);
    useSignalREvent(HubEvents.HRUpdated, triggerRefresh);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                let result: any;
                switch (activeTab) {
                    case 'employees': result = await getEmployees(); break;
                    case 'contracts': result = await getContracts(); break;
                    case 'leaves': result = await getLeaves(); break;
                    case 'attendance': result = await getAttendanceReport(); break;
                }
                setData(Array.isArray(result) ? result : result?.data ? (Array.isArray(result.data) ? result.data : [result.data]) : []);
            } catch (err: any) {
                setError(err.message || 'Veriler yüklenemedi');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeTab, refreshTrigger]);

    const filteredData = data.filter((item: any) =>
        JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );

    const formatCurrency = (amount: number, currency: string = 'TRY') => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: currency }).format(amount);
    };

    const renderCardContent = (item: any) => {
        switch (activeTab) {
            case 'employees':
                return (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-lg border-2 border-white dark:border-slate-800 shadow-sm">
                                {item.name ? item.name.charAt(0) : <User size={20} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">{item.name}</h3>
                                <p className="text-xs text-rose-500 font-medium">{item.position || 'Pozisyon Yok'}</p>
                            </div>
                        </div>
                        <div className="space-y-1 pt-2 border-t border-slate-50 dark:border-slate-800">
                            <DataRow label="Departman" value={item.department || '—'} icon={<Briefcase size={14} className="text-rose-400" />} />
                            <DataRow label="Telefon" value={item.phone || '—'} icon={<Phone size={14} className="text-rose-400" />} />
                            <DataRow label="E-posta" value={item.email || '—'} icon={<Mail size={14} className="text-rose-400" />} />
                        </div>
                    </div>
                );
            case 'contracts':
                return (
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">{item.employee}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">{item.type}</p>
                            </div>
                            <StatusBadge status={item.status === 'Aktif' ? 'success' : 'default'}>
                                {item.status}
                            </StatusBadge>
                        </div>
                        <div className="space-y-1 pt-2 border-t border-slate-50 dark:border-slate-800">
                            <DataRow label="Başlangıç" value={item.startDate ? new Date(item.startDate).toLocaleDateString('tr-TR') : '—'} icon={<Calendar size={14} className="text-rose-400" />} />
                            <DataRow label="Maaş" value={formatCurrency(item.salary)} icon={<Briefcase size={14} className="text-rose-400" />} />
                        </div>
                    </div>
                );
            case 'leaves':
                return (
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">{item.employee}</h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">{item.type}</p>
                            </div>
                            <StatusBadge status={item.status === 'Onaylandı' ? 'success' : item.status === 'Bekliyor' ? 'warning' : 'error'}>
                                {item.status}
                            </StatusBadge>
                        </div>

                        <div className="p-2 bg-rose-50 dark:bg-rose-900/10 rounded-lg flex items-center justify-center gap-2 text-rose-700 dark:text-rose-300 text-sm font-medium">
                            <Clock3 size={16} />
                            <span>{item.days} Gün İzin</span>
                        </div>

                        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-800">
                            <span>{item.startDate ? new Date(item.startDate).toLocaleDateString('tr-TR') : '—'}</span>
                            <span className="text-slate-300">→</span>
                            <span>{item.endDate ? new Date(item.endDate).toLocaleDateString('tr-TR') : '—'}</span>
                        </div>
                    </div>
                );
            case 'attendance':
                return (
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">{item.employee}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">{item.date ? new Date(item.date).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }) : '—'}</p>
                            </div>
                            <StatusBadge status={item.status === 'Tam Gün' ? 'success' : item.status === 'Yarım Gün' ? 'warning' : 'error'}>
                                {item.status || 'Devamsız'}
                            </StatusBadge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-center">
                                <span className="text-[10px] text-slate-400 uppercase font-bold block">Giriş</span>
                                <span className="font-bold text-slate-700 dark:text-slate-200">{item.checkIn || '—'}</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-center">
                                <span className="text-[10px] text-slate-400 uppercase font-bold block">Çıkış</span>
                                <span className="font-bold text-slate-700 dark:text-slate-200">{item.checkOut || '—'}</span>
                            </div>
                        </div>
                        <DataRow label="Toplam Süre" value={`${item.hours || 0} Saat`} className="pt-2 border-t border-slate-50 dark:border-slate-800" />
                    </div>
                );
            default: return null;
        }
    }

    const LoadingState = () => (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin h-8 w-8 text-rose-500" />
            <span className="ml-2 text-slate-500">Yükleniyor...</span>
        </div>
    );

    return (
        <MobileContainer>
            {/* Header Section */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                        <Users size={24} className="text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Personel</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">İK ve Performans Yönetimi</p>
                    </div>
                </div>

                {/* Filter */}
                <div className="w-full">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Personel Ara..."
                        className="bg-transparent dark:bg-transparent border-slate-200 dark:border-slate-800 shadow-sm"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="sticky top-0 bg-transparent z-10 pb-0 w-full px-0 overflow-x-auto rounded-xl overflow-y-hidden">
                <div className="flex gap-3">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap border ${activeTab === t.id
                                ? 'bg-rose-600 text-white border-rose-600 shadow-md transform scale-105'
                                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                                }`}
                        >
                            <t.icon size={16} />
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <LoadingState />
            ) : error ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center text-sm font-medium">
                    {error}
                </div>
            ) : filteredData.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <Users className="mx-auto mb-2 opacity-50" size={48} />
                    <p>Kayıt bulunamadı</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredData.map((row: any, i: number) => (
                        <MobileCard key={i} className="border-l-4 border-l-rose-500 dark:border-l-rose-500" onClick={() => {
                            let type = 'employee';
                            if (activeTab === 'contracts') type = 'contract';
                            if (activeTab === 'leaves') type = 'leave';
                            if (activeTab === 'attendance') type = 'attendance';
                            navigate(`/detail/${type}/${row.id || i}`, { state: { data: row } });
                        }}>
                            {renderCardContent(row)}
                        </MobileCard>
                    ))}
                </div>
            )}
        </MobileContainer>
    );
};

export default HRPanel;
