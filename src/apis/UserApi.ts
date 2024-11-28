import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:5000/api/users';

// Updated UserData interface with all necessary fields
interface UserData {
  username: string;
  fullName: string;
  career?: string;
  aboutMe?: string;
  profilePhoto?: string;
}

interface PostData {
  id: string;
  content: string;
  caption: string;
}

interface UserResponse {
  message: string;
  error?: string;
  user?: UserData;
  posts?: PostData[];  // To include posts if necessary
}

// Fetch user data by ID, including posts (With Posts)
export const fetchUserWP = async (userId: number): Promise<{ user: UserData | null, posts: PostData[] | null }> => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    const user = response.data.user;
    const posts = response.data.posts;  // Assuming posts are part of the response

    return {
      user: {
        username: user.username,
        fullName: user.fullName,
        career: user.career,
        aboutMe: user.aboutMe,
        profilePhoto: user.profilePhoto,
      },
      posts: posts || [],  // Handle case where no posts exist
    };
  } catch (error) {
    console.error('Failed to fetch user with posts:', error);
    return { user: null, posts: null };
  }
};

// Fetch user data by ID, without posts (For Update Purpose)
export const fetchUserWOP = async (userId: number): Promise<{ user: UserData | null }> => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/edit`);
    const user = response.data.user;

    return {
      user: {
        username: user.username,
        fullName: user.fullName,
        career: user.career,
        aboutMe: user.aboutMe,
        profilePhoto: user.profilePhoto,
      },
    };
  } catch (error) {
    console.error('Failed to fetch user without posts:', error);
    return { user: null };
  }
};

// Update user data
export const updateUser = async (
  userId: number,
  formData: FormData
): Promise<UserResponse> => {
  try {
    const response: AxiosResponse<UserResponse> = await axios.put(
      `${API_URL}/${userId}/update`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Update user error:', error.response?.data || error.message);
      return { message: 'Failed to update user', error: error.message };
    } else {
      console.error('Unknown error:', error);
      return {
        message: 'Failed to update user',
        error: 'An unknown error occurred',
      };
    }
  }
};



