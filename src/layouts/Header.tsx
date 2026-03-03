import { Menu, Bell, Search, Sun, Moon, Signal } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
// import { useSignalR } from '../context/SignalRContext';

interface HeaderProps {
    title: string;
    toggleSidebar: () => void;
}

const Header = ({ title, toggleSidebar }: HeaderProps) => {
    const { theme, toggleTheme } = useTheme();
    // const { isConnected } = useSignalR();
    const location = useLocation();

    // Map paths to cleaner titles if needed, or use the prop
    const getPageTitle = () => {
        // If we really want to override the title based on logic, we can
        return title;
    };

    return (
        <header className="fixed top-0 right-0 left-0 lg:left-72 z-30 h-20 pt-[env(safe-area-inset-top)] px-4 lg:px-6 flex items-center justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-white/5 transition-all duration-300 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 shadow-sm shadow-slate-200/50 dark:shadow-none h-[calc(5rem+env(safe-area-inset-top))]">

            {/* Left: Mobile Menu & Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl lg:hidden transition-colors"
                >
                    <Menu size={24} />
                </button>

                <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                    {getPageTitle()}
                </h2>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 lg:gap-4">

                {/* Search Bar - Hidden on small mobile */}
                <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 w-64 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/50">
                    <Search size={18} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Ara..."
                        className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 dark:text-slate-200 placeholder-slate-400"
                    />
                </div>
                <button className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl">
                    <Search size={20} />
                </button>

                <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1"></div>

                {/* SignalR Status */}
                {/* SignalR Status - Temporarily disabled for debugging
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10" title={isConnected ? "Bağlı" : "Bağlantı Yok"}>
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {isConnected ? 'Canlı' : 'Offline'}
                    </span>
                </div>
                */}

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Notifications */}
                <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                </button>

            </div>
        </header>
    );
};

export default Header;
