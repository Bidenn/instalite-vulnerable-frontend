// apis/HomepageApi.ts
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

// Update the function to accept userId as a parameter
export const fetchHomepagePosts = async (userId: string): Promise<HomepageResponse | ErrorResponse> => {
    try {
        const response = await axios.get(API_URL, {
            params: { userId },
        });
        return response.data;

    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Failed to fetch posts.' };
    }
};
