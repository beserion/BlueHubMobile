import { X, LayoutDashboard, ShoppingCart, TrendingUp, DollarSign, Truck, Users, Package, Briefcase, PieChart, Activity, LogOut, Anchor, Ship, Wrench } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    close: () => void;
}

const Sidebar = ({ isOpen, close }: SidebarProps) => {
    const { user, logout } = useAuth();

    const menu = [
        { path: '/general', label: 'Göstergeler', desc: 'Genel bakış', icon: LayoutDashboard },
        { path: '/projects', label: 'Projeler', desc: 'Yönetim ve takip', icon: Briefcase },
        { path: '/sales', label: 'Satış', desc: 'Teklif yönetimi', icon: TrendingUp },
        { path: '/purchasing', label: 'Satın Alma', desc: 'Sipariş takibi', icon: ShoppingCart },
        { path: '/inventory', label: 'Depolar', desc: 'Envanter durumu', icon: Package },
        { path: '/logistics', label: 'Lojistik', desc: 'Sevkiyat planı', icon: Truck },
        { path: '/finance', label: 'Finans', desc: 'Mali tablolar', icon: DollarSign },
        { path: '/hr', label: 'Personel', desc: 'İK yönetimi', icon: Users },
        { path: '/partners', label: 'Cariler', desc: 'Cari hesaplar', icon: PieChart },
        { path: '/services', label: 'Servisler', desc: 'Bakım onarım', icon: Wrench },
        { path: '/ships', label: 'Gemiler', desc: 'Filo yönetimi', icon: Ship },
        { path: '/vessel-visits', label: 'Gemi Ziyareti', desc: 'Operasyonlar', icon: Anchor },
        { path: '/todo', label: 'Yapılacaklar', desc: 'Görev listesi', icon: Activity },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={close}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`pt-4 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900/95 dark:bg-slate-950/90 backdrop-blur-xl text-slate-300 border-r border-white/5 transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}>

                {/* Mobile Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 lg:hidden">
                    <span className="font-black text-xl text-white tracking-tight flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Ship size={20} className="text-white" />
                        </div>
                        BlueHUB
                    </span>
                    <button onClick={close} className="p-2 text-slate-400 hover:text-white rounded-lg active:bg-white/5 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Desktop Logo */}
                <div className="hidden lg:flex h-20 items-center px-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Ship size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-black text-xl text-white tracking-tight leading-none">BlueHUB</h1>
                            <p className="text-[10px] uppercase tracking-widest text-sky-400 font-bold mt-0.5">Marine Systems</p>
                        </div>
                    </div>
                </div>

                {/* User Profile - Compact Glass Design */}
                <div className="p-4">
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/5 rounded-2xl p-4 flex items-center gap-3 shadow-inner">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 p-[2px]">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                                {user?.userName?.substring(0, 2).toUpperCase() || 'AD'}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user?.userName || 'Admin User'}</p>
                            <p className="text-xs text-slate-400 truncate">{user?.email || 'admin@bluehub.com'}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
                    <NavLink
                        to="/"
                        end
                        onClick={() => window.innerWidth < 1024 && close()}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 font-semibold'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <LayoutDashboard size={20} />
                        <span>Ana Menü</span>
                    </NavLink>

                    <div className="my-4 border-t border-white/5 mx-2"></div>
                    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Modüller</p>

                    {menu.filter(item => item.path !== '/' && item.path !== '/general').map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => window.innerWidth < 1024 && close()}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 font-semibold'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'} />
                                    <div className="flex-1">
                                        <span className="block leading-none">{item.label}</span>
                                        {/* <span className="text-[10px] opacity-60 font-normal mt-0.5 block">{item.desc}</span> */}
                                    </div>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
                    <button
                        onClick={logout}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 hover:text-rose-300 rounded-xl transition-all duration-200"
                    >
                        <LogOut size={18} />
                        <span>Güvenli Çıkış</span>
                    </button>
                    <p className="text-center text-[10px] text-slate-600 mt-3 font-medium">v2.0.4 • BlueHUB Systems</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
