import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/css/style.css';
import nullPhoto from './assets/images/avatar/NullUserPhoto.png';
import Menubar from './Menubar';
import { fetchUserWP } from '../apis/UserApi';
import { logout } from '../apis/AuthApi';

interface UserData {
    username?: string;
    fullName?: string;
    profilePhoto?: string;
    aboutMe?: string;
    career?: string;
}

interface PostData {
    id: string;
    content: string;
    caption: string;
}

const Profile: React.FC = () => {
    const [user, setUser] = useState<UserData>({
        username: '',
        fullName: '',
        profilePhoto: '',
        aboutMe: '',
        career: '',
    });

    const [posts, setPosts] = useState<PostData[]>([]);
    const navigate = useNavigate();

    // Retrieve the userId from localStorage
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? Number(userIdString) : null;

    // Redirect to login page if userId is not available in localStorage
    useEffect(() => {
        if (!userId) {
            navigate('/login');
        } else {
            const loadUserData = async () => {
                try {
                    const userData = await fetchUserWP(userId);
                    if (userData.user) {
                        setUser(userData.user);
                    }
                    if (userData.posts) {
                        setPosts(userData.posts);
                    }
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            };
            loadUserData();
        }
    }, [userId, navigate]);

    useEffect(() => {
        console.log('User Data Updated:', user); // Debugging line to log user data
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <div className="page-wraper header-fixed">
            <header className="header">
                <div className="container">
                    <div className="main-bar">
                        <div className="left-content">
                            <a href="/Home" className="back-btn">
                                <i className="fa-solid fa-arrow-left"></i>
                            </a>
                            <h4 className="title mb-0">Profile</h4>
                        </div>
                        <div className="mid-content">
                        </div>
                        <div className="right-content">
                            <a onClick={handleLogout} className="item-content item-link filter m-0">
                                <div className="dz-icon icon-sm">
                                    <svg height="512" viewBox="0 0 32 32" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m29.44 16.43a1.15 1.15 0 0 0 -.24-1.23l-3.2-3.2a1.12 1.12 0 0 0 -1.59 1.59l1.26 1.26h-7.28a1.12 1.12 0 0 0 0 2.25h7.29l-1.26 1.26a1.12 1.12 0 1 0 1.58 1.64l3.18-3.18a1.12 1.12 0 0 0 .26-.39z" /><path d="m21.6 20.43a1.12 1.12 0 0 0 -1.12 1.12v4.57a1.13 1.13 0 0 1 -1.12 1.12h-4.5v-22.49h4.5a1.13 1.13 0 0 1 1.12 1.12v4.43a1.12 1.12 0 1 0 2.25 0v-4.42a3.38 3.38 0 0 0 -3.37-3.37h-4.63a3.36 3.36 0 0 0 -4.32-2.33l-5.63 1.87a3.37 3.37 0 0 0 -2.31 3.2v21.5a3.37 3.37 0 0 0 2.31 3.2l5.62 1.88a3.4 3.4 0 0 0 1.08.18 3.37 3.37 0 0 0 3.24-2.51h4.62a3.38 3.38 0 0 0 3.37-3.37v-4.57a1.12 1.12 0 0 0 -1.11-1.13zm-9 8.19a1.13 1.13 0 0 1 -1.48 1.07l-5.62-1.88a1.13 1.13 0 0 1 -.77-1.07v-21.49a1.13 1.13 0 0 1 .77-1.06l5.62-1.88a1.13 1.13 0 0 1 1.48 1.07z" /></svg>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <div className="page-content">
                <div className="container profile-area">
                    <div className="profile">
                        <div className="main-profile">
                            <div className="left-content">
                                <span>@{user.username}</span>
                                <h5 className="mt-1">{user.fullName || 'Full Name'}</h5>
                                <h6 className="text-primary font-w400">{user.career || 'Career'}</h6>
                            </div>
                            <div className="right-content">
                                <div className="upload-box">
                                    {/* Ensure profilePhoto is a valid URL */}
                                    <img
                                        src={user.profilePhoto ? `${"http://localhost:5000/users/" + user.profilePhoto}` : nullPhoto}
                                        alt="profile"
                                    />

                                    <button className="upload-btn" onClick={() => navigate('edit')}>
                                        <i className="fa-solid fa-pencil"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="info">
                            <h6>About Me</h6>
                            <p>{user.aboutMe || 'No details provided'}</p>
                        </div>
                    </div>
                    <div className="contant-section">
                        <div className="title-bar my-2">
                            <h6 className="mb-0">My Posts</h6>
                        </div>
                        <div className="dz-lightgallery style-2">
                            {posts.map((post) => (
                                <a key={post.id} className="gallery-box" href={`/posts/${post.id}`}>
                                    <img
                                        src={"http://localhost:5000/posts/"+post.content}
                                        alt="this is user posts"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Menubar />
        </div>
    );
};



export default Profile;