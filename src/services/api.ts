// ============================================================
// BlueHUB — Centralized API Service Layer
// ============================================================
// ⚡ Toggle: set USE_MOCK = false to use real API
const USE_MOCK = true;

import type {
    LoginRequest,
    FinOperationalDashboardFilterDto,
    OfferViewParams,
    RequestViewParams,
    ProjectListParams,
    ProjectDocumentsParams,
    DashboardQueryParams,
    CustomersByChannelParams,
    QuotesByCustomerParams,
    SalesmanBonusParams,
    DeliveryViewParams,
    InvoiceViewParams,
    PaymentViewParams,
    VesselVisitViewParams,
    VoucherViewParams,
    OrderListParams,
    TodoViewParams,
    AttendanceListParams,
    AttendanceReportParams,
    IncomeStatementParams,
    PartnerBalanceParams,
    GeneralDashboardDto,
} from '../types/api';

const BASE_URL = 'http://149.34.201.35:84'; // Hardcoded for APK build

// ── Helpers ────────────────────────────────────────────────

function getToken(): string | null {
    return localStorage.getItem('auth_token');
}

function authHeaders(): Record<string, string> {
    const token = getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
}

function toQuery(params?: Record<string, any>): string {
    if (!params) return '';
    const qs = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
    return qs ? `?${qs}` : '';
}

