import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateUser, fetchUserWOP } from '../apis/UserApi';
import nullPhoto from './assets/images/avatar/NullUserPhoto.png'
import Swal from 'sweetalert2'; 

interface ProfileData {
    profilePhoto?: File | string;
    username: string;
    password: string;
    fullName?: string;
    career?: string;
    aboutMe?: string;
}

const EditProfile: React.FC = () => {
    const [profileData, setProfileData] = useState<ProfileData>({
        profilePhoto: '',
        username: '',
        password: '',
        fullName: '',
        career: '',
        aboutMe: '',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    
    const { userId } = useParams<{ userId: string }>();
    const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;

    useEffect(() => {
        if (userId) {
            const getUserProfile = async () => {
                try {
                    const response = await fetchUserWOP(Number(userId));
                    if (response.user) {
                        setProfileData({
                            ...response.user,
                        });
                        if (typeof response.user.profilePhoto === 'string') {
                            const imgNotNull = response.user.profilePhoto;
                            const imgUrl = `${apiUrl}/users/${imgNotNull}`;
                            setImagePreview(imgUrl); 
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            };
            getUserProfile();
        }
    }, [userId]);

    const handleChangeProfilePhoto = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileData((prevData) => ({
                ...prevData,
                profilePhoto: file,
            }));
            setImagePreview(URL.createObjectURL(file)); 
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (userId) {
            try {
                const formData = new FormData();
    
                // Add only non-empty or non-null values to FormData
                if (profileData.profilePhoto && profileData.profilePhoto instanceof File) {
                    formData.append('profilePhoto', profileData.profilePhoto); 
                }
                if (profileData.username) {
                    formData.append('username', profileData.username);
                }
                if (profileData.password) {
                    formData.append('password', profileData.password);
                }
                if (profileData.fullName !== undefined && profileData.fullName !== null) {
                    formData.append('fullName', profileData.fullName);
                }
                if (profileData.career !== undefined && profileData.career !== null) {
                    formData.append('career', profileData.career);
                }
                if (profileData.aboutMe !== undefined && profileData.aboutMe !== null) {
                    formData.append('aboutMe', profileData.aboutMe);
                }
    
                const response = await updateUser(Number(userId), formData);
                if (response.message) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Profile updated successfully.',
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    });
                    setTimeout(() => {
                        navigate(`/profile/${userId}`); // Navigate to updated profile
                    }, 1500);
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: response.error ?? 'Failed to update profile',
                        icon: 'error',
                        confirmButtonText: 'Try Again'
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'An error occurred while updating the profile.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                console.error('Update profile error:', error);
            }
        }
    };    

    const displayProfilePicture = imagePreview 
        ? imagePreview 
        : (profileData.profilePhoto ? `${apiUrl}/users/${profileData.profilePhoto}` : nullPhoto);

    return (
        <div className="page-wraper header-fixed">
            <header className="header bg-white">
                <div className="container">
                    <div className="main-bar">
                        <div className="left-content">
                            <a href={`/profile/${localStorage.getItem('userId')}`} className="back-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </a>
                            <h4 className="title mb-0">Edit Profile</h4>
                        </div>
                        <div className="mid-content"></div>
                    </div>
                </div>
            </header>
            <div className="page-content">
                <div className="container">
                    <div className="edit-profile">
                        <div className="profile-image">
                            <div className={`media media-100 rounded-circle`}>
                                <img 
                                    src={displayProfilePicture} 
                                    alt="Profile Photo" 
                                />
                            </div>
                            <a href="javascript:void(0);" onClick={handleChangeProfilePhoto}>Change profile photo</a>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-3">
                                <p style={{ textAlign: 'left', marginBottom: '5px' }}>Username</p>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    value={profileData.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <p style={{ textAlign: 'left', marginBottom: '5px' }}>Password</p>
                                <input
                                    type="text"
                                    name="password"
                                    className="form-control"
                                    value={profileData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <p style={{ textAlign: 'left', marginBottom: '5px' }}>Full Name</p>
                                <input
                                    type="text"
                                    name="fullName"
                                    className="form-control"
                                    value={profileData.fullName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <p style={{ textAlign: 'left', marginBottom: '5px' }}>Career</p>
                                <input
                                    type="text"
                                    name="career"
                                    className="form-control"
                                    value={profileData.career ?? ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <p style={{ textAlign: 'left', marginBottom: '5px' }}>Bio</p>
                                <textarea
                                    name="aboutMe"
                                    className="form-control"
                                    value={profileData.aboutMe ?? ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
