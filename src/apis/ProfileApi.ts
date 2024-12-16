import axios from 'axios';

const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;
const API_BASE_URL = `${apiUrl}/api/profile`; 

const getAuthUsername = (): string | null => {
    return localStorage.getItem('loggedUser');
};

export const fetchEditProfile = async (loggedUser: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/edit`,{
            params: {loggedUser}
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error ?? 'Failed to fetch profile data for editing');
    }
};

export const fetchProfileData = async () => {
    try {
        const loggedUser = getAuthUsername();
        const response = await axios.get(`${API_BASE_URL}/profile`, {
            params: { loggedUser },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error ?? 'Failed to fetch profile with posts');
    }
};

export const updateProfileData = async (loggedUser: string, formData: FormData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            params: {
                'loggedUser' : loggedUser
            }
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error ?? 'Failed to send profile data');
    }
};

export const checkUsernameAvailability = async (username: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/check-username`, {
            params: { username },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error ?? 'Failed to check username availability');
    }
};

export const fetchPublicProfile = async (username: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${username}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error ?? 'Failed to fetch profile with posts');
    }
};

export const searchUsername = async (query: string) => {
    try {
        const loggedUser = getAuthUsername();
        const response = await axios.get(`${API_BASE_URL}/search/${query}`, {
            params: { loggedUser },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error ?? 'Failed to search for username');
    }
};