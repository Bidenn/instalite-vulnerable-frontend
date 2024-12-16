import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/css/style.css';
import nullPhoto from '../../assets/images/avatar/NullUserPhoto.png';
import Menubar from '../shared/Menubar';
import { fetchPublicProfile } from '../../../apis/ProfileApi'; 

interface UserData {
    username?: string;
    fullname?: string;
    photo?: string;
    career?: string;
    bio?: string;
}

interface PostData {
    id: string;
    content: string;
    caption: string;
}

const PublicProfile: React.FC = () => {
    const { username } = useParams();
    const [user, setUser] = useState<UserData>({
        username: '',
        fullname: '',
        photo: '',
        career: '',
        bio: '',
    });

    const [posts, setPosts] = useState<PostData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const loggedUser = localStorage.getItem('loggedUser');
    const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;

    useEffect(() => {
        if (!loggedUser) {
            navigate('/login');
        } else if (username) {
            const loadUserData = async () => {
                try {
                    const data = await fetchPublicProfile(username);
                    const userData = data.user;
                    if (userData) {
                        setUser({
                            username: userData.username,
                            fullname: userData.fullname,
                            photo: userData.photo,
                            career: userData.career,
                            bio: userData.bio,
                        });
                        setPosts(data.posts ?? []); 
                    } else if ('error' in data) {
                        setError(data.error); 
                    } else {
                        setError('Unexpected data structure.');
                    }
                } catch (error) {
                    console.error('Failed to fetch user data with posts:', error);
                    setError('An error occurred while fetching data.');
                }
            };
            loadUserData();
        }
    }, [loggedUser, username, navigate]);

    return (
        <div className="page-wraper header-fixed">
            <header className="header">
                <div className="container">
                    <div className="main-bar">
                        <div className="left-content">
                            <a href="/home" className="back-btn">
                                <i className="fa-solid fa-arrow-left"></i>
                            </a>
                            <h4 className="title mb-0">Profile</h4>
                        </div>
                    </div>
                </div>
            </header>
            <div className="page-content">
                <div className="container profile-area">
                    {error && <div className="error-message">{error}</div>}
                    <div className="profile">
                        <div className="main-profile">
                            <div className="left-content">
                                <span>@{user.username}</span>
                                <h5 className="mt-1">{user.fullname ?? '-'}</h5>
                                <h6 className="text-primary font-w400">{user.career ?? '-'}</h6>
                            </div>
                            <div className="right-content">
                                <div className="upload-box">
                                    <img src={ user.photo ? `${apiUrl}/users/${user.photo}` : nullPhoto } alt="profile"/>
                                </div>
                            </div>
                        </div>
                        <div className="info">
                            <h6>Bio</h6>
                            <p>{user.bio ?? 'No details provided'}</p>
                        </div>
                    </div>
                    <div className="contant-section">
                        <div className="dz-lightgallery style-2">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <a key={post.id} className="gallery-box" href={`/posts/${post.id}`}>
                                        <img
                                            src={`${apiUrl}/posts/${post.content}`}
                                            alt="user post"
                                        />
                                    </a>
                                ))
                            ) : (
                                <p></p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Menubar />
        </div>
    );
};

export default PublicProfile;
