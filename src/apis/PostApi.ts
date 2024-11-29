import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:5000/api/post';

interface CreatePostResponse {
    error?: string;
    message?: string;
}
interface ErrorResponse {
    error: string;
}

export const storePost = async (formData: FormData): Promise<CreatePostResponse> => {
    try {
        const response = await axios.post(`${API_URL}/store`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Post creation failed.' };
    }
};

interface DeletePostResponse {
    error?: string;
    message?: string;
}

export const deletePost = async (postId: string): Promise<DeletePostResponse> => {
    try {
        const response = await axios.delete(`${API_URL}/${postId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                postId,
            },
        });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Failed to delete post.' };
    }
};

export const detailPost = async (postId: string) => {
    try {
        const response = await axios.get(`${API_URL}/${postId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.error ?? 'Failed to fetch post details'
        );
    }
};