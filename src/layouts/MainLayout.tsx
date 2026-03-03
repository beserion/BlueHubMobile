import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Mapping paths to titles
    const titles: { [key: string]: string } = {
        '/': 'Ana Menü',
        '/general': 'Göstergeler',
        '/purchasing': 'Satın Alma',
        '/sales': 'Satış Paneli',
        '/finance': 'Finansal Durum',
        '/logistics': 'Lojistik Operasyon',
        '/hr': 'İK & Personel',
        '/partners': 'Cariler',
        '/todo': 'Yapılacaklar',
        '/inventory': 'Depo Yönetimi',
        '/projects': 'Proje Paneli',
        '/services': 'Servisler',
        '/ships': 'Gemiler',
        '/vessel-visits': 'Gemi Ziyareti',
    };

    const currentTitle = titles[location.pathname] || 'Dashboard';

    return (
        <div className="flex   h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />
            <div className=" flex-1 flex flex-col h-screen overflow-hidden w-full relative z-10">
                <Header title={currentTitle} toggleSidebar={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto px-2 py-4 pt-24 lg:px-4 lg:py-6 lg:pt-24 scroll-smooth bg-transparent transition-colors duration-300">
                    <div className="max-w-[1600px] mx-auto min-h-full">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Global Animated Background */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 opacity-100 transition-colors duration-500" />
                {/* Orbs - Light mode uses softer colors */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen transition-all duration-500 animate-pulse-slow" />
                <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen transition-all duration-500 animate-pulse-slow animation-delay-2000" />
            </div>
        </div>
    );
};

export default MainLayout;
