import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, Files, ClipboardList, PieChart, ChevronDown, FolderOpen, Paperclip, Users, UserCheck, UserCog, Layers, CornerRightDown, Loader2, Calendar } from 'lucide-react';
import { SearchInput } from '../components/mobile/SearchInput';
import { getProjectList, getProjectDashboard, getTeamWorkStats, getProjectDocuments } from '../services/api';
import { useSignalREvent } from '../context/SignalRContext';
import { HubEvents } from '../services/signalr';
import { MobileContainer } from '../components/mobile/MobileContainer';
import { MobileCard } from '../components/mobile/MobileCard';
import { DataRow } from '../components/mobile/DataRow';
import { StatusBadge } from '../components/mobile/StatusBadge';

const ProjectPanel = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const activeTab = searchParams.get('tab') || 'Liste';
    const [searchQuery, setSearchQuery] = useState('');

    // API state
    const [projects, setProjects] = useState<any[]>([]);
    const [dashboard, setDashboard] = useState<any>(null);
    const [teamStats, setTeamStats] = useState<any>(null);
    const [documents, setDocuments] = useState<any>(null);
    const [selectedProject, setSelectedProject] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // SignalR: auto-refresh on real-time events
    const triggerRefresh = useCallback(() => setRefreshTrigger(prev => prev + 1), []);
    useSignalREvent(HubEvents.ProjectUpdated, triggerRefresh);

    const setActiveTab = (id: string) => {
        navigate(`?tab=${id}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (activeTab === 'Liste') {
                    const data = await getProjectList({ Kriter: searchQuery || undefined });
                    const arr = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
                    setProjects(arr);
                } else if (activeTab === 'Özet') {
                    const data = await getProjectDashboard();
                    setDashboard(data);
                } else if (activeTab === 'Dagilimlar') {
                    const data = await getTeamWorkStats();
                    setTeamStats(data);
                } else if (activeTab === 'Dokümanlar') {
                    let currentProjects = projects;
                    if (projects.length === 0) {
                        const pList = await getProjectList({});
                        const arr = Array.isArray(pList) ? pList : (pList?.items ?? pList?.data ?? []);
                        setProjects(arr);
                        currentProjects = arr;
                    }

                    let targetProjectId = selectedProject;
                    if (currentProjects.length > 0 && !targetProjectId) {
                        targetProjectId = currentProjects[0].id?.toString() || '0';
                        setSelectedProject(targetProjectId);
                    }

                    const docId = targetProjectId ? parseInt(targetProjectId) : 0;
                    if (docId !== 0) {
                        const data = await getProjectDocuments({ id: docId });
                        setDocuments(data);
                    }
                }
            } catch (err: any) {
                setError(err.message || 'Veri yüklenirken hata oluştu');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeTab, selectedProject, refreshTrigger]); // removed searchQuery to avoid loop, handle search separately

    const handleSearch = () => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const data = await getProjectList({ Kriter: searchQuery || undefined });
                const arr = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
                setProjects(arr);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    };

    const salesMenu = [
        { id: 'Liste', label: 'Liste', icon: List },
        { id: 'Dokümanlar', label: 'Dokümanlar', icon: Files },
        { id: 'Özet', label: 'Özet', icon: ClipboardList },
        { id: 'Dagilimlar', label: 'Dagilimlar', icon: PieChart },
    ];

    const LoadingState = () => (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            <span className="ml-2 text-slate-500">Yükleniyor...</span>
        </div>
    );

    const renderContent = () => {
        if (loading) return <LoadingState />;
        if (error) return <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center text-sm font-medium">{error}</div>;

        switch (activeTab) {
            case 'Liste':
                return (
                    <div className="space-y-4 pb-20">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                    <List size={24} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Liste</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Proje listesi ve detayları</p>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="w-full">
                                <SearchInput
                                    value={searchQuery}
                                    onChange={setSearchQuery}
                                    placeholder="Proje ara..."
                                    className="bg-transparent dark:bg-transparent border-slate-200 dark:border-slate-800 shadow-sm"
                                />
                            </div>
                        </div>

                        {projects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {projects.map((project: any) => (
                                    <MobileCard key={project.id} className="border-l-4 border-l-blue-500 dark:border-l-blue-500 relative overflow-hidden group" onClick={() => navigate(`/detail/project/${project.id}`, { state: { data: project } })}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded mb-1 inline-block">
                                                    {project.projectNo || `#${project.id}`}
                                                </span>
                                                <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{project.name || '—'}</h3>
                                            </div>
                                            <StatusBadge status={project.status === 'Aktif' ? 'success' : 'default'}>
                                                {project.status || '—'}
                                            </StatusBadge>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800 pb-2">
                                                <span className="text-slate-500 dark:text-slate-400">Müşteri</span>
                                                <span className="font-semibold text-slate-700 dark:text-slate-200 text-right truncate max-w-[150px]">{project.partnerName || '—'}</span>
                                            </div>
                                            {project.progressPercent != null && (
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-slate-400 font-bold uppercase">İlerleme</span>
                                                        <span className="font-bold text-blue-600 dark:text-blue-400">%{Math.round(project.progressPercent)}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${project.progressPercent}%` }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </MobileCard>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-400">
                                <List className="mx-auto mb-2 opacity-50" size={48} />
                                <p>Proje bulunamadı</p>
                            </div>
                        )}
                    </div>
                );
            case 'Özet':
                return (
                    <div className="space-y-4 pb-20">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                    <ClipboardList size={24} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Özet</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Durum bazlı proje sayıları</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { title: 'Taslak', value: dashboard?.statusCounts?.draftCount, color: 'text-slate-500' },
                                { title: 'Onaylandı', value: dashboard?.statusCounts?.approvedCount, color: 'text-emerald-500' },
                                { title: 'Devam Eden', value: dashboard?.statusCounts?.inProgressCount, color: 'text-blue-500' },
                                { title: 'Beklemede', value: dashboard?.statusCounts?.onHoldCount, color: 'text-amber-500' },
                                { title: 'Tamamlandı', value: dashboard?.statusCounts?.completedCount, color: 'text-purple-500' },
                                { title: 'İptal', value: dashboard?.statusCounts?.cancelledCount, color: 'text-red-500' },
                                { title: 'Toplam', value: dashboard?.statusCounts?.totalCount, color: 'text-slate-800 dark:text-white' },
                            ].map((stat, i) => (
                                <MobileCard key={i} className="flex flex-col items-center justify-center py-4">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.title}</span>
                                    <span className={`text-2xl font-black ${stat.color}`}>{stat.value ?? '—'}</span>
                                </MobileCard>
                            ))}
                        </div>
                    </div>
                );
            case 'Dagilimlar': {
                const teamByProject = teamStats?.teamByProject || [];
                const projectByEmployee = teamStats?.employeeProjectCount || [];
                const taskByStage = teamStats?.taskByPhase || [];
                const taskByAssignee = teamStats?.taskByAssignee || [];

                const renderStatList = (title: string, icon: any, data: any[], renderItem: (item: any) => React.ReactNode) => (
                    <MobileCard className="flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50 dark:border-slate-800">
                            {icon}
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm">{title}</h3>
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                            {data.length > 0 ? data.map(renderItem) : <div className="text-center py-4 text-slate-400 text-xs">Veri yok</div>}
                        </div>
                    </MobileCard>
                );

                return (
                    <div className="space-y-4 pb-20">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                                    <PieChart size={24} className="text-violet-600 dark:text-violet-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Dağılımlar</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">İstatistiksel raporlar</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {renderStatList(
                                "Projeye Göre Ekip",
                                <Users size={16} className="text-blue-500" />,
                                teamByProject,
                                (item: any) => (
                                    <div key={item.projectName} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs">
                                        <span className="font-medium truncate flex-1">{item.projectName}</span>
                                        <span className="font-bold text-blue-600 dark:text-blue-400 ml-2">{item.teamMemberCount}</span>
                                    </div>
                                )
                            )}
                            {renderStatList(
                                "Çalışana Göre Proje",
                                <UserCheck size={16} className="text-sky-500" />,
                                projectByEmployee,
                                (item: any) => (
                                    <div key={item.employeeName} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs">
                                        <span className="font-medium truncate flex-1">{item.employeeName}</span>
                                        <span className="font-bold text-sky-600 dark:text-sky-400 ml-2">{item.projectCount}</span>
                                    </div>
                                )
                            )}
                            {renderStatList(
                                "Aşamaya Göre Görev",
                                <Layers size={16} className="text-emerald-500" />,
                                taskByStage,
                                (item: any) => (
                                    <div key={item.phaseName + item.projectName} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs">
                                        <div className="flex flex-col truncate flex-1">
                                            <span className="font-medium truncate">{item.projectName}</span>
                                            <span className="text-[10px] text-slate-400">{item.phaseName}</span>
                                        </div>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400 ml-2">{item.taskCount}</span>
                                    </div>
                                )
                            )}
                            {renderStatList(
                                "Atanana Göre Görev",
                                <UserCog size={16} className="text-amber-500" />,
                                taskByAssignee,
                                (item: any) => (
                                    <div key={item.assigneeName} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs">
                                        <span className="font-medium truncate flex-1">{item.assigneeName}</span>
                                        <span className="font-bold text-amber-600 dark:text-amber-400 ml-2">{item.taskCount}</span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                );
            }
            case 'Dokümanlar':
                return (
                    <div className="space-y-4 pb-20">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                                    <Files size={24} className="text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Dokümanlar</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Proje dosyaları</p>
                                </div>
                            </div>
                        </div>
                        <MobileCard>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Proje Seç</label>
                            <div className="relative">
                                <select
                                    value={selectedProject || ''}
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                    className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg focus:ring-amber-500/20 block p-3 pr-10 outline-none"
                                >
                                    {projects.map((project: any) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name || `Proje #${project.id}`}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </MobileCard>

                        <div className="space-y-3">
                            {(documents?.attachments?.length > 0 || documents?.invoices?.length > 0 || documents?.vouchers?.length > 0) ? (
                                (documents.attachments || []).map((doc: any, i: number) => (
                                    <MobileCard key={i} className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 shadow-sm shrink-0">
                                                <Paperclip size={20} />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-semibold text-slate-700 dark:text-slate-200 truncate pr-2 text-sm">{doc.fileName || doc.description || 'Döküman'}</span>
                                                <span className="text-xs text-slate-400">{doc.createdDate ? new Date(doc.createdDate).toLocaleDateString('tr-TR') : '—'}</span>
                                            </div>
                                        </div>
                                        {doc.filePath && (
                                            <a href={doc.filePath} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                                                <FolderOpen size={18} />
                                            </a>
                                        )}
                                    </MobileCard>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-400">
                                    <FolderOpen className="mx-auto mb-2 opacity-50" size={48} />
                                    <p>Döküman bulunamadı</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <MobileContainer className="pb-0"> {/* Remove default pb-24 because we handle it inside tabs or with bottom menu */}
            {renderContent()}

            {/* Bottom Menu */}
            <div className="fixed bottom-0 left-0 w-full p-4 z-30 pointer-events-none">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 max-w-sm mx-auto pointer-events-auto">
                    <nav className="grid grid-cols-4 gap-1">
                        {salesMenu.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setActiveTab(m.id)}
                                className={`
                                    flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 group w-full
                                    ${activeTab === m.id
                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                        : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }
                                `}
                            >
                                <m.icon size={20} className="mb-1" />
                                <span className="text-[10px] font-bold text-center leading-tight">{m.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </MobileContainer>
    );
};

export default ProjectPanel;
