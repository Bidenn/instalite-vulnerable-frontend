// apis/HomepageApi.ts
import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:5000/api/home';  // Your API endpoint

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
