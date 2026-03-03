import { Package, AlertCircle, DollarSign, Activity } from 'lucide-react';
import StatCard from '../components/StatCard';

const InventoryDashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Toplam Ürün" value="4,520" color="primary" icon={Package} isTrendUp={true} subValue="+120" />
            <StatCard title="Kritik Stok" value="15" color="danger" icon={AlertCircle} />
            <StatCard title="Depo Değeri" value="₺2.1M" color="success" icon={DollarSign} isTrendUp={true} subValue="+5%" />
            <StatCard title="Hareketli" value="850" color="warning" icon={Activity} />
        </div>
    );
};

export default InventoryDashboard;