async function handleResponse(res: Response) {
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `HTTP ${res.status}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

async function apiGet(path: string, params?: Record<string, any>) {
    const res = await fetch(`${BASE_URL}${path}${toQuery(params)}`, {
        method: 'GET',
        headers: authHeaders(),
    });
    return handleResponse(res);
}

async function apiPost(path: string, body?: any) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: authHeaders(),
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse(res);
}

// Simulate network delay for mock
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

// ============================================================
// ── MOCK DATA ──────────────────────────────────────────────
// ============================================================

// ============================================================
// ── MOCK DATA GENERATORS ──────────────────────────────────
// ============================================================

const generateMockItems = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: i + 1,
        productName: ['Gemi Boyası', 'Hidrolik Yağ', 'Filtre Seti', 'Çelik Halat', 'Seyir Feneri'][i % 5],
        quantity: Math.floor(Math.random() * 50) + 1,
        unit: ['Litre', 'Varil', 'Adet', 'Metre', 'Kutu'][i % 5],
        price: (Math.random() * 1000).toFixed(2),
        totalPrice: (Math.random() * 5000).toFixed(2)
    }));
};

const MOCK = {
    user: { id: 1, email: 'admin@bluehub.com', userName: 'admin', fullName: 'Ahmet Yılmaz', role: 'Admin' },

    operationalSummary: {
        totalRevenue: 2450000,
        totalExpense: 1830000,
        netProfit: 620000,
        activeProjects: 12,
        pendingOrders: 34,
        totalCustomers: 156,
        conversionRate: 68.5,
        monthlyGrowth: 12.3,
    },

    notifications: [
        { id: 1, type: 'order', title: 'Yeni sipariş alındı', message: 'Sipariş #1042 — Mediterranean Star', date: '2026-02-15T10:30:00', read: false },
        { id: 2, type: 'payment', title: 'Ödeme onaylandı', message: '₺45.000 ödeme — Deniz Lojistik', date: '2026-02-15T09:15:00', read: false },
        { id: 3, type: 'delivery', title: 'Teslimat tamamlandı', message: 'Teslimat #887 — İstanbul Limanı', date: '2026-02-14T16:45:00', read: true },
        { id: 4, type: 'project', title: 'Proje güncellendi', message: 'Blue Horizon — Faz 2 tamamlandı', date: '2026-02-14T14:20:00', read: true },
        { id: 5, type: 'hr', title: 'İzin talebi', message: 'Mehmet Kaya — 3 günlük izin', date: '2026-02-14T11:00:00', read: true },
    ],

    conversions: [
        { month: 'Eylül', teklif: 45, siparis: 28 },
        { month: 'Ekim', teklif: 52, siparis: 35 },
        { month: 'Kasım', teklif: 48, siparis: 30 },
        { month: 'Aralık', teklif: 60, siparis: 42 },
        { month: 'Ocak', teklif: 55, siparis: 38 },
        { month: 'Şubat', teklif: 42, siparis: 29 },
    ],

    purchaseChart: [
        { month: 'Eylül', tutar: 320000 },
        { month: 'Ekim', tutar: 410000 },
        { month: 'Kasım', tutar: 380000 },
        { month: 'Aralık', tutar: 520000 },
        { month: 'Ocak', tutar: 470000 },
        { month: 'Şubat', tutar: 390000 },
    ],

    customersByChannel: [
        { channel: 'Doğrudan', channelName: 'Doğrudan', count: 45 },
        { channel: 'Acente', channelName: 'Acente', count: 38 },
        { channel: 'Online', channelName: 'Online', count: 32 },
        { channel: 'Referans', channelName: 'Referans', count: 25 },
        { channel: 'Fuar', channelName: 'Fuar', count: 16 },
    ],

    revenueByChannel: [
        { channel: 'Doğrudan', name: 'Doğrudan', revenue: 890000 },
        { channel: 'Acente', name: 'Acente', revenue: 650000 },
        { channel: 'Online', name: 'Online', revenue: 420000 },
        { channel: 'Referans', name: 'Referans', revenue: 310000 },
        { channel: 'Fuar', name: 'Fuar', revenue: 180000 },
    ],

    purchaseSummary: {
        totalOrders: 128,
        pendingOrders: 23,
        totalAmount: 2890000,
        monthlyAvg: 481666,
    },

    lastInvoices: [
        { id: 1, invoiceNo: 'FTR-2026-1042', partner: 'Deniz Tedarik A.Ş.', amount: 45200, currency: 'TRY', date: '2026-02-14', status: 'Ödendi' },
        { id: 2, invoiceNo: 'FTR-2026-1041', partner: 'Marine Parts Ltd.', amount: 12800, currency: 'USD', date: '2026-02-13', status: 'Beklemede' },
        { id: 3, invoiceNo: 'FTR-2026-1040', partner: 'Akdeniz Lojistik', amount: 78500, currency: 'TRY', date: '2026-02-12', status: 'Ödendi' },
        { id: 4, invoiceNo: 'FTR-2026-1039', partner: 'Global Shipping Co.', amount: 23400, currency: 'EUR', date: '2026-02-11', status: 'Gecikmiş' },
        { id: 5, invoiceNo: 'FTR-2026-1038', partner: 'Boğaziçi Tersane', amount: 156000, currency: 'TRY', date: '2026-02-10', status: 'Ödendi' },
    ],

    topSuppliers: [
        { id: 1, name: 'Deniz Tedarik A.Ş.', totalOrders: 34, totalAmount: 890000, rating: 4.8 },
        { id: 2, name: 'Marine Parts Ltd.', totalOrders: 28, totalAmount: 650000, rating: 4.5 },
        { id: 3, name: 'Global Shipping Co.', totalOrders: 22, totalAmount: 520000, rating: 4.6 },
        { id: 4, name: 'Akdeniz Lojistik', totalOrders: 19, totalAmount: 410000, rating: 4.3 },
        { id: 5, name: 'Boğaziçi Tersane', totalOrders: 15, totalAmount: 380000, rating: 4.7 },
    ],



    requests: [
        {
            id: 1, trackingNumber: 'TLP-2026-001', title: 'Yedek Parça Talebi', status: 'Açık', date: '2026-02-15', responsibleUser: 'Mehmet K.', currency: 'TRY', amount: 25400,
            partnerName: 'AAI GEMICILIK LTD STI', vesselName: 'RAFFLES PROSPERITY', refNo: 'ERD-0001', requestDate: '2026-02-18', validityDate: '2026-02-25', purchaseCurrency: 'TRY', requestNo: '20267172-816', description: 'TEST ERDAL'
        },
        {
            id: 2, trackingNumber: 'TLP-2026-002', title: 'Boya Malzemesi', status: 'İşlemde', date: '2026-02-14', responsibleUser: 'Ayşe Y.', currency: 'USD', amount: 8900,
            partnerName: 'DENIZ TEDARIK A.S.', vesselName: 'AL UDEID', refNo: 'BOYA-002', requestDate: '2026-02-14', validityDate: '2026-02-21', purchaseCurrency: 'USD', requestNo: '20267173-900', description: 'Acil boya ihtiyacı'
        },
        {
            id: 3, trackingNumber: 'TLP-2026-003', title: 'Motor Parçası', status: 'Tamamlandı', date: '2026-02-13', responsibleUser: 'Ali D.', currency: 'EUR', amount: 34500,
            partnerName: 'MOTOR PARCA LTD', vesselName: 'ANIKA', refNo: 'MTR-003', requestDate: '2026-02-13', validityDate: '2026-02-20', purchaseCurrency: 'EUR', requestNo: '20267174-101', description: 'Main engine parts'
        },
        { id: 4, trackingNumber: 'TLP-2026-004', title: 'Elektrik Malzemesi', status: 'Açık', date: '2026-02-12', responsibleUser: 'Fatma S.', currency: 'TRY', amount: 12300 },
        { id: 5, trackingNumber: 'TLP-2026-005', title: 'Güverte Ekipmanı', status: 'İşlemde', date: '2026-02-11', responsibleUser: 'Mehmet K.', currency: 'USD', amount: 67800 },
        { id: 6, trackingNumber: 'TLP-2026-006', title: 'Navigasyon Cihazı', status: 'Açık', date: '2026-02-10', responsibleUser: 'Can B.', currency: 'EUR', amount: 15600 },
    ],

    offers: [
        {
            id: 1, offerNo: 'TKL-2026-101', customer: 'Mediterranean Star', subject: 'Yedek Parça Seti', amount: 45000, currency: 'USD', status: 'Beklemede', date: '2026-02-15',
            offerDate: '2026-02-16', revisionNo: '0', company: 'ARK SHIP SUPPLY', customerRef: 'REF-101', validityDays: 30, deliveryPlace: 'Istanbul', deliveryTime: '2026-03-01', deliveryType: 'Kargo', paymentTerms: '30 DAYS', preparedBy: 'Ali Demir', portFee: 100, customFee: 50, transportation: 200, note: 'Urgent delivery'
        },
        {
            id: 2, offerNo: 'TKL-2026-102', customer: 'Blue Horizon Ltd.', subject: 'Motor Bakım Paketi', amount: 128000, currency: 'EUR', status: 'Onaylandı', date: '2026-02-14',
            offerDate: '2026-02-14', revisionNo: '1', company: 'FENERBAHCE MARIN', customerRef: 'REF-102', validityDays: 15, deliveryPlace: 'Izmir', deliveryTime: '2026-03-05', deliveryType: 'Firma Kendisi Alacak', paymentTerms: 'Prepayment', preparedBy: 'Ayşe Yılmaz', portFee: 150, customFee: 75, transportation: 0, note: 'Confirmed'
        },
        { id: 3, offerNo: 'TKL-2026-103', customer: 'Anatolian Cargo', subject: 'Güverte Donanım', amount: 67500, currency: 'TRY', status: 'Reddedildi', date: '2026-02-13' },
        { id: 4, offerNo: 'TKL-2026-104', customer: 'Aegean Express', subject: 'Elektrik Tesisatı', amount: 89200, currency: 'USD', status: 'Beklemede', date: '2026-02-12' },
        { id: 5, offerNo: 'TKL-2026-105', customer: 'Black Sea Lines', subject: 'Boya ve Kaplama', amount: 34800, currency: 'TRY', status: 'Onaylandı', date: '2026-02-11' },
    ],

    financeDashboard: {
        totalIncome: 3250000,
        totalExpense: 2180000,
        netProfit: 1070000,
        cashBalance: 890000,
        receivables: 1450000,
        payables: 980000,
        incomeByMonth: [
            { month: 'Eylül', income: 480000, expense: 320000 },
            { month: 'Ekim', income: 560000, expense: 380000 },
            { month: 'Kasım', income: 520000, expense: 350000 },
            { month: 'Aralık', income: 630000, expense: 420000 },
            { month: 'Ocak', income: 580000, expense: 390000 },
            { month: 'Şubat', income: 480000, expense: 320000 },
        ],
        expenseBreakdown: [
            { category: 'Personel', amount: 720000 },
            { category: 'Malzeme', amount: 580000 },
            { category: 'Lojistik', amount: 340000 },
            { category: 'Genel Gider', amount: 280000 },
            { category: 'Diğer', amount: 260000 },
        ],
    },

    projects: [
        { id: 1, name: 'Blue Horizon Bakım', customer: 'Blue Horizon Ltd.', status: 'Devam Ediyor', progress: 72, startDate: '2026-01-10', endDate: '2026-03-15', budget: 450000, spent: 324000 },
        { id: 2, name: 'Mediterranean Star Onarım', customer: 'Med Star Shipping', status: 'Devam Ediyor', progress: 45, startDate: '2026-01-20', endDate: '2026-04-30', budget: 680000, spent: 306000 },
        { id: 3, name: 'Aegean Express Motor', customer: 'Aegean Express Co.', status: 'Tamamlandı', progress: 100, startDate: '2025-11-01', endDate: '2026-01-31', budget: 320000, spent: 298000 },
        { id: 4, name: 'Black Sea Dönüşüm', customer: 'Black Sea Lines', status: 'Planlama', progress: 15, startDate: '2026-03-01', endDate: '2026-08-30', budget: 1200000, spent: 45000 },
        { id: 5, name: 'Anatolian Cargo Yenileme', customer: 'Anatolian Cargo', status: 'Devam Ediyor', progress: 88, startDate: '2025-12-01', endDate: '2026-02-28', budget: 560000, spent: 492800 },
    ],

    projectDashboard: {
        statusCounts: {
            draftCount: 2,
            approvedCount: 5,
            inProgressCount: 12,
            onHoldCount: 3,
            completedCount: 8,
            cancelledCount: 1,
            totalCount: 31
        },
        activeProjects: 12,
        completedProjects: 8,
        totalBudget: 3210000,
        totalSpent: 1465800,
    },



    teamWorkStats: {
        teamByProject: [
            { projectName: 'Blue Horizon Bakım', teamMemberCount: 12 },
            { projectName: 'Mediterranean Star Onarım', teamMemberCount: 8 },
            { projectName: 'Aegean Express Motor', teamMemberCount: 15 },
            { projectName: 'Anatolian Cargo Yenileme', teamMemberCount: 10 },
        ],
        employeeProjectCount: [
            { employeeName: 'Mehmet Kaya', projectCount: 5 },
            { employeeName: 'Ayşe Yılmaz', projectCount: 3 },
            { employeeName: 'Ali Demir', projectCount: 4 },
            { employeeName: 'Fatma Şahin', projectCount: 2 },
            { employeeName: 'Can Bulut', projectCount: 6 },
        ],
        taskByPhase: [
            { projectName: 'Blue Horizon Bakım', phaseName: 'Planlama', taskCount: 15 },
            { projectName: 'Blue Horizon Bakım', phaseName: 'Uygulama', taskCount: 45 },
            { projectName: 'Mediterranean Star Onarım', phaseName: 'Test', taskCount: 12 },
            { projectName: 'Aegean Express Motor', phaseName: 'Kapanış', taskCount: 8 },
        ],
        taskByAssignee: [
            { assigneeName: 'Mehmet Kaya', taskCount: 25 },
            { assigneeName: 'Ali Demir', taskCount: 18 },
            { assigneeName: 'Ayşe Yılmaz', taskCount: 12 },
            { assigneeName: 'Fatma Şahin', taskCount: 10 },
        ],
    },

    projectDocuments: [
        { id: 1, name: 'Teknik Şartname.pdf', type: 'PDF', size: '2.4 MB', date: '2026-01-15' },
        { id: 2, name: 'Maliyet Analizi.xlsx', type: 'Excel', size: '1.1 MB', date: '2026-01-20' },
        { id: 3, name: 'Proje Planı.docx', type: 'Word', size: '890 KB', date: '2026-01-22' },
    ],

    employees: [
        {
            id: 1, name: 'Mehmet Kaya', department: 'Mühendislik', position: 'Kıdemli Mühendis', startDate: '2020-03-15', phone: '0532 111 2233', email: 'mehmet@bluehub.com',
            tcNo: '12345678901', passportNo: 'U12345678', birthDate: '1985-05-10', birthPlace: 'Istanbul', gender: 'Erkek', maritalStatus: 'Evli', militaryStatus: 'Yapıldı', nationality: 'TC', bloodGroup: 'A Rh+', mobilePhone: '0532 111 2233', personalEmail: 'mehmet.kaya@gmail.com', district: 'Kadikoy', address: 'Bagdat Cad. No: 123', emergencyPerson: 'Ayse Kaya', emergencyPhone: '0533 222 3344', emergencyRelation: 'Es', workDuration: '4 Yil', workStatus: 'Aktif', workType: 'Tam Zamanli', manager: 'Can Bulut', bankName: 'Garanti', branch: 'Kadikoy', sgkNo: '11223344', iban: 'TR12 3456 7890 1234 5678 9012 34', educationLevel: 'Lisans', school: 'ITU', graduationYear: '2008'
        },
        {
            id: 2, name: 'Ayşe Yılmaz', department: 'Satış', position: 'Satış Müdürü', startDate: '2019-07-01', phone: '0533 222 3344', email: 'ayse@bluehub.com',
            tcNo: '23456789012', passportNo: '-', birthDate: '1990-08-20', birthPlace: 'Izmir', gender: 'Kadin', maritalStatus: 'Bekar', militaryStatus: 'Muaf', nationality: 'TC', bloodGroup: '0 Rh+', mobilePhone: '0533 222 3344', personalEmail: 'ayse.yilmaz@hotmail.com', district: 'Karsiyaka', address: 'Yali Cad. No: 45', emergencyPerson: 'Fatma Yilmaz', emergencyPhone: '0535 555 6677', emergencyRelation: 'Anne', workDuration: '5 Yil', workStatus: 'Aktif', workType: 'Tam Zamanli', manager: 'Mehmet Kaya', bankName: 'Is Bankasi', branch: 'Karsiyaka', sgkNo: '22334455', iban: 'TR45 6789 0123 4567 8901 2345 67', educationLevel: 'Yuksek Lisans', school: 'Ege Uni', graduationYear: '2014'
        },
        {
            id: 3, name: 'Ali Demir', department: 'Lojistik', position: 'Lojistik Uzmanı', startDate: '2021-01-10', phone: '0534 333 4455', email: 'ali@bluehub.com',
            tcNo: '34567890123', passportNo: 'U87654321', birthDate: '1988-12-12', birthPlace: 'Ankara', gender: 'Erkek', maritalStatus: 'Evli', militaryStatus: 'Yapıldı', nationality: 'TC', bloodGroup: 'B Rh-', mobilePhone: '0534 333 4455', personalEmail: 'ali.demir@yahoo.com', district: 'Cankaya', address: 'Ataturk Bul. No: 67', emergencyPerson: 'Zeynep Demir', emergencyPhone: '0536 777 8899', emergencyRelation: 'Es', workDuration: '3 Yil', workStatus: 'Aktif', workType: 'Tam Zamanli', manager: 'Mehmet Kaya', bankName: 'Yapi Kredi', branch: 'Kizilay', sgkNo: '33445566', iban: 'TR78 9012 3456 7890 1234 5678 90', educationLevel: 'Lisans', school: 'ODTU', graduationYear: '2010'
        },
        { id: 4, name: 'Fatma Şahin', department: 'Finans', position: 'Muhasebe Uzmanı', startDate: '2018-09-20', phone: '0535 444 5566', email: 'fatma@bluehub.com' },
        { id: 5, name: 'Can Bulut', department: 'Mühendislik', position: 'Teknik Uzman', startDate: '2022-05-12', phone: '0536 555 6677', email: 'can@bluehub.com' },
        { id: 6, name: 'Elif Aksoy', department: 'İK', position: 'İK Uzmanı', startDate: '2021-08-03', phone: '0537 666 7788', email: 'elif@bluehub.com' },
    ],

    contracts: [
        { id: 1, employee: 'Mehmet Kaya', type: 'Belirsiz Süreli', startDate: '2020-03-15', salary: 42000, status: 'Aktif' },
        { id: 2, employee: 'Ayşe Yılmaz', type: 'Belirsiz Süreli', startDate: '2019-07-01', salary: 48000, status: 'Aktif' },
        { id: 3, employee: 'Ali Demir', type: 'Belirli Süreli', startDate: '2021-01-10', endDate: '2027-01-10', salary: 35000, status: 'Aktif' },
        { id: 4, employee: 'Fatma Şahin', type: 'Belirsiz Süreli', startDate: '2018-09-20', salary: 39000, status: 'Aktif' },
    ],

    leaves: [
        { id: 1, employee: 'Mehmet Kaya', type: 'Yıllık İzin', startDate: '2026-03-01', endDate: '2026-03-05', days: 5, status: 'Onaylandı' },
        { id: 2, employee: 'Ayşe Yılmaz', type: 'Hastalık İzni', startDate: '2026-02-10', endDate: '2026-02-12', days: 3, status: 'Onaylandı' },
        { id: 3, employee: 'Can Bulut', type: 'Yıllık İzin', startDate: '2026-02-20', endDate: '2026-02-24', days: 5, status: 'Beklemede' },
    ],

    attendanceReport: [
        { id: 1, employee: 'Mehmet Kaya', date: '2026-02-15', checkIn: '08:30', checkOut: '17:45', status: 'Tam Gün', hours: 9.25 },
        { id: 2, employee: 'Ayşe Yılmaz', date: '2026-02-15', checkIn: '09:00', checkOut: '18:00', status: 'Tam Gün', hours: 9.0 },
        { id: 3, employee: 'Ali Demir', date: '2026-02-15', checkIn: '08:15', checkOut: '17:30', status: 'Tam Gün', hours: 9.25 },
        { id: 4, employee: 'Fatma Şahin', date: '2026-02-15', checkIn: '09:30', checkOut: '13:00', status: 'Yarım Gün', hours: 3.5 },
        { id: 5, employee: 'Can Bulut', date: '2026-02-15', checkIn: '—', checkOut: '—', status: 'İzinli', hours: 0 },
    ],

    warehouses: [
        { id: 1, name: 'Ana Depo', location: 'Tuzla, İstanbul', capacity: '5000 m²', usage: '78%', items: 1245, manager: 'Hasan Öz' },
        { id: 2, name: 'Liman Deposu', location: 'Ambarlı, İstanbul', capacity: '3200 m²', usage: '62%', items: 834, manager: 'Kemal Taş' },
        { id: 3, name: 'Yedek Parça Deposu', location: 'Pendik, İstanbul', capacity: '1800 m²', usage: '91%', items: 2150, manager: 'Murat Kılıç' },
        { id: 4, name: 'İzmir Şube Deposu', location: 'Alsancak, İzmir', capacity: '2400 m²', usage: '55%', items: 567, manager: 'Deniz Akar' },
    ],

    logisticProfitability: [
        { id: 1, route: 'İstanbul → İzmir', shipments: 45, revenue: 234000, cost: 178000, profit: 56000, margin: '23.9%' },
        { id: 2, route: 'İstanbul → Mersin', shipments: 32, revenue: 198000, cost: 142000, profit: 56000, margin: '28.3%' },
        { id: 3, route: 'İzmir → Antalya', shipments: 28, revenue: 156000, cost: 118000, profit: 38000, margin: '24.4%' },
        { id: 4, route: 'Mersin → İskenderun', shipments: 19, revenue: 112000, cost: 89000, profit: 23000, margin: '20.5%' },
        { id: 5, route: 'İstanbul → Trabzon', shipments: 15, revenue: 98000, cost: 82000, profit: 16000, margin: '16.3%' },
    ],



    todos: [
        { id: 1, title: 'Motor parçası siparişi ver', assignee: 'Mehmet Kaya', dueDate: '2026-02-18', priority: 'Yüksek', status: 'Açık' },
        { id: 2, title: 'Fatura kontrol et', assignee: 'Fatma Şahin', dueDate: '2026-02-16', priority: 'Orta', status: 'İşlemde' },
        { id: 3, title: 'Müşteri ziyareti planla', assignee: 'Ayşe Yılmaz', dueDate: '2026-02-20', priority: 'Düşük', status: 'Açık' },
        { id: 4, title: 'Depo sayımı', assignee: 'Ali Demir', dueDate: '2026-02-17', priority: 'Yüksek', status: 'Tamamlandı' },
        { id: 5, title: 'Sözleşme yenileme', assignee: 'Elif Aksoy', dueDate: '2026-02-25', priority: 'Orta', status: 'Açık' },
    ],

    deliveries: [
        { id: 1, deliveryNo: 'TSL-2026-301', type: 'Deniz', origin: 'İstanbul', destination: 'İzmir', date: '2026-02-15', status: 'Yolda', vessel: 'MV Blue Star' },
        { id: 2, deliveryNo: 'TSL-2026-302', type: 'Kara', origin: 'Mersin', destination: 'Antalya', date: '2026-02-14', status: 'Teslim Edildi', vessel: '—' },
        { id: 3, deliveryNo: 'TSL-2026-303', type: 'Deniz', origin: 'İstanbul', destination: 'Trabzon', date: '2026-02-16', status: 'Hazırlanıyor', vessel: 'MV Karadeniz' },
        { id: 4, deliveryNo: 'TSL-2026-304', type: 'Hava', origin: 'İstanbul', destination: 'Rotterdam', date: '2026-02-13', status: 'Teslim Edildi', vessel: '—' },
    ],

    invoices: [
        { id: 1, invoiceNo: 'FTR-2026-501', partner: 'Deniz Tedarik A.Ş.', type: 'Alış', amount: 45200, currency: 'TRY', date: '2026-02-14', status: 'Ödendi' },
        { id: 2, invoiceNo: 'FTR-2026-502', partner: 'Blue Horizon Ltd.', type: 'Satış', amount: 128000, currency: 'USD', date: '2026-02-13', status: 'Beklemede' },
        { id: 3, invoiceNo: 'FTR-2026-503', partner: 'Akdeniz Lojistik', type: 'Alış', amount: 78500, currency: 'TRY', date: '2026-02-12', status: 'Ödendi' },
        { id: 4, invoiceNo: 'FTR-2026-504', partner: 'Mediterranean Star', type: 'Satış', amount: 92000, currency: 'EUR', date: '2026-02-11', status: 'Gecikmiş' },
        { id: 5, invoiceNo: 'FTR-2026-505', partner: 'Marine Parts Ltd.', type: 'Alış', amount: 34600, currency: 'USD', date: '2026-02-10', status: 'Ödendi' },
    ],

    payments: [
        { id: 1, paymentNo: 'ODM-2026-201', partner: 'Deniz Tedarik A.Ş.', type: 'Havale', amount: 45200, currency: 'TRY', date: '2026-02-14', status: 'Tamamlandı' },
        { id: 2, paymentNo: 'ODM-2026-202', partner: 'Marine Parts Ltd.', type: 'EFT', amount: 12800, currency: 'USD', date: '2026-02-13', status: 'Beklemede' },
        { id: 3, paymentNo: 'ODM-2026-203', partner: 'Akdeniz Lojistik', type: 'Çek', amount: 78500, currency: 'TRY', date: '2026-02-12', status: 'Tamamlandı' },
        { id: 4, paymentNo: 'ODM-2026-204', partner: 'Blue Horizon Ltd.', type: 'Havale', amount: 230000, currency: 'USD', date: '2026-02-11', status: 'İptal' },
    ],

    vesselVisits: [
        { id: 1, vessel: 'MV Blue Star', port: 'İstanbul Limanı', arrivalDate: '2026-02-10', departureDate: '2026-02-15', purpose: 'Bakım', agent: 'Deniz Acenta' },
        { id: 2, vessel: 'MV Mediterranean', port: 'Mersin Limanı', arrivalDate: '2026-02-12', departureDate: '2026-02-18', purpose: 'Yükleme', agent: 'Akdeniz Acenta' },
        { id: 3, vessel: 'MV Karadeniz', port: 'Trabzon Limanı', arrivalDate: '2026-02-14', departureDate: '2026-02-17', purpose: 'Boşaltma', agent: 'Karadeniz Acenta' },
        { id: 4, vessel: 'MV Aegean', port: 'İzmir Limanı', arrivalDate: '2026-02-16', departureDate: '2026-02-20', purpose: 'Bakım', agent: 'Ege Acenta' },
    ],

    vouchers: [
        { id: 1, voucherNo: 'FIS-2026-001', type: 'Tahsilat', description: 'Müşteri ödemesi', amount: 45000, currency: 'TRY', date: '2026-02-15', voucherStatus: 'Onaylandı' },
        { id: 2, voucherNo: 'FIS-2026-002', type: 'Tediye', description: 'Tedarikçi ödemesi', amount: 23000, currency: 'TRY', date: '2026-02-14', voucherStatus: 'Beklemede' },
        { id: 3, voucherNo: 'FIS-2026-003', type: 'Mahsup', description: 'Cari mahsup', amount: 67000, currency: 'USD', date: '2026-02-13', voucherStatus: 'Onaylandı' },
        { id: 4, voucherNo: 'FIS-2026-004', type: 'Tahsilat', description: 'Proje taksiti', amount: 120000, currency: 'EUR', date: '2026-02-12', voucherStatus: 'İptal' },
        { id: 5, voucherNo: 'FIS-2026-005', type: 'Tediye', description: 'Personel maaşı', amount: 280000, currency: 'TRY', date: '2026-02-11', voucherStatus: 'Taslak' },
    ],

    incomeStatement: [
        { accountCode: '600', accountName: 'Yurt İçi Satışlar', balance: 2850000, credit: 2850000, accountType: 'Gelir', budget: 3000000, refCode: 'REF-600', initialBalance: 0, initialBalanceDate: '2026-01-01', initialBalanceType: 'Alacak', kdv: 18, currency: 'TRY' },
        { accountCode: '601', accountName: 'Yurt Dışı Satışlar', balance: 400000, credit: 400000, accountType: 'Gelir', budget: 500000, refCode: 'REF-601', initialBalance: 0, initialBalanceDate: '2026-01-01', initialBalanceType: 'Alacak', kdv: 0, currency: 'EUR' },
        { accountCode: '602', accountName: 'Diğer Gelirler', balance: 890000, credit: 890000, accountType: 'Gelir', budget: 800000, refCode: 'REF-602', initialBalance: 0, initialBalanceDate: '2026-01-01', initialBalanceType: 'Alacak', kdv: 18, currency: 'TRY' },
        { accountCode: '610', accountName: 'Satış İadeleri (-)', balance: -150000, debit: 150000, accountType: 'Gider', budget: 100000, refCode: 'REF-610', initialBalance: 0, initialBalanceDate: '2026-01-01', initialBalanceType: 'Borç', kdv: 18, currency: 'TRY' },
        { accountCode: '621', accountName: 'Satılan Ticari Mallar Maliyeti (-)', balance: -1450000, debit: 1450000, accountType: 'Gider', budget: 1400000, refCode: 'REF-621', initialBalance: 0, initialBalanceDate: '2026-01-01', initialBalanceType: 'Borç', kdv: 18, currency: 'TRY' },
        { accountCode: '720', accountName: 'Direkt İşçilik Giderleri (-)', balance: -450000, debit: 450000, accountType: 'Gider', budget: 400000, refCode: 'REF-720', initialBalance: 0, initialBalanceDate: '2026-01-01', initialBalanceType: 'Borç', kdv: 0, currency: 'TRY' },
        { accountCode: '730', accountName: 'Genel Üretim Giderleri (-)', balance: -270000, debit: 270000, accountType: 'Gider', budget: 250000, refCode: 'REF-730', initialBalance: 0, initialBalanceDate: '2026-01-01', initialBalanceType: 'Borç', kdv: 18, currency: 'TRY' },
        { accountCode: '760', accountName: 'Pazarlama Satış Dağ. Giderleri (-)', balance: -180000, debit: 180000, accountType: 'Gider', budget: 200000, refCode: 'REF-760', initialBalance: 0, initialBalanceDate: '2026-01-01', initialBalanceType: 'Borç', kdv: 18, currency: 'TRY' },
        { accountCode: '770', accountName: 'Genel Yönetim Giderleri (-)', balance: -340000, debit: 340000, accountType: 'Gider', budget: 350000, refCode: 'REF-770', initialBalance: 0, initialBalanceDate: '2026-01-01', initialBalanceType: 'Borç', kdv: 18, currency: 'TRY' },
        { accountCode: '642', accountName: 'Faiz Gelirleri', balance: 120000, credit: 120000, accountType: 'Gelir', budget: 100000, refCode: 'REF-642', initialBalance: 0, initialBalanceDate: '2026-01-01', initialBalanceType: 'Alacak', kdv: 0, currency: 'TRY' },
        { accountCode: '660', accountName: 'Kısa Vadeli Borçlanma Giderleri (-)', balance: -210000, debit: 210000, accountType: 'Gider', budget: 200000, refCode: 'REF-660', initialBalance: 0, initialBalanceDate: '2026-01-01', initialBalanceType: 'Borç', kdv: 0, currency: 'TRY' },
    ],

    orders: [
        {
            id: 1, orderNo: 'SIP-2026-401', customer: 'Mediterranean Star', items: 5, amount: 89000, currency: 'USD', date: '2026-02-14', status: 'Onaylandı',
            projectNo: 'PRJ-001', outputWarehouseId: 'Depo 1', invoiceNo: 'FTR-2026-506', invoiceDate: '2026-02-15', deliveryLocation: 'Istanbul', deliveryTime: '2026-02-20', deliveryType: 'Kargo', paymentPlan: '30 Gün', note: 'Acil'
        },
        {
            id: 2, orderNo: 'SIP-2026-402', customer: 'Blue Horizon Ltd.', items: 3, amount: 45000, currency: 'EUR', date: '2026-02-13', status: 'Hazırlanıyor',
            projectNo: 'PRJ-002', outputWarehouseId: 'Depo 2', invoiceNo: 'FTR-2026-507', invoiceDate: '2026-02-16', deliveryLocation: 'Izmir', deliveryTime: '2026-02-22', deliveryType: 'Nakliye', paymentPlan: 'Peşin', note: '-'
        },
        {
            id: 3, orderNo: 'SIP-2026-403', customer: 'Anatolian Cargo', items: 8, amount: 120000, currency: 'TRY', date: '2026-02-12', status: 'Teslim Edildi',
            projectNo: 'PRJ-003', outputWarehouseId: 'Depo 3', invoiceNo: 'FTR-2026-508', invoiceDate: '2026-02-17', deliveryLocation: 'Ankara', deliveryTime: '2026-02-15', deliveryType: 'Kargo', paymentPlan: '60 Gün', note: 'Tamamlandı'
        },
    ],

    partners: [
        {
            id: 1, name: 'Deniz Tedarik A.Ş.', type: 'Tedarikçi', city: 'İstanbul', phone1: '0212 555 1122', phone2: '0555 123 4567', balance: 125000, currency: 'TRY',
            partnerCode: 'TDR-001', shortName: 'Deniz Tedarik', ownerName: 'Mehmet Yılmaz', contactPerson: 'Ali Veli', isAbroad: false, groupId: 'GRP-01', rating: 'A', taxNumber: '1234567890', taxOffice: 'Beşiktaş', joiningDate: '2020-01-01', approvedDate: '2020-01-05', webAddress: 'www.deniztedarik.com', email: 'info@deniztedarik.com'
        },
        {
            id: 2, name: 'Marine Parts Ltd.', type: 'Tedarikçi', city: 'İzmir', phone1: '0232 444 3344', phone2: '0532 987 6543', balance: -45000, currency: 'USD',
            partnerCode: 'TDR-002', shortName: 'Marine Parts', ownerName: 'John Doe', contactPerson: 'Jane Doe', isAbroad: true, groupId: 'GRP-02', rating: 'B', taxNumber: '9876543210', taxOffice: 'Izmir', joiningDate: '2021-05-10', approvedDate: '2021-05-15', webAddress: 'www.marineparts.com', email: 'sales@marineparts.com'
        },
        {
            id: 3, name: 'Mediterranean Star', type: 'Müşteri', city: 'Antalya', phone1: '0242 333 5566', phone2: '-', balance: 89000, currency: 'EUR',
            partnerCode: 'CUST-001', shortName: 'Med Star', ownerName: 'Ahmet Demir', contactPerson: 'Ayşe Kaya', isAbroad: false, groupId: 'GRP-03', rating: 'A+', taxNumber: '5678901234', taxOffice: 'Antalya', joiningDate: '2019-11-20', approvedDate: '2019-11-25', webAddress: 'www.medstar.com', email: 'contact@medstar.com'
        },
        { id: 4, name: 'Akdeniz Lojistik', type: 'Tedarikçi', city: 'Mersin', phone1: '0324 222 7788', balance: 67000, currency: 'TRY', partnerCode: 'TDR-003' },
        { id: 5, name: 'Blue Horizon Ltd.', type: 'Müşteri', city: 'İstanbul', phone1: '0216 111 9900', balance: 230000, currency: 'USD', partnerCode: 'CUST-002' },
        { id: 6, name: 'Black Sea Lines', type: 'Müşteri', city: 'Trabzon', phone1: '0462 888 1122', balance: 145000, currency: 'TRY', partnerCode: 'CUST-003' },
    ],

    ships: [
        { id: 1, name: 'MV Blue Star', type: 'Kuru Yük', flag: 'Panama', imo: '9123456', status: 'Seyir Halinde', buildYear: 2015, capacity: '25,000 DWT' },
        { id: 2, name: 'MV Mediterranean', type: 'Konteyner', flag: 'Malta', imo: '9234567', status: 'Limanda', buildYear: 2018, capacity: '4,500 TEU' },
        { id: 3, name: 'MV Karadeniz', type: 'Tanker', flag: 'Türkiye', imo: '9345678', status: 'Bakımda', buildYear: 2012, capacity: '15,000 DWT' },
        { id: 4, name: 'MV Aegean', type: 'Ro-Ro', flag: 'Yunanistan', imo: '9456789', status: 'Seyir Halinde', buildYear: 2020, capacity: '2,800 LM' },
        { id: 5, name: 'MV Marmara', type: 'Genel Kargo', flag: 'Türkiye', imo: '9567890', status: 'Demirli', buildYear: 2008, capacity: '8,500 DWT' },
    ],

    services: [
        { id: 1, serviceNo: 'SRV-2026-101', subject: 'Motor Bakımı', vessel: 'MV Blue Star', status: 'Devam Ediyor', date: '2026-02-15', description: 'Ana makine 10.000 saat bakımı', technician: 'Ahmet Usta' },
        { id: 2, serviceNo: 'SRV-2026-102', subject: 'Jeneratör Arızası', vessel: 'MV Karadeniz', status: 'Açık', date: '2026-02-14', description: 'No.2 Jeneratör voltaj dalgalanması', technician: 'Mehmet Elektrik' },
        { id: 3, serviceNo: 'SRV-2026-103', subject: 'Klavuz Kaptan Talebi', vessel: 'MV Mediterranean', status: 'Tamamlandı', date: '2026-02-13', description: 'Boğaz geçişi refakat hizmeti', technician: 'Kıyı Emniyeti' },
        { id: 4, serviceNo: 'SRV-2026-104', subject: 'Vinç Onarımı', vessel: 'MV Marmara', status: 'Planlandı', date: '2026-02-18', description: 'No.1 Vinç hidrolik sızıntısı', technician: 'Vural Hidrolik' },
    ],

    generalDashboard: {
        cards: [
            { key: 'revenue', label: 'Toplam Ciro', value: 3250000, valueFormatted: '₺3.250.000', changePercent: 12.5, compareLabel: 'Geçen aya göre', isPositiveGood: true },
            { key: 'profit', label: 'Net Kâr', value: 1070000, valueFormatted: '₺1.070.000', changePercent: 8.4, compareLabel: 'Geçen aya göre', isPositiveGood: true },
            { key: 'orders', label: 'Aktif Siparişler', value: 45, valueFormatted: '45', changePercent: -2.1, compareLabel: 'Geçen aya göre', isPositiveGood: false },
            { key: 'projects', label: 'Devam Eden Projeler', value: 12, valueFormatted: '12', changePercent: 0, compareLabel: 'Geçen aya göre', isPositiveGood: true },
        ],
        updatedAt: '2026-02-18T10:00:00'
    },

    quotesByCustomer: [
        { id: 1, customer: 'Mediterranean Star', quoteNo: 'TKL-2026-101', amount: 45000, currency: 'USD', status: 'Beklemede' },
        { id: 2, customer: 'Blue Horizon Ltd.', quoteNo: 'TKL-2026-102', amount: 128000, currency: 'EUR', status: 'Onaylandı' },
        { id: 3, customer: 'Anatolian Cargo', quoteNo: 'TKL-2026-103', amount: 67500, currency: 'TRY', status: 'Reddedildi' },
    ],

    companyAccounts: [
        { id: 1, bankName: 'Garanti Bankası', accountName: 'Ana Hesap', iban: 'TR12 0006 2000 0001 2345 6789 01', currency: 'TRY', balance: 450000 },
        { id: 2, bankName: 'İş Bankası', accountName: 'Döviz Hesabı', iban: 'TR45 0006 4000 0001 2345 6789 02', currency: 'USD', balance: 125000 },
        { id: 3, bankName: 'Yapı Kredi', accountName: 'Euro Hesabı', iban: 'TR78 0006 7000 0001 2345 6789 03', currency: 'EUR', balance: 85000 },
    ],

    bankAccounts: [
        { id: 1, name: 'Merkez Kasa', balance: 25000, currency: 'TRY' },
        { id: 2, name: 'Şube Kasa', balance: 15000, currency: 'TRY' },
        { id: 3, name: 'POS Hesabı', balance: 120000, currency: 'TRY' },
    ],

    products: [
        {
            id: 1, code: 'PRD-001', name: 'Gemi Boyası (Kırmızı)', category: 'Boya', stock: 150, unit: 'Litre', price: 450, currency: 'TRY',
            subCategory: 'Dış Cephe', brand: 'Jotun', model: 'SeaForce 30', drawingNo: '-', partNo: 'P-1001', itemNo: '1', weight: '25', volume: '0.04', origin: 'Türkiye'
        },
        {
            id: 2, code: 'PRD-002', name: 'Hidrolik Yağ', category: 'Yağ', stock: 80, unit: 'Varil', price: 1200, currency: 'USD',
            subCategory: 'Endüstriyel', brand: 'Shell', model: 'Tellus S2', drawingNo: '-', partNo: 'P-1002', itemNo: '2', weight: '200', volume: '0.3', origin: 'Almanya'
        },
        {
            id: 3, code: 'PRD-003', name: 'Çelik Halat 20mm', category: 'Donanım', stock: 500, unit: 'Metre', price: 85, currency: 'EUR',
            subCategory: 'Halat', brand: 'WireCo', model: 'X-Tend', drawingNo: 'DRW-55', partNo: 'P-1003', itemNo: '3', weight: '1.5', volume: '0.01', origin: 'Çin'
        },
        {
            id: 4, code: 'PRD-004', name: 'Filtre Seti', category: 'Yedek Parça', stock: 45, unit: 'Adet', price: 250, currency: 'USD',
            subCategory: 'Motor', brand: 'Fleetguard', model: 'FF5052', drawingNo: 'DRW-56', partNo: 'P-1004', itemNo: '4', weight: '0.5', volume: '0.005', origin: 'ABD'
        },
        {
            id: 5, code: 'PRD-005', name: 'Seyir Feneri', category: 'Elektrik', stock: 12, unit: 'Adet', price: 1800, currency: 'TRY',
            subCategory: 'Aydınlatma', brand: 'Aqua Signal', model: 'Series 55', drawingNo: 'DRW-57', partNo: 'P-1005', itemNo: '5', weight: '1.2', volume: '0.02', origin: 'Norveç'
        },
    ],

    salesReports: {
        dailySales: [
            { date: '2026-02-10', amount: 45000 },
            { date: '2026-02-11', amount: 52000 },
            { date: '2026-02-12', amount: 38000 },
            { date: '2026-02-13', amount: 64000 },
            { date: '2026-02-14', amount: 41000 },
            { date: '2026-02-15', amount: 55000 },
        ],
        topSellingProducts: [
            { name: 'Gemi Boyası', amount: 125000 },
            { name: 'Hidrolik Yağ', amount: 98000 },
            { name: 'Çelik Halat', amount: 85000 },
            { name: 'Filtre Seti', amount: 64000 },
            { name: 'Seyir Feneri', amount: 45000 },
        ],
    },
};

// ============================================================
// ── AUTH ────────────────────────────────────────────────────
// ============================================================

export async function login(credentials: LoginRequest) {
    if (USE_MOCK) {
        await delay(500);
        if (!credentials.password) throw new Error('Şifre gerekli');
        const token = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('auth_token', token);
        return { token, user: MOCK.user };
    }
    const data = await apiPost('/api/Auth/login', credentials);
    if (data?.token) localStorage.setItem('auth_token', data.token);
    return data;
}

export async function getMe() {
    if (USE_MOCK) { await delay(200); return MOCK.user; }
    return apiGet('/api/Auth/me');
}

// ============================================================
// ── DASHBOARD ──────────────────────────────────────────────
// ============================================================

// Consolidated into getGeneralDashboard below

export async function getDashboardOperational(_filter?: FinOperationalDashboardFilterDto) {
    if (USE_MOCK) { await delay(400); return MOCK.financeDashboard; }
    return apiPost('/api/Dashboard/operational', _filter);
}

export async function getPurchaseSummary(_companyId = 1) {
    if (USE_MOCK) { await delay(300); return MOCK.purchaseSummary; }
    return apiGet('/api/Dashboard/purchase/summary', { companyId: _companyId });
}

export async function getPurchaseChart(_companyId = 1) {
    if (USE_MOCK) { await delay(300); return MOCK.purchaseChart; }
    return apiGet('/api/Dashboard/purchase/chart', { companyId: _companyId });
}

export async function getTopSuppliers(_companyId = 1) {
    if (USE_MOCK) { await delay(300); return MOCK.topSuppliers; }
    return apiGet('/api/Dashboard/purchase/top-suppliers', { companyId: _companyId });
}

export async function getLastInvoices(_companyId = 1) {
    if (USE_MOCK) { await delay(300); return MOCK.lastInvoices; }
    return apiGet('/api/Dashboard/purchase/last-invoices', { companyId: _companyId });
}



// ⚠️ /api/Dashboard/notifications was REMOVED from the API
export async function getNotifications(params?: { companyId?: number; userId?: number }) {
    if (USE_MOCK) { await delay(300); return MOCK.notifications; }
    try {
        return await apiGet('/api/Dashboard/notifications', { companyId: 1, userId: 0, ...params });
    } catch {
        console.warn('[API] /api/Dashboard/notifications endpoint no longer available');
        return [];
    }
}

// ⚠️ /api/Dashboard/conversions was REMOVED from the API
export async function getConversions(params?: DashboardQueryParams) {
    if (USE_MOCK) { await delay(300); return MOCK.conversions; }
    try {
        return await apiGet('/api/Dashboard/conversions', { companyId: 1, userId: 0, period: 'month', ...params });
    } catch {
        console.warn('[API] /api/Dashboard/conversions endpoint no longer available');
        return [];
    }
}

export async function getOperationalSummary(params?: DashboardQueryParams) {
    if (USE_MOCK) { await delay(300); return MOCK.operationalSummary; }
    return apiGet('/api/Dashboard/operational-summary', { companyId: 1, userId: 0, period: 'month', ...params });
}

export async function getCustomersByChannel(params?: CustomersByChannelParams) {
    if (USE_MOCK) { await delay(300); return MOCK.customersByChannel; }
    return apiGet('/api/Dashboard/customers-by-channel', { companyId: 1, channelId: 0, period: 'ytd', ...params });
}

export async function getQuotesByCustomer(params?: QuotesByCustomerParams) {
    if (USE_MOCK) { await delay(300); return MOCK.quotesByCustomer || []; }
    return apiGet('/api/Dashboard/quotes-by-customer', { companyId: 1, customerId: 0, ...params });
}

export async function getRevenueByChannel(params?: { period?: string }) {
    if (USE_MOCK) { await delay(300); return MOCK.revenueByChannel; }
    return apiGet('/api/Dashboard/revenue-by-channel', { period: 'ytd', ...params });
}

export async function simulateSalesmanBonus(params: SalesmanBonusParams) {
    if (USE_MOCK) { await delay(300); return { bonus: ((params.actual || 0) * (params.bonusRate || 0)) / 100 }; }
    return apiGet('/api/Dashboard/simulate-salesman-bonus', params);
}

// ============================================================
// ── DELIVERY ───────────────────────────────────────────────
// ============================================================

export async function getDeliveries(_params?: DeliveryViewParams) {
    if (USE_MOCK) { await delay(300); return MOCK.deliveries; }
    return apiGet('/api/Delivery/view', _params);
}

// ============================================================
// ── FILES ──────────────────────────────────────────────────
// ============================================================

export async function uploadFile(file: File) {
    if (USE_MOCK) { await delay(500); return { fileName: file.name, url: '/mock/' + file.name }; }
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}/files/upload`, { method: 'POST', headers, body: formData });
    return handleResponse(res);
}

export async function uploadFiles(files: File[]) {
    if (USE_MOCK) { await delay(500); return files.map(f => ({ fileName: f.name, url: '/mock/' + f.name })); }
    const token = getToken();
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}/files/uploadAll`, { method: 'POST', headers, body: formData });
    return handleResponse(res);
}

// ============================================================
// ── FINANCE ────────────────────────────────────────────────
// ============================================================

export async function getCompanyAccounts(_companyId = 1) {
    if (USE_MOCK) { await delay(300); return MOCK.companyAccounts || []; }
    return apiGet('/api/Finance/company-accounts', { companyId: _companyId });
}

export async function getBankAccounts() {
    if (USE_MOCK) { await delay(300); return MOCK.bankAccounts || []; }
    return apiGet('/api/Finance/bank-account-view');
}

export async function getPartnerBalance(params?: PartnerBalanceParams) {
    if (USE_MOCK) { await delay(300); return MOCK.partners; }
    return apiGet('/api/Finance/partner-balance', params);
}



// ============================================================
// ── HR ─────────────────────────────────────────────────────
// ============================================================

export async function getEmployees() {
    if (USE_MOCK) { await delay(300); return MOCK.employees; }
    return apiGet('/api/HR/employee-list');
}

export async function getContracts() {
    if (USE_MOCK) { await delay(300); return MOCK.contracts; }
    return apiGet('/api/HR/contract-list');
}

export async function getLeaves() {
    if (USE_MOCK) { await delay(300); return MOCK.leaves; }
    return apiGet('/api/HR/leave-list');
}

export async function getAttendance(_params?: AttendanceListParams) {
    if (USE_MOCK) { await delay(300); return MOCK.attendanceReport; }
    return apiGet('/api/HR/attendance-list', _params);
}

export async function getAttendanceReport(_params?: AttendanceReportParams) {
    if (USE_MOCK) { await delay(300); return MOCK.attendanceReport; }
    return apiGet('/api/HR/attendance-report-list', _params);
}

// ============================================================
// ── HR ─────────────────────────────────────────────────────
// ============================================================

export async function getEmployeeList() {
    if (USE_MOCK) { await delay(300); return MOCK.employees || []; }
    return apiGet('/api/HR/employee-list');
}

// ============================================================
// ── INVENTORY ──────────────────────────────────────────────
// ============================================================

export async function getWarehouses() {
    if (USE_MOCK) { await delay(300); return MOCK.warehouses; }
    return apiGet('/api/Inventory/warehouse-list');
}

// ============================================================
// ── INVOICE ────────────────────────────────────────────────
// ============================================================

export async function getInvoices(_params?: InvoiceViewParams) {
    if (USE_MOCK) { await delay(300); return MOCK.invoices; }
    return apiGet('/api/Invoice/list', _params);
}

export async function getInvoiceDetails(id: number) {
    if (USE_MOCK) {
        await delay(300);
        const item = MOCK.invoices.find(i => i.id === id);
        // @ts-ignore
        return item ? { ...item, lines: generateMockItems(Math.floor(Math.random() * 5) + 2) } : undefined;
    }
    return apiGet('/api/Invoice/details', { id });
}

// ============================================================
// ── LOGISTIC ───────────────────────────────────────────────
// ============================================================

export async function getLogisticProfitability(_params?: { fromDate?: string; toDate?: string }) {
    if (USE_MOCK) { await delay(300); return MOCK.logisticProfitability; }
    return apiGet('/api/Logistic/profitability-list', _params);
}

// ============================================================
// ── OFFER ──────────────────────────────────────────────────
// ============================================================

export async function getOffers(_params?: OfferViewParams) {
    if (USE_MOCK) { await delay(300); return MOCK.offers; }
    return apiGet('/api/Offer/list', _params);
}

export async function getOfferDetails(id: number, includeDeleted = false) {
    if (USE_MOCK) {
        await delay(300);
        const item = MOCK.offers.find(o => o.id === id);
        // @ts-ignore
        return item ? { ...item, items: generateMockItems(3) } : undefined;
    }
    return apiGet('/api/Offer/details', { id, includeDeleted });
}

// ============================================================
// ── ORDER ──────────────────────────────────────────────────
// ============================================================

export async function getOrders(_params?: OrderListParams) {
    if (USE_MOCK) { await delay(300); return MOCK.orders; }
    return apiGet('/api/Order/list', _params);
}

export async function getOrderDetails(id: number) {
    if (USE_MOCK) {
        await delay(300);
        const item = MOCK.orders.find(o => o.id === id);
        // @ts-ignore
        return item ? { ...item, itemCount: item.items, items: generateMockItems(item.items as number) } : undefined;
    }
    return apiGet('/api/Order/details', { id });
}

// ============================================================
// ── PARTNER ────────────────────────────────────────────────
// ============================================================

export async function getPartners() {
    if (USE_MOCK) { await delay(300); return MOCK.partners; }
    return apiGet('/api/Partner/list');
}

// ============================================================
// ── PAYMENT ────────────────────────────────────────────────
// ============================================================

export async function getPayments(_params?: PaymentViewParams) {
    if (USE_MOCK) { await delay(300); return MOCK.payments; }
    return apiGet('/api/Payment/list', _params);
}

// ============================================================
// ── PROJECT ────────────────────────────────────────────────
// ============================================================

export async function getProjectList(_params?: ProjectListParams) {
    if (USE_MOCK) { await delay(300); return MOCK.projects; }
    return apiGet('/api/Project/list', _params);
}

export async function getTeamWorkStats(_companyId = 0) {
    if (USE_MOCK) { await delay(300); return MOCK.teamWorkStats; }
    return apiGet('/api/Project/team-work-stats', { companyId: _companyId });
}

export interface GeneralDashboardCardDto {
    key: string;
    label: string;
    value: number;
    valueFormatted: string;
    changePercent?: number;
    compareLabel?: string;
    isPositiveGood?: boolean;
}

export interface GeneralDashboardResponseDto {
    cards: GeneralDashboardCardDto[];
    updatedAt: string;
}

export async function getGeneralDashboard(companyId = 0) {
    if (USE_MOCK) { await delay(300); return MOCK.generalDashboard; }
    return apiGet('/api/Dashboard/general', { companyId });
}

export async function getProjectDashboard(_companyId = 0) {
    if (USE_MOCK) { await delay(300); return MOCK.projectDashboard; }
    return apiGet('/api/Project/dashboard', { companyId: _companyId });
}

export async function getProjectDocuments(_params?: ProjectDocumentsParams) {
    if (USE_MOCK) { await delay(300); return MOCK.projectDocuments; }
    return apiGet('/api/Project/documents', _params);
}

// ============================================================
// ── REPORT ─────────────────────────────────────────────────
// ============================================================

export async function getIncomeStatement(_params?: IncomeStatementParams) {
    if (USE_MOCK) { await delay(300); return MOCK.incomeStatement; }
    return apiGet('/api/Report/income-statement', _params);
}

// ============================================================
// ── REQUEST ────────────────────────────────────────────────
// ============================================================

export async function getRequests(_params?: RequestViewParams) {
    if (USE_MOCK) { await delay(300); return MOCK.requests; }
    return apiGet('/api/Request/list', _params);
}

export async function getRequestDetails(id: number) {
    if (USE_MOCK) {
        await delay(300);
        const item = MOCK.requests.find(r => r.id === id);
        // @ts-ignore
        return item ? { ...item, items: generateMockItems(Math.floor(Math.random() * 4) + 1) } : undefined;
    }
    return apiGet('/api/Request/details', { id });
}

// ============================================================
// ── TODO ───────────────────────────────────────────────────
// ============================================================

export async function getTodos(_params?: TodoViewParams) {
    if (USE_MOCK) { await delay(300); return MOCK.todos; }
    return apiGet('/api/ToDo/list', _params);
}

// ============================================================
// ── VESSEL VISIT ───────────────────────────────────────────
// ============================================================

export async function getVesselVisits(_params?: VesselVisitViewParams) {
    if (USE_MOCK) { await delay(300); return MOCK.vesselVisits; }
    return apiGet('/api/VesselVisit/list', _params);
}

// ============================================================
// ── SALES ──────────────────────────────────────────────────
// ============================================================

export async function getProducts() {
    if (USE_MOCK) { await delay(300); return MOCK.products; }
    return apiGet('/api/Product/list');
}

export async function getSalesReports() {
    if (USE_MOCK) { await delay(300); return MOCK.salesReports; }
    return apiGet('/api/Report/sales');
}

// ============================================================
// ── VOUCHER ────────────────────────────────────────────────
// ============================================================

export async function getVouchers(_params?: VoucherViewParams) {
    if (USE_MOCK) { await delay(300); return MOCK.vouchers; }
    return apiGet('/api/Voucher/list', _params);
}

// ============================================================
// ── SHIP ───────────────────────────────────────────────────
// ============================================================

export async function getShips() {
    if (USE_MOCK) { await delay(300); return MOCK.ships; }
    return apiGet('/api/Ship/list');
}

// ============================================================
// ── SERVICE ────────────────────────────────────────────────
// ============================================================

export async function getServices() {
    if (USE_MOCK) { await delay(300); return MOCK.services; }
    return apiGet('/api/Service/list');
}
