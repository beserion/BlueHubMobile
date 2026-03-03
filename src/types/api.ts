// ========================
// Request DTOs
// ========================

export interface LoginRequest {
    email?: string;
    userName?: string;
    password?: string;
}

export interface GeneralDashboardDto {
    companyId: number;
    key: string;
    label: string;
    value: number;
    valueFormatted: string;
    changePercent: number;
    compareLabel: string;
    isPositiveGood: boolean;
}

export interface FinOperationalDashboardFilterDto {
    companyId: number;
    branchId: number;
    vesselId: number;
    currency?: string;
    startDate?: string;
    endDate?: string;
    period?: string;
}

export interface OfferViewParams {
    companyId?: number;
    kriter?: string;
    startRow?: number;
    endRow?: number;  // default: 50
}

export interface RequestViewParams {
    companyId?: number;
    kriter?: string;
    startRow?: number;
    endRow?: number;  // default: 100
}

export interface ProjectListParams {
    CompanyId?: number;
    Kriter?: string;
    CompanyList?: Array<{ text?: string; value?: string; selected?: boolean; disabled?: boolean }>;
}

export interface ProjectDocumentsParams {
    id?: number;
    companyId?: number;
}

export interface DashboardQueryParams {
    companyId?: number;
    userId?: number;
    period?: string;
}

export interface CustomersByChannelParams {
    companyId?: number;
    channelId?: number;
    period?: string;
}

export interface QuotesByCustomerParams {
    companyId?: number;
    customerId?: number;
}

export interface SalesmanBonusParams {
    target?: number;
    actual?: number;
    commissionRate?: number;
    bonusRate?: number;
}

export interface DeliveryViewParams {
    companyId?: number;
    type?: number; // DeliveryType enum: 1,2,3,4
    startDate?: string;
    endDate?: string;
}

export interface InvoiceViewParams {
    companyId?: number;
    invoiceType?: number;
    partnerId?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
}

export interface PaymentViewParams {
    companyId?: number;
    paymentType?: number; // PaymentType enum: 1,2,3,4
    startDate?: string;
    endDate?: string;
    currency?: string;
    kriter?: string;
    currentpage?: number;
    pagesize?: number;
}

export interface VesselVisitViewParams {
    companyId?: number;
    startDate?: string;
    endDate?: string;
    kriter?: string;
    startRow?: number;
    endRow?: number;
}

export interface VoucherViewParams {
    companyId?: number;
    voucherType?: number; // VoucherType enum
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
}

export interface OrderListParams {
    companyId?: number;
    kriter?: string;
    startRow?: number;
    endRow?: number;  // default: 100
}

export interface TodoViewParams {
    companyId?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
    kriter?: string;
    startRow?: number;
    endRow?: number;
}

export interface AttendanceListParams {
    employeeId?: number;
    date?: string;
}

export interface AttendanceReportParams {
    employeeId?: number;
    departmentId?: number;
    status?: number; // AttendanceStatus enum: 1-6
    startDate?: string;
    endDate?: string;
}

export interface IncomeStatementParams {
    companyId?: number;
    startDate?: string;
    endDate?: string;
}

export interface PartnerBalanceParams {
    companyId?: number;
    kriter?: string;
    startDate?: string;
    endDate?: string;
    startRow?: number;
    endRow?: number;
}

// ========================
// Response Types
// ========================

export interface ApiResponse<T = any> {
    data: T;
    success: boolean;
    message?: string;
}

export interface UserInfo {
    id?: string;
    userName?: string;
    email?: string;
    name?: string;
    companyId?: number;
    branchId?: number;
    roles?: string[];
}

export interface LoginResponse {
    success?: boolean;
    token?: string;
    expiresUtc?: string;
    user?: UserInfo;
}

// Backward compat alias
export type AuthUser = UserInfo;

export interface Ship {
    id: number;
    name: string;
    type: string;
    flag: string;
    imo: string;
    status: string;
    buildYear: number;
    capacity: string;
}

export interface Service {
    id: number;
    serviceNo: string;
    subject: string;
    vessel: string;
    status: string;
    date: string;
    description: string;
    technician: string;
}
