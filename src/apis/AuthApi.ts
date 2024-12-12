import axios, { AxiosError } from 'axios';

const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;
const API_URL = `${apiUrl}/api/auth`; 

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
}
interface LoginFormData {
    username: string;
    password: string;
  }

interface RegisterResponse {
  error?: string;
  message?: string;
}
interface LoginResponse {
    userId?: string;
    message?: string;
    error?: string;
}
interface ErrorResponse {
    error: string;
}

export const register = async (formData: RegisterFormData): Promise<RegisterResponse> => {
    try {
        const response = await axios.post(`${API_URL}/register`, formData);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Registration failed.' };
    }
};

export const login = async (formData: LoginFormData): Promise<LoginResponse> => {
    try {
        const response = await axios.post(`${API_URL}/login`, formData);
        return { message: response.data.message, userId: response.data.userId };
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