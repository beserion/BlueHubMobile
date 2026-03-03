// ============================================================
// BlueHUB — SignalR Real-Time Service Layer
// ============================================================

import * as signalR from '@microsoft/signalr';

// ── Configuration ──────────────────────────────────────────
const HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL
    || `${import.meta.env.VITE_API_BASE_URL || ''}/hubs/dashboard`;

// ── Connection State ───────────────────────────────────────
export type SignalRConnectionState = 'Disconnected' | 'Connecting' | 'Connected' | 'Reconnecting';

let connection: signalR.HubConnection | null = null;
let stateListeners: Array<(state: SignalRConnectionState) => void> = [];

function notifyStateChange(state: SignalRConnectionState) {
    stateListeners.forEach(fn => fn(state));
}

// ── Build Connection ───────────────────────────────────────
function buildConnection(token: string): signalR.HubConnection {
    return new signalR.HubConnectionBuilder()
        .withUrl(HUB_URL, {
            accessTokenFactory: () => token,
            transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
            withCredentials: false,
        })
        .withAutomaticReconnect({
            nextRetryDelayInMilliseconds: (retryContext) => {
                // Exponential backoff: 0s, 2s, 5s, 10s, 30s, then every 30s
                const delays = [0, 2000, 5000, 10000, 30000];
                return delays[Math.min(retryContext.previousRetryCount, delays.length - 1)];
            },
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();
}

// ── Public API ─────────────────────────────────────────────

/**
 * Start the SignalR connection. If already connected, does nothing.
 * @param token - Bearer token for authentication
 */
export async function startConnection(token: string): Promise<void> {
    // If connection exists and is connected, skip
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
        return;
    }

    // If connection exists but is in a bad state, dispose it
    if (connection) {
        try { await connection.stop(); } catch { /* ignore */ }
        connection = null;
    }

    connection = buildConnection(token);

    // Wire up lifecycle events
    connection.onreconnecting(() => {
        console.log('[SignalR] Reconnecting...');
        notifyStateChange('Reconnecting');
    });

    connection.onreconnected((connectionId) => {
        console.log('[SignalR] Reconnected:', connectionId);
        notifyStateChange('Connected');
    });

    connection.onclose((error) => {
        console.log('[SignalR] Closed:', error?.message || 'No error');
        notifyStateChange('Disconnected');
    });

    // Start
    notifyStateChange('Connecting');
    try {
        await connection.start();
        console.log('[SignalR] Connected to', HUB_URL);
        notifyStateChange('Connected');
    } catch (err) {
        console.error('[SignalR] Connection failed:', err);
        notifyStateChange('Disconnected');
    }
}

/**
 * Stop the SignalR connection gracefully.
 */
export async function stopConnection(): Promise<void> {
    if (connection) {
        try {
            await connection.stop();
        } catch (err) {
            console.error('[SignalR] Error stopping connection:', err);
        }
        connection = null;
        notifyStateChange('Disconnected');
    }
}

/**
 * Get the current HubConnection instance (may be null).
 */
export function getConnection(): signalR.HubConnection | null {
    return connection;
}

/**
 * Get the current connection state.
 */
export function getConnectionState(): SignalRConnectionState {
    if (!connection) return 'Disconnected';
    switch (connection.state) {
        case signalR.HubConnectionState.Connected: return 'Connected';
        case signalR.HubConnectionState.Connecting: return 'Connecting';
        case signalR.HubConnectionState.Reconnecting: return 'Reconnecting';
        default: return 'Disconnected';
    }
}

/**
 * Subscribe to a hub event.
 */
export function on(event: string, callback: (...args: any[]) => void): void {
    connection?.on(event, callback);
}

/**
 * Unsubscribe from a hub event.
 */
export function off(event: string, callback: (...args: any[]) => void): void {
    connection?.off(event, callback);
}

/**
 * Invoke a hub method.
 */
export async function invoke(method: string, ...args: any[]): Promise<any> {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
        return connection.invoke(method, ...args);
    }
    console.warn('[SignalR] Cannot invoke — not connected');
}

/**
 * Listen for connection state changes.
 */
export function onStateChange(listener: (state: SignalRConnectionState) => void): () => void {
    stateListeners.push(listener);
    return () => {
        stateListeners = stateListeners.filter(fn => fn !== listener);
    };
}

// ── Hub Event Names ────────────────────────────────────────
// Centralized event name constants for consistency
export const HubEvents = {
    // Notifications
    ReceiveNotification: 'ReceiveNotification',

    // Dashboard
    DashboardUpdated: 'DashboardUpdated',

    // Sales
    OrderUpdated: 'OrderUpdated',
    OfferUpdated: 'OfferUpdated',
    RequestUpdated: 'RequestUpdated',

    // Finance
    InvoiceUpdated: 'InvoiceUpdated',
    PaymentUpdated: 'PaymentUpdated',
    VoucherUpdated: 'VoucherUpdated',

    // Projects
    ProjectUpdated: 'ProjectUpdated',

    // Purchase
    PurchaseUpdated: 'PurchaseUpdated',

    // HR
    HRUpdated: 'HRUpdated',

    // Inventory
    InventoryUpdated: 'InventoryUpdated',

    // Logistic
    LogisticUpdated: 'LogisticUpdated',

    // Partners
    PartnerUpdated: 'PartnerUpdated',

    // Todo
    TodoUpdated: 'TodoUpdated',

    // Vessel
    VesselVisitUpdated: 'VesselVisitUpdated',

    // Delivery
    DeliveryUpdated: 'DeliveryUpdated',
} as const;

export type HubEventName = typeof HubEvents[keyof typeof HubEvents];
