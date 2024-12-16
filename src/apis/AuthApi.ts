import axios, { AxiosError } from 'axios';

const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;
const API_URL = `${apiUrl}/api/auth`; 

interface RegisterResponse {
    error?: string;
    message?: string;
}
interface LoginResponse {
    loggedUser?: string;
    message?: string;
    error?: string;
}
interface ErrorResponse {
    error: string;
}

export const register = async (payload: { email: string; password: string }): Promise<RegisterResponse> => {
    try {
        const response = await axios.post(`${API_URL}/register`, payload);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Registration failed.' };
    }
};

export const login = async (payload: { UsernameOrEmail: string; Password: string }): Promise<LoginResponse> => {
    try {
        const response = await axios.post(`${API_URL}/login`, payload);
        return { message: response.data.message, loggedUser: response.data.loggedUser };
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        return { error: err.response?.data?.error ?? 'Login failed.' };
    }
};

export const logout = async (): Promise<void> => {
    try {
        await axios.post(`${API_URL}/logout`);
    } catch (error) {
        console.error('Logout failed:', error);
    }
};