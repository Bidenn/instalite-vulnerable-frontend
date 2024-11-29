import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateUser, fetchUserWOP } from '../apis/UserApi';
import nullPhoto from './assets/images/avatar/NullUserPhoto.png'
import Swal from 'sweetalert2'; // Import SweetAlert2

interface ProfileData {
    fullName: string;
    career?: string;
    aboutMe?: string;
    profilePhoto?: File | string;
    username: string;
    password: string;
}

const EditProfile: React.FC = () => {
    const [profileData, setProfileData] = useState<ProfileData>({
        fullName: '',
        career: '',
        aboutMe: '',
        profilePhoto: '',
        username: '',
        password: '',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    
    const { userId } = useParams<{ userId: string }>();

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
                            setImagePreview(response.user.profilePhoto);
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
                formData.append('fullName', profileData.fullName);
                formData.append('career', profileData.career || '');
                formData.append('aboutMe', profileData.aboutMe || '');
                formData.append('username', profileData.username);
                formData.append('password', profileData.password);

                if (profileData.profilePhoto && profileData.profilePhoto instanceof File) {
                    formData.append('profilePhoto', profileData.profilePhoto);
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
                        text: response.error || 'Failed to update profile',
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
                        <div className="right-content">
                            <a href={`/profile/${localStorage.getItem('userId')}`} className="text-dark font-20">
                                <i className="fa-solid fa-check"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </header>
            <div className="page-content">
                <div className="container">
                    <div className="edit-profile">
                        <div className="profile-image">
                            <div className="media media-100 rounded-circle">
                                <img src={imagePreview ? `${"http://localhost:5000/users/" + imagePreview}` : nullPhoto} alt="Profile" />
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
                            <div className="mb-3 input-group input-mini">
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    placeholder="Username"
                                    value={profileData.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3 input-group input-mini">
                                <input
                                    type="text"
                                    name="password"
                                    className="form-control"
                                    placeholder="Username"
                                    value={profileData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3 input-group input-mini">
                                <input
                                    type="text"
                                    name="fullName"
                                    className="form-control"
                                    placeholder="Full Name"
                                    value={profileData.fullName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3 input-group input-mini">
                                <input
                                    type="text"
                                    name="career"
                                    className="form-control"
                                    placeholder="Career"
                                    value={profileData.career || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3 input-group input-mini">
                                <textarea
                                    name="aboutMe"
                                    className="form-control"
                                    placeholder="About Me"
                                    value={profileData.aboutMe || ''}
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
