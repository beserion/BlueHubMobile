import { Briefcase, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import StatCard from '../components/StatCard';
import { NavLink } from 'react-router-dom';

const ProjectDashboard = () => {
    const projectMenu = [
        { path: '/talepler', label: 'Talepler', icon: Briefcase },
        { path: '/talepler', label: 'Talepler', icon: Briefcase },
        { path: '/talepler', label: 'Talepler', icon: Briefcase },
        { path: '/talepler', label: 'Talepler', icon: Briefcase }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Aktif Proje" value="8" color="primary" icon={Briefcase} />
                <StatCard title="Tamamlanan" value="24" color="success" icon={CheckCircle} />
                <StatCard title="Geciken" value="1" color="warning" icon={AlertCircle} />
                <StatCard title="Bütçe" value="$5.2M" color="purple" icon={DollarSign} />
            </div>
            <div className="flex justify-start">
                <nav className="space-y-1">
                    {projectMenu.map(m => (
                        <NavLink
                            key={m.path}
                            to={m.path}
                            className={({ isActive }) => `
                    w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive
                                    ? 'bg-sky-600/10 text-sky-400 border border-sky-600/20 shadow-lg shadow-sky-900/20'
                                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                                }
                  `}
                        >
                            <m.icon size={18} />
                            <span>{m.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );

};

export default ProjectDashboard;
