// ============================================================
// BlueHUB — SignalR React Context
// ============================================================
// Provides SignalR connection lifecycle + event subscription
// to all child components via useSignalR() hook.

import React, { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import {
    startConnection,
    stopConnection,
    getConnectionState,
    onStateChange,
    on,
    off,
    invoke as hubInvoke,
    type SignalRConnectionState,
    type HubEventName,
} from '../services/signalr';
import { useAuth } from './AuthContext';

// ── Context Type ───────────────────────────────────────────
interface SignalRContextType {
    /** Current connection state */
    connectionState: SignalRConnectionState;
    /** Simplified boolean status */
    isConnected: boolean;
    /** Subscribe to a hub event. Returns unsubscribe function. */
    subscribe: (event: HubEventName | string, handler: (...args: any[]) => void) => () => void;
    /** Invoke a hub method */
    invoke: (method: string, ...args: any[]) => Promise<any>;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────
export const SignalRProvider = ({ children }: { children: ReactNode }) => {
    const { token, isAuthenticated } = useAuth();
    const [connectionState, setConnectionState] = useState<SignalRConnectionState>('Disconnected');
    const tokenRef = useRef(token);
    tokenRef.current = token;

    // Listen for state changes
    useEffect(() => {
        const unsubscribe = onStateChange((state) => {
            setConnectionState(state);
        });
        // Set initial state
        setConnectionState(getConnectionState());
        return unsubscribe;
    }, []);

    // Start/stop connection based on auth state
    useEffect(() => {
        if (isAuthenticated && token) {
            startConnection(token);
        } else {
            stopConnection();
        }

        return () => {
            // Cleanup on unmount
            stopConnection();
        };
    }, [isAuthenticated, token]);

    // Subscribe helper
    const subscribe = useCallback(
        (event: HubEventName | string, handler: (...args: any[]) => void): (() => void) => {
            on(event, handler);
            return () => off(event, handler);
        },
        []
    );

    // Invoke helper
    const invoke = useCallback(
        async (method: string, ...args: any[]): Promise<any> => {
            return hubInvoke(method, ...args);
        },
        []
    );

    const isConnected = connectionState === 'Connected';

    return (
        <SignalRContext.Provider value={{ connectionState, isConnected, subscribe, invoke }}>
            {children}
        </SignalRContext.Provider>
    );
};

// ── Hook ───────────────────────────────────────────────────

/**
 * Access SignalR connection state and subscribe to hub events.
 *
 * @example
 * ```tsx
 * const { connectionState, subscribe } = useSignalR();
 *
 * useEffect(() => {
 *     const unsub = subscribe('OrderUpdated', (data) => {
 *         console.log('Order updated:', data);
 *         refetchOrders();
 *     });
 *     return unsub;
 * }, [subscribe]);
 * ```
 */
export const useSignalR = (): SignalRContextType => {
    const context = useContext(SignalRContext);
    if (context === undefined) {
        throw new Error('useSignalR must be used within a SignalRProvider');
    }
    return context;
};

// ── Convenience Hook ───────────────────────────────────────

/**
 * Subscribe to a specific hub event with auto-cleanup.
 * Calls the handler whenever the event fires.
 * Optionally calls `onEvent` when the event fires for side effects like refetching.
 *
 * @example
 * ```tsx
 * useSignalREvent('OrderUpdated', () => {
 *     refetchOrders();
 * });
 * ```
 */
export const useSignalREvent = (
    event: HubEventName | string,
    handler: (...args: any[]) => void,
    deps: any[] = []
) => {
    const { subscribe } = useSignalR();

    useEffect(() => {
        const unsub = subscribe(event, handler);
        return unsub;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscribe, event, ...deps]);
};
