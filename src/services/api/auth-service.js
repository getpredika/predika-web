const API_URL = import.meta.env.VITE_API_URL;

const fetchApi = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: options.method || 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return response.json();
};

export const api = {
    register: (data) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => fetchApi('/auth/logout', { method: 'POST' }),
    verifyOtp: (data) => fetchApi('/auth/verify-email', { method: 'POST', body: JSON.stringify(data) }),
    sendOtp: (data) => fetchApi('/auth/otp/send', { method: 'POST', body: JSON.stringify(data) }),
    resetPassword: (data) => fetchApi('/auth/password/reset', { method: 'POST', body: JSON.stringify(data) }),
    forgotPassword: (data) => fetchApi('/auth/password/forgot', { method: 'POST', body: JSON.stringify(data) }),
    getUserInfo: () => fetchApi('/auth/me', { method: 'GET' }),
};
