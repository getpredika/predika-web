import React, {createContext, useState, useEffect} from 'react';
const API_URL = 'https://api.predika.app';

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return response.json();
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch(`${API_URL}/auth/me`, {
                    method: "GET",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const userData = await handleResponse(response);
                setUser(userData.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    // Register function
    const register = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await handleResponse(response);
            setUser(data.data.user);
        } catch (err) {
            throw err.message;
        }
    };

    // Login function
    const login = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await handleResponse(response);
            setUser(data.data);
        } catch (err) {
            throw err.message;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
            });

            await handleResponse(response);
            setUser(null);
        } catch (err) {
            throw err.message;
        }
    };

    // Verify OTP function
    const verifyOtp = async (data) => {
        try {
            const response = await fetch(`${API_URL}/auth/verify-email`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            await handleResponse(response);
        } catch (err) {
            throw err.message;
        }
    };

    // Send OTP function
    const sendOtp = async (data) => {
        try {
            const response = await fetch(`${API_URL}/auth/otp/send`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            await handleResponse(response);
        } catch (err) {
            throw err.message;
        }
    };

    // Reset Password function
    const resetPassword = async (data) => {
        try {
            const response = await fetch(`${API_URL}/auth/password/reset`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            console.log(JSON.stringify(data))
            await handleResponse(response);
        } catch (err) {
            throw err.message;
        }
    };

    // Forgot Password function
    const forgotPassword = async (data) => {
        try {
            const response = await fetch(`${API_URL}/auth/password/forgot`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            await handleResponse(response);
        } catch (err) {
            throw err.message;
        }
    };

    const googleRedirect = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            login,
            logout,
            register,
            verifyOtp,
            sendOtp,
            resetPassword,
            forgotPassword,
            googleRedirect,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
