import axios, { AxiosError } from 'axios';

const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;
const API_URL = `${apiUrl}/api/home`; 

interface HomepageResponse {
    message: string;
    posts: any[];
    loggedUser: string;
}

interface ErrorResponse {
    error: string;
}

export const fetchHomepagePosts = async (loggedUser: string): Promise<HomepageResponse | ErrorResponse> => {
    try {
        const response = await axios.get(API_URL, {
            params: { loggedUser },
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Failed to fetch posts.' };
    }
};
