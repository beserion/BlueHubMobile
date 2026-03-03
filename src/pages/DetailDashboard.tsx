import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft, Loader2, FileText, Calendar, Activity, DollarSign,
    Info, Package, Users, Ship, CheckCircle2, AlertCircle, Clock,
    MapPin, Phone, Mail, Building2, Anchor, ChevronRight, Briefcase, GraduationCap, University
} from 'lucide-react';
import { MobileContainer } from '../components/mobile/MobileContainer';
import * as api from '../services/api';

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 sm:mb-0">{label}</span>
        <span className="text-base font-medium text-slate-900 dark:text-slate-100 text-left sm:text-right break-words">{value}</span>
    </div>
);

const ListItem: React.FC<{ item: any, index: number, currency: string }> = ({ item, index, currency }) => (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3 active:scale-[0.99] transition-transform">
        <div className="flex flex-col gap-1 flex-1">
            <div className="flex justify-between items-start">
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm line-clamp-2">
                    {item.name || item.productName || item.description || item.subject || `Kalem #${index + 1}`}
                </span>
                {(item.amount || item.totalPrice) && (
                    <span className="font-bold text-slate-900 dark:text-white text-sm whitespace-nowrap ml-2">
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: currency }).format(Number(item.amount || item.totalPrice))}
                    </span>
                )}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                {item.quantity && <span>{item.quantity} {item.unit}</span>}
                {item.price && <span>Birim: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: currency }).format(Number(item.price))}</span>}
                {item.date && <span>{new Date(item.date).toLocaleDateString('tr-TR')}</span>}
                {item.status && <span className="font-medium text-slate-600 dark:text-slate-300">{item.status}</span>}
            </div>
        </div>
        <ChevronRight size={16} className="text-slate-400 opacity-50 shrink-0" />
    </div>
);

type FieldConfig = {
    key: string;
    label: string;
    type?: 'text' | 'date' | 'currency' | 'status' | 'badge' | 'progress';
    format?: (value: any, data?: any) => React.ReactNode;
};

type DetailGroup = {
    title: string;
    icon?: any;
    fields: string[];
};

type PageConfig = {
    title: string;
    headerTitleKey?: string;
    icon: any;
    color: string;
    heroFields: string[];
    detailFields: string[]; // Fallback if no groups
    groups?: DetailGroup[]; // For grouped/tabbed view
    listFields?: string[];
};

const getFieldLabel = (key: string): string => {
    const labels: Record<string, string> = {
        route: 'Rota',
        shipments: 'Sevkiyat',
        revenue: 'Ciro',
        cost: 'Maliyet',
        profit: 'Kâr',
        margin: 'Kâr Marjı',
        orderNo: 'Sipariş No',
        customer: 'Müşteri',
        items: 'Kalemler',
        amount: 'Tutar',
        currency: 'Para Birimi',
        date: 'Tarih',
        status: 'Durum',
        itemCount: 'Kalem Sayısı',
        offerNo: 'Teklif No',
        subject: 'Konu',
        trackingNumber: 'Takip No',
        title: 'Başlık',
        responsibleUser: 'Sorumlu',
        invoiceNo: 'Fatura No',
        partner: 'Cari / Firma',
        type: 'Tür',
        paymentNo: 'Ödeme No',
        name: 'Ad / İsim',
        progress: 'İlerleme',
        startDate: 'Başlangıç',
        endDate: 'Bitiş',
        budget: 'Bütçe',
        spent: 'Harcanan',
        assignee: 'Atanan',
        dueDate: 'Son Tarih',
        priority: 'Öncelik',
        vessel: 'Gemi',
        port: 'Liman',
        arrivalDate: 'Varış',
        departureDate: 'Kalkış',
        purpose: 'Amaç',
        agent: 'Acenta',
        city: 'Şehir',
        phone: 'Telefon',
        balance: 'Bakiye',
        flag: 'Bayrak',
        imo: 'IMO No',
        buildYear: 'Yapım Yılı',
        capacity: 'Kapasite',
        serviceNo: 'Servis No',
        description: 'Açıklama',
        technician: 'Teknisyen',
        location: 'Konum',
        usage: 'Doluluk',
        manager: 'Yönetici',
        department: 'Departman',
        position: 'Pozisyon',
        email: 'E-posta',
        salary: 'Maaş',
        days: 'Gün Sayısı',
        checkIn: 'Giriş',
        checkOut: 'Çıkış',
        hours: 'Saat',
        employee: 'Personel',

        // New Fields from Ek/detay.txt
        partnerName: 'Talep Eden Firma',
        vesselName: 'Talep Eden Gemi',
        refNo: 'Ref No',
        requestDate: 'Talep Tarihi',
        validityDate: 'Geçerlilik Tarihi',
        responsiblePerson: 'Sorumlu Kullanıcı',
        purchaseCurrency: 'Alış Döviz Cinsi',
        requestNo: 'Talep No',
        revisionNo: 'Revizyon No',
        company: 'Firma Ünvanı',
        customerRef: 'Customer Ref',
        offerDate: 'İşlem Tarihi',
        validityDays: 'Geçerlilik Süresi',
        deliveryPlace: 'Teslim Yeri',
        deliveryLocation: 'Teslim Yeri',
        deliveryTime: 'Teslim Zamanı',
        deliveryType: 'Teslim Şekli',
        paymentTerms: 'Ödeme Planı',
        paymentPlan: 'Ödeme Planı',
        preparedBy: 'Hazırlayan',
        portFee: 'Port Fee',
        customFee: 'Custom Fee',
        transportation: 'Transportation',
        note: 'Remark',
        productCode: 'Ürün Kodu',
        category: 'Kategori',
        subCategory: 'Alt Kategori',
        brand: 'Marka',
        model: 'Model',
        drawingNo: 'Çizim No',
        partNo: 'Parça No',
        itemNo: 'Item No',
        weight: 'Ağırlık',
        volume: 'Hacim',
        origin: 'Menşei',

        // Partner
        partnerCode: 'Firma Kodu',
        shortName: 'Kısa Ad',
        ownerName: 'Firma Sahibi',
        contactPerson: 'İlgili Kişi',
        isAbroad: 'Yurtdışı',
        groupId: 'Grup Kodu',
        rating: 'Değerlendirme',
        taxNumber: 'Vergi No',
        taxOffice: 'Vergi Dairesi',
        joiningDate: 'Katılım Tarihi',
        approvedDate: 'Onay Tarihi',
        phone1: 'Telefon 1',
        phone2: 'Telefon 2',
        webAddress: 'Web Adresi',

        // Order
        projectNo: 'Proje No',
        outputWarehouseId: 'Çıkış Deposu',
        invoiceDate: 'Fatura Tarihi',

        // Voucher
        voucherNo: 'Fiş No',
        voucherStatus: 'Fiş Durumu',

        // Account
        accountName: 'Hesap Adı',
        accountCode: 'Hesap Kodu',
        refCode: 'Ref Kodu',
        accountType: 'Hesap Tipi',
        initialBalanceDate: 'Açılış Bakiye Tarihi',
        initialBalanceType: 'Bakiye Türü',
        kdv: 'KDV %',
        initialBalance: 'Açılış Bakiyesi',

        // Employee
        tcNo: 'TC Kimlik No',
        passportNo: 'Pasaport No',
        birthDate: 'Doğum Tarihi',
        birthPlace: 'Doğum Yeri',
        gender: 'Cinsiyet',
        maritalStatus: 'Medeni Hal',
        militaryStatus: 'Askerlik Durumu',
        nationality: 'Uyruk',
        bloodGroup: 'Kan Grubu',
        mobilePhone: 'Cep Telefonu',
        personalEmail: 'Kişisel E-posta',
        district: 'İlçe',
        address: 'Adres',
        emergencyPerson: 'Acil Durum Kişisi',
        emergencyPhone: 'Acil Durum Telefonu',
        emergencyRelation: 'Yakınlık Derecesi',
        workDuration: 'Çalışma Süresi',
        workStatus: 'Çalışma Durumu',
        workType: 'Çalışma Şekli',
        bankName: 'Banka Adı',
        branch: 'Şube',
        sgkNo: 'SGK No',
        iban: 'IBAN',
        educationLevel: 'Eğitim Seviyesi',
        school: 'Okul Adı',
        graduationYear: 'Mezuniyet Yılı'
    };
    return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const CONFIGS: Record<string, PageConfig> = {
    logistic: {
        title: 'Lojistik Detayı', headerTitleKey: 'route', icon: Activity, color: 'text-teal-600',
        heroFields: ['profit', 'margin', 'shipments', 'revenue'],
        detailFields: []
    },
    order: {
        title: 'Sipariş Detayı', headerTitleKey: 'customer', icon: FileText, color: 'text-blue-600',
        heroFields: ['orderNo', 'amount', 'date'],
        detailFields: [],
        groups: [
            { title: 'Genel', icon: Info, fields: ['company', 'customerRef', 'projectNo', 'vesselName', 'responsibleUser'] },
            { title: 'Teslimat', icon: Package, fields: ['deliveryLocation', 'outputWarehouseId', 'deliveryTime', 'deliveryType'] },
            { title: 'Finans', icon: DollarSign, fields: ['paymentPlan', 'currency', 'invoiceNo', 'invoiceDate', 'note'] }
        ]
    },
    offer: {
        title: 'Teklif Detayı', headerTitleKey: 'offerNo', icon: FileText, color: 'text-indigo-600',
        heroFields: ['customer', 'amount', 'offerDate'],
        detailFields: [],
        groups: [
            { title: 'Genel Bilgiler', icon: Info, fields: ['company', 'customerRef', 'revisionNo', 'preparedBy', 'validityDays'] },
            { title: 'Teslimat', icon: Package, fields: ['deliveryPlace', 'deliveryTime', 'deliveryType'] },
            { title: 'Finansal Veriler', icon: DollarSign, fields: ['currency', 'paymentTerms', 'portFee', 'customFee', 'transportation'] },
            { title: 'Notlar', icon: FileText, fields: ['note'] }
        ]
    },
    request: {
        title: 'Talep Detayı', headerTitleKey: 'requestNo', icon: Info, color: 'text-amber-600',
        heroFields: ['partnerName', 'vesselName', 'amount'],
        detailFields: [],
        groups: [
            { title: 'Genel Bilgiler', icon: Info, fields: ['refNo', 'requestDate', 'validityDate', 'responsiblePerson'] },
            { title: 'Finansal', icon: DollarSign, fields: ['currency', 'purchaseCurrency'] },
            { title: 'Açıklama', icon: FileText, fields: ['description'] }
        ]
    },
    invoice: {
        title: 'Fatura Detayı', headerTitleKey: 'invoiceNo', icon: DollarSign, color: 'text-emerald-600',
        heroFields: ['partnerName', 'amount', 'type', 'date'],
        detailFields: ['partnerCode', 'currency']
    },
    payment: {
        title: 'Ödeme Detayı', headerTitleKey: 'partner', icon: DollarSign, color: 'text-emerald-600',
        heroFields: ['paymentNo', 'amount', 'date'],
        detailFields: ['type', 'currency']
    },
    project: {
        title: 'Proje Detayı', headerTitleKey: 'name', icon: Calendar, color: 'text-purple-600',
        heroFields: ['customer', 'progress', 'endDate'],
        detailFields: [],
        groups: [
            { title: 'Genel', icon: Info, fields: ['startDate', 'endDate', 'progress'] },
            { title: 'Finansal', icon: DollarSign, fields: ['budget', 'spent'] }
        ]
    },
    todo: {
        title: 'Yapılacak Detayı', headerTitleKey: 'title', icon: CheckCircle2, color: 'text-slate-600',
        heroFields: ['assignee', 'priority', 'dueDate'],
        detailFields: []
    },
    'vessel-visit': {
        title: 'Gemi Ziyareti', headerTitleKey: 'vessel', icon: Anchor, color: 'text-sky-600',
        heroFields: ['port', 'arrivalDate', 'departureDate', 'purpose'],
        detailFields: ['agent']
    },
    partner: {
        title: 'İş Ortağı', headerTitleKey: 'partnerName', icon: Building2, color: 'text-indigo-600',
        heroFields: ['type', 'city', 'phone1', 'email'],
        detailFields: ['partnerCode'], // Fallback
        groups: [
            {
                title: 'Genel Bilgiler', icon: Info,
                fields: ['partnerCode', 'shortName', 'ownerName', 'contactPerson', 'isAbroad', 'groupId', 'webAddress', 'rating']
            },
            {
                title: 'Finansal', icon: DollarSign,
                fields: ['taxNumber', 'taxOffice', 'currency', 'balance']
            },
            {
                title: 'İletişim & Tarih', icon: Phone,
                fields: ['phone1', 'phone2', 'email', 'city', 'joiningDate', 'approvedDate']
            }
        ]
    },
    ship: {
        title: 'Gemi Detayı', headerTitleKey: 'name', icon: Ship, color: 'text-sky-600',
        heroFields: ['type', 'flag', 'imo'],
        detailFields: ['buildYear', 'capacity']
    },
    service: {
        title: 'Servis Detayı', headerTitleKey: 'subject', icon: Activity, color: 'text-orange-600',
        heroFields: ['vessel', 'date', 'technician'],
        detailFields: ['serviceNo', 'description']
    },
    warehouse: {
        title: 'Depo Detayı', headerTitleKey: 'name', icon: Package, color: 'text-amber-600',
        heroFields: ['location', 'usage', 'items', 'manager'],
        detailFields: ['capacity']
    },
    employee: {
        title: 'Personel Detayı', headerTitleKey: 'name', icon: Users, color: 'text-rose-600',
        heroFields: ['position', 'department', 'mobilePhone', 'email'],
        detailFields: ['tcNo'], // Fallback
        groups: [
            {
                title: 'Temel Bilgiler', icon: Users,
                fields: ['tcNo', 'passportNo', 'birthDate', 'birthPlace', 'gender', 'maritalStatus', 'militaryStatus', 'nationality', 'bloodGroup']
            },
            {
                title: 'İletişim', icon: Phone,
                fields: ['mobilePhone', 'personalEmail', 'address', 'district', 'city', 'emergencyPerson', 'emergencyPhone', 'emergencyRelation']
            },
            {
                title: 'İş Bilgileri', icon: Briefcase,
                fields: ['startDate', 'workDuration', 'workType', 'department', 'position', 'manager']
            },
            {
                title: 'Banka & SGK', icon: DollarSign,
                fields: ['bankName', 'branch', 'iban', 'sgkNo']
            },
            {
                title: 'Eğitim', icon: GraduationCap,
                fields: ['educationLevel', 'school', 'graduationYear']
            }
        ]
    },
    contract: {
        title: 'Sözleşme Detayı', headerTitleKey: 'employee', icon: FileText, color: 'text-slate-600',
        heroFields: ['type', 'startDate', 'salary'],
        detailFields: []
    },
    leave: {
        title: 'İzin Detayı', headerTitleKey: 'employee', icon: Calendar, color: 'text-orange-600',
        heroFields: ['type', 'startDate', 'days'],
        detailFields: ['endDate']
    },
    attendance: {
        title: 'Devam Detayı', headerTitleKey: 'employee', icon: Activity, color: 'text-blue-600',
        heroFields: ['date', 'checkIn', 'hours'],
        detailFields: ['checkOut']
    },
    product: {
        title: 'Ürün Detayı', headerTitleKey: 'name', icon: Package, color: 'text-amber-600',
        heroFields: ['productCode', 'price', 'stock', 'unit'],
        detailFields: [],
        groups: [
            { title: 'Özellikler', icon: Info, fields: ['category', 'subCategory', 'brand', 'model'] },
            { title: 'Teknik', icon: Activity, fields: ['drawingNo', 'partNo', 'itemNo'] },
            { title: 'Lojistik', icon: Package, fields: ['weight', 'volume', 'origin', 'currency'] }
        ]
    },
    account: {
        title: 'Hesap Planı Detayı', headerTitleKey: 'accountName', icon: FileText, color: 'text-slate-600',
        heroFields: ['accountCode', 'accountType', 'balance', 'budget'],
        detailFields: [],
        groups: [
            { title: 'Kayıt Bilgileri', icon: Info, fields: ['refCode', 'kdv', 'currency'] },
            { title: 'Açılış Bilgileri', icon: DollarSign, fields: ['initialBalance', 'initialBalanceDate', 'initialBalanceType'] }
        ]
    },
    voucher: {
        title: 'Fiş Detayı', headerTitleKey: 'voucherNo', icon: FileText, color: 'text-slate-600',
        heroFields: ['date', 'type', 'amount'],
        detailFields: []
    },
    // Fallback
    default: {
        title: 'Detay', icon: FileText, color: 'text-slate-600',
        heroFields: [], detailFields: []
    }
};

const DetailDashboard = () => {
    const { type, id } = useParams<{ type: string; id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    // Initial data from navigation state
    const initialData = location.state?.data;

    useEffect(() => {
        const fetchData = async () => {
            if (!type || !id) return;
            // If we have initialData and it matches the ID, use it to avoid loading
            if (initialData && (String(initialData.id) === String(id))) {
                setData(initialData);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                let result = null;
                const numericId = parseInt(id, 10);

                // MOCK FETCH IMPLEMENTATION
                switch (type) {
                    case 'logistic': result = (await api.getLogisticProfitability())?.find((i: any) => i.id == id); break;
                    case 'order': result = await api.getOrderDetails(numericId); break;
                    case 'offer': result = await api.getOfferDetails(numericId); break;
                    case 'request': result = await api.getRequestDetails(numericId); break;
                    case 'invoice': result = await api.getInvoiceDetails(numericId); break;
                    case 'payment': result = (await api.getPayments())?.find((i: any) => i.id == id); break;
                    case 'project': result = (await api.getProjectList())?.find((i: any) => i.id == id); break;
                    case 'todo': result = (await api.getTodos())?.find((i: any) => i.id == id); break;
                    case 'partner': result = (await api.getPartners())?.find((i: any) => i.id == id); break;
                    case 'employee': result = (await api.getEmployees())?.find((i: any) => i.id == id); break;
                    case 'vessel-visit': result = (await api.getVesselVisits())?.find((i: any) => i.id == id); break;
                    case 'ship': result = (await api.getShips())?.find((i: any) => i.id == id); break;
                    case 'service': result = (await api.getServices())?.find((i: any) => i.id == id); break;
                    case 'warehouse': result = (await api.getWarehouses())?.find((i: any) => i.id == id); break;
                    case 'contract': result = (await api.getContracts())?.find((i: any) => i.id == id); break;
                    case 'leave': result = (await api.getLeaves())?.find((i: any) => i.id == id); break;
                    case 'attendance': result = (await api.getAttendance())?.find((i: any) => i.id == id); break;
                    case 'product': result = (await api.getProducts())?.find((i: any) => i.id == id); break;
                    case 'account': result = (await api.getIncomeStatement())?.find((i: any) => i.accountCode == id || i.id == id); break; // Account uses code or id
                    case 'voucher': result = (await api.getVouchers())?.find((i: any) => i.id == id); break;

                    default:
                        if (initialData) result = initialData;
                        else throw new Error('Veri kaynağı bulunamadı');
                        break;
                }

                if (!result && initialData) result = initialData; // Fallback to state

                if (!result) throw new Error('Kayıt bulunamadı');
                setData(result);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Veri yüklenirken hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [type, id, initialData]);

    const pageConfig = CONFIGS[type || 'default'] || CONFIGS['default'];
    const headerTitle = data && pageConfig.headerTitleKey && data[pageConfig.headerTitleKey]
        ? data[pageConfig.headerTitleKey]
        : pageConfig.title;

    const { icon: Icon, color, heroFields, detailFields, groups } = pageConfig;

    // Helper to format values (Same as before but cleaner)
    const formatValue = (key: string, value: any): React.ReactNode => {
        if (value === null || value === undefined) return <span className="text-slate-300">-</span>;

        if (key === 'status' || key === 'voucherStatus' || key === 'workStatus') {
            const statusColor =
                ['Onaylandı', 'Tamamlandı', 'Ödendi', 'Aktif', 'Yolda', 'Seyir Halinde', 'Teslim Edildi'].includes(value) ? 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400' :
                    ['Beklemede', 'İşlemde', 'Hazırlanıyor', 'Planlandı', 'Devam Ediyor', 'Bakımda', 'Limanda', 'Kısmi Ödeme', 'Taslak'].includes(value) ? 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-400' :
                        ['Reddedildi', 'İptal', 'Gecikmiş', 'Pasif'].includes(value) ? 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400' :
                            'text-slate-600 bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400';

            return (
                <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                    {value}
                </span>
            );
        }

        if (key === 'progress') {
            return (
                <div className="flex flex-col w-full max-w-[100px]">
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${value}%` }} />
                    </div>
                </div>
            );
        }

        if (typeof value === 'boolean') return value ? 'Evet' : 'Hayır';

        if (key.toLowerCase().includes('date') || key.toLowerCase().includes('tarih')) {
            try { return new Date(value).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return String(value); }
        }

        if (['amount', 'price', 'cost', 'revenue', 'profit', 'balance', 'budget', 'spent', 'salary', 'initialBalance'].includes(key)) {
            const currency = data?.currency || data?.doviz || 'TRY';
            try { return new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(Number(value)); } catch { return String(value); }
        }

        if (typeof value === 'object' && !Array.isArray(value)) {
            return value.name || value.title || value.fullName || JSON.stringify(value);
        }

        return String(value);
    };

    // Compact Row Component
    const CompactRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => {
        const isMonetary = ['Tutar', 'Bakiye', 'Bütçe', 'Harcanan', 'Maaş', 'Fiyat', 'Maliyet', 'Ciro', 'Kâr', 'Açılış Bakiyesi'].includes(label);
        return (
            <div className="flex justify-between items-start py-3 border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
                <span className={`text-sm font-semibold text-slate-900 dark:text-slate-100 break-words max-w-[65%] text-right ${isMonetary ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                    {value}
                </span>
            </div>
        );
    };

    return (
        <MobileContainer>
            {/* Header: Clean, White, Sticky - Height Reduced */}
            <div className="sticky rounded-xl top-0 z-30 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 shadow-sm">
                <button
                    onClick={() => navigate(-1)}
                    className="p-1.5 -ml-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                        <Icon size={12} className={color} />
                        <span>{pageConfig.title}</span>
                    </div>
                    <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
                        {loading ? '...' : headerTitle}
                    </h1>
                </div>
                {/* Header Status Badge */}
                {data && ('status' in data || 'voucherStatus' in data || 'workStatus' in data) && (
                    <div className="shrink-0 ml-2">
                        {formatValue('status', data.status || data.voucherStatus || data.workStatus)}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 size={24} className="animate-spin text-blue-600 mb-2" />
                </div>
            ) : error ? (
                <div className="p-4 m-4 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 text-center">
                    <p className="text-rose-700 dark:text-rose-300 text-sm font-medium">{error}</p>
                </div>
            ) : data && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">

                    {/* MAIN CARD - Everything in one container */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

                        {/* HERO SECTION - Integrated at top */}
                        <div className="relative p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">

                            {/* Primary Info */}
                            <div className="flex flex-col gap-1">
                                {/* Primary Amount/Value */}
                                {(() => {
                                    const amountKey = heroFields.find(k => ['amount', 'balance', 'budget', 'revenue', 'profit', 'total', 'salary', 'price'].includes(k));
                                    if (amountKey) {
                                        return (
                                            <div className="flex flex-col items-end text-right w-full mb-2">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{getFieldLabel(amountKey)}</div>
                                                <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                                                    {formatValue(amountKey, data[amountKey])}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}

                                {/* Secondary Hero Fields - Row */}
                                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                                    {heroFields.filter(k => !['amount', 'balance', 'budget', 'revenue', 'profit', 'total', 'status', 'voucherStatus', 'workStatus', 'salary', 'price'].includes(k)).map(key => (
                                        <div key={key}>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{getFieldLabel(key)}</div>
                                            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">{formatValue(key, data[key])}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* TABS (If Groups Exist) - Sleek Integration */}
                        {groups && groups.length > 0 && (
                            <div className="flex overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                                {groups.map((group, idx) => {
                                    const isActive = activeTab === idx;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveTab(idx)}
                                            className={`flex-1 min-w-[max-content] px-4 py-2.5 text-xs font-semibold transition-colors text-center border-b-2 ${isActive
                                                ? 'text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                                                : 'text-slate-500 border-transparent hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            {group.title}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* CONTENT AREA - List View */}
                        <div className="px-5 pb-2">
                            {groups && groups.length > 0 ? (
                                <div className="flex flex-col animate-in fade-in slide-in-from-right-2 duration-200">
                                    {groups[activeTab].fields.map(key => (
                                        <CompactRow
                                            key={key}
                                            label={getFieldLabel(key)}
                                            value={formatValue(key, data[key])}
                                        />
                                    ))}
                                </div>
                            ) : (
                                detailFields.length > 0 && (
                                    <div className="flex flex-col">
                                        {detailFields.map(key => (
                                            <CompactRow
                                                key={key}
                                                label={getFieldLabel(key)}
                                                value={formatValue(key, data[key])}
                                            />
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* LISTS (Items, etc.) - Separate Card below */}
                    {['items', 'lines', 'products', 'tasks'].map(listKey => {
                        const items = data[listKey];
                        if (Array.isArray(items) && items.length > 0) {
                            return (
                                <div key={listKey} className="mt-4">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 pl-2 flex items-center justify-between">
                                        <span>{getFieldLabel(listKey)}</span>
                                        <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded text-[10px]">{items.length}</span>
                                    </h3>
                                    <div className="space-y-2">
                                        {items.map((item: any, idx: number) => (
                                            <ListItem
                                                key={idx}
                                                item={item}
                                                index={idx}
                                                currency={data.currency || 'TRY'}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}

                </div>
            )}
        </MobileContainer>
    );
};

export default DetailDashboard;
