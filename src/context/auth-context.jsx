import React, { createContext, useState, useEffect } from 'react';
import { api } from '@/services/api/auth-service.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const handleError = (err) => {
        const errorMessage = err.message;
        setError(errorMessage);
        setMessage(null);
    };

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const userData = await api.getUserInfo();
                setUser(userData.data);
            } catch (err) {
                handleError(err);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const register = async (credentials) => {
        setLoading(true);
        try {
            const userData = await api.register(credentials);
            setUser(userData.data);
            setMessage(null);
            setError(null);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        try {
            const userData = await api.login(credentials);
            setUser(userData.data);
            setMessage(null);
            setError(null);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await api.logout();
            setUser(null);
            setMessage(null);
            setError(null);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (credentials) => {
        try {
            const data = await api.verifyOtp(credentials);
            setMessage(data.message);
            setError(null);
        } catch (err) {
            handleError(err);
        }
    };

    const sendOtp = async (credentials) => {
        try {
            const data = await api.sendOtp(credentials);
            setMessage(data.message);
            setError(null);
        } catch (err) {
            handleError(err);
        }
    };

    const resetPassword = async (credentials) => {
        try {
            const data = await api.resetPassword(credentials);
            setMessage(data.message);
            setError(null);
        } catch (err) {
            handleError(err);
        }
    };

    const forgotPassword = async (credentials) => {
        try {
            const data = await api.forgotPassword(credentials);
            setMessage(data.message);
            setError(null);
        } catch (err) {
            handleError(err);
        }
    };

    const clearMessage = () => setMessage(null);
    const clearError = () => setError(null);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            message,
            login,
            logout,
            register,
            verifyOtp,
            sendOtp,
            resetPassword,
            forgotPassword,
            clearMessage,
            clearError
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
