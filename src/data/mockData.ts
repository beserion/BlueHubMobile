//{
//  "email": "admin@bluehub.com",
//  "userName": "Admin",
//  "password": "BlueHub1!"
//}

export const performanceData = [
    { name: 'Oca', views: 4000, clicks: 2400 }, { name: 'Şub', views: 3000, clicks: 1398 },
    { name: 'Mar', views: 2000, clicks: 9800 }, { name: 'Nis', views: 2780, clicks: 3908 },
    { name: 'May', views: 1890, clicks: 4800 }, { name: 'Haz', views: 2390, clicks: 3800 },
    { name: 'Tem', views: 3490, clicks: 4300 }, { name: 'Ağu', views: 3000, clicks: 1398 },
];

export const conversionData = [{ name: 'Returning', value: 65 }, { name: 'New', value: 35 }];

export const statusData = [{ name: 'Onaylanan', value: 45 }, { name: 'Bekleyen', value: 25 }, { name: 'İptal', value: 10 }];
export const invoiceData = [{ name: 'Oca', v: 45 }, { name: 'Şub', v: 52 }, { name: 'Mar', v: 38 }, { name: 'Nis', v: 65 }, { name: 'May', v: 48 }];

export const projectDashboard = {
    statusCounts: {
        draftCount: 2,
        approvedCount: 5,
        inProgressCount: 8,
        onHoldCount: 1,
        completedCount: 12,
        cancelledCount: 0,
        totalCount: 28
    }
};

export const generalDashboard = {
    cards: [
        {
            key: "totalOffers",
            label: "Toplam Teklif",
            value: 15,
            valueFormatted: "15",
            changePercent: 5,
            compareLabel: "Geçen aya göre",
            isPositiveGood: true
        },
        {
            key: "totalOrders",
            label: "Toplam Sipariş",
            value: 8,
            valueFormatted: "8",
            changePercent: -2,
            compareLabel: "Geçen aya göre",
            isPositiveGood: false
        },
        {
            key: "savedRevenue",
            label: "Kaydedilen Gelir",
            value: 450000,
            valueFormatted: "₺450.000",
            changePercent: 12,
            compareLabel: "Geçen aya göre",
            isPositiveGood: true
        },
        {
            key: "opportunities",
            label: "Fırsatlar",
            value: 24,
            valueFormatted: "24",
            changePercent: 0,
            compareLabel: "Geçen aya göre",
            isPositiveGood: true
        }
    ],
    updatedAt: new Date().toISOString()
};

export const cashFlow = [
    { name: 'Pzt', in: 4000, out: 2400 }, { name: 'Sal', in: 3000, out: 1398 }, { name: 'Çar', in: 2000, out: 9800 },
    { name: 'Per', in: 2780, out: 3908 }, { name: 'Cum', in: 1890, out: 4800 }
];

export const currencyTrendData = [
    { name: '1', v: 34.50 }, { name: '2', v: 34.52 }, { name: '3', v: 34.55 }, { name: '4', v: 34.54 },
    { name: '5', v: 34.58 }, { name: '6', v: 34.60 }, { name: '7', v: 34.62 }
];

export const purchasingOrders = [
    { id: 'PO-1023', supplier: 'Marine Parts Ltd', date: '29.10.2023', amount: '₺45,000', status: 'Onaylandı', statusColor: 'bg-green-100 text-green-700' },
    { id: 'PO-1024', supplier: 'Global Fuel', date: '30.10.2023', amount: '₺120,000', status: 'Bekliyor', statusColor: 'bg-amber-100 text-amber-700' },
    { id: 'PO-1025', supplier: 'Liman Hizmet', date: '31.10.2023', amount: '₺12,500', status: 'Onaylandı', statusColor: 'bg-green-100 text-green-700' },
];

export const salesWorkload = [
    { label: 'Bekleyen Talep', value: 4 },
    { label: 'Taslak Teklif', value: 7 },
    { label: 'Tedarikçi Beklenen', value: 5 },
    { label: 'Müşteri Beklenen', value: 3 },
];

export const salesRequests = [
    { type: 'Req', ref: 'REQ-1021', customer: 'ACME Corp', status: 'Pending', sla: '2h', color: 'text-amber-600' },
    { type: 'Quote', ref: 'Q-1005', customer: 'Marmara A.S.', status: 'Open', sla: '6h', color: 'text-sky-600' },
];

export const proposalStatus = [{ name: 'Açık', v: 22 }, { name: 'Alternatif', v: 9 }, { name: 'İptal', v: 2 }, { name: 'Süre Doldu', v: 1 }];

export const logisticsShipments = [
    { no: 'SHP26010002', origin: 'NOAES', dest: 'AUABP', eta: '22.01.2026', status: 'PLANNED', statusColor: 'bg-amber-100 text-amber-700' },
    { no: 'SHP26010001', origin: 'DKAAB', dest: 'DKAAL', eta: '22.01.2026', status: 'DRAFT', statusColor: 'bg-slate-100 text-slate-700' },
];

export const hrNewHires = [
    { initial: 'ED', name: 'Ezgi Dolanbay', date: '13.02.2026', role: '' },
    { initial: 'EP', name: 'Elif Perçin', date: 'Satın Alma • 20.01.2026', role: '' },
];
