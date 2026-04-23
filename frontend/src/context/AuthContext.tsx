import React, { createContext, useState, useContext, type ReactNode, useEffect } from "react";
import type { Users } from "../types";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { authService } from "../services/AuthService";

interface AuthContextType {
    user: Users | null;
    isLoading: boolean;
    login: (userData: Users) => void;
    logout: () => void;
    refreshToken: () => Promise<boolean>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isTokenExpired = (token: string | undefined): boolean => {
    if (!token) return true;

    try {
        const decoded: any = jwtDecode(token);
        console.log(decoded);
        
        const currentTime = Date.now() / 1000; // Convert ke detik
        return decoded.exp < currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Users | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const refreshIntervalRef = React.useRef<number | null>(null);

    const refreshAccessToken = async () => {
        try {
            const result = await authService.RefreshToken();
            if (!result.status) {
                // Refresh token expired, logout user
                logout();
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            logout();
        }
    };

    const refreshToken = async (): Promise<boolean> => {
        try {
            const result = await authService.RefreshToken();
            return result.status;
        } catch (error) {
            console.error('Error refreshing token:', error);
            return false;
        }
    };

    const login = (userData: Users) => {
        setUser(userData);
        // Simpan user data ke localStorage
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const accessToken = Cookies.get('accessToken');

        if (storedUser && !isTokenExpired(accessToken)) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);

            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('user');
            }
        } else if (storedUser && isTokenExpired(accessToken)) {
            window.location.href = '/login'
            logout();
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (user) {
            refreshIntervalRef.current = setInterval(() => {
                refreshAccessToken();
            }, 10 * 60 * 1000);
        }

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook untuk menggunakan AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};