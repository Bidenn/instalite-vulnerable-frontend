import axios, { AxiosError } from 'axios';

const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;
const API_URL = `${apiUrl}/api/post`;

interface CreatePostResponse {
    error?: string;
    message?: string;
}

interface ErrorResponse {
    error: string;
}

interface DeletePostResponse {
    error?: string;
    message?: string;
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

export const toggleLikePost = async (postId: string, loggedUser: string) => {
    try {
        const response = await axios.post(`${API_URL}/toggle-like`, { postId, loggedUser });
        return response.data;
    } catch (error: any) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Failed to like post.' };
    }
};

export const storeComment = async (postId: string, comment: string, loggedUser: string) => {
    try {
        const response = await axios.post(`${API_URL}/${postId}/comment`, { postId, comment, loggedUser });
        return response.data;
    } catch (error: any) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Failed to add comment.' };
    }
};

// export const editComment = async (commentId: string, newComment: string) => {
//     try {
//         const response = await axios.put(`${API_URL}/comment/${commentId}`, { newComment });
//         return response.data;
//     } catch (error: any) {
//         const err = error as AxiosError<ErrorResponse>;
//         return { error: err.response?.data?.error ?? 'Failed to edit comment.' };
//     }
// };

// export const updateComment = async (commentId: string, newComment: string) => {
//     try {
//         const response = await axios.put(`${API_URL}/comment/${commentId}`, { newComment });
//         return response.data;
//     } catch (error: any) {
//         const err = error as AxiosError<ErrorResponse>;
//         return { error: err.response?.data?.error ?? 'Failed to update comment.' };
//     }
// };

export const deleteComment = async (commentId: string) => {
    try {
        const response = await axios.delete(`${API_URL}/comment/${commentId}`);
        return response.data;
    } catch (error: any) {
        const err = error as AxiosError<ErrorResponse>;
        return { error: err.response?.data?.error ?? 'Failed to delete comment.' };
    }
};
