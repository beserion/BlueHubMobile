import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, getMe } from '../services/api';
import type { LoginRequest, AuthUser } from '../types/api';

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem('auth_token')
    );
    const [isLoading, setIsLoading] = useState(true);

    // On mount, if token exists, fetch current user
    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const userData = await getMe();
                    setUser(userData);
                } catch {
                    // Token invalid — clear it
                    localStorage.removeItem('auth_token');
                    setToken(null);
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (credentials: LoginRequest) => {
        const response = await apiLogin(credentials);
        if (response?.token) {
            setToken(response.token);
            // Fetch user info
            try {
                const userData = await getMe();
                setUser(userData);
            } catch {
                setUser(response.user || null);
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
