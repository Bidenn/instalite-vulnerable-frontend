import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { fetchEditProfile, updateProfileData, checkUsernameAvailability } from '../../../apis/ProfileApi';
import nullPhoto from '../../assets/images/avatar/NullUserPhoto.png';
import { useNavigate, useParams } from 'react-router-dom';

const EditProfile: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [fullname, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [career, setCareer] = useState('');
    const [photo, setProfilePhoto] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(nullPhoto);
    const { loggedUser } = useParams<{ loggedUser: string | undefined }>();

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (loggedUser) {
                    const result = await fetchEditProfile(loggedUser);
                    setEmail(result.email ?? '');
                    setUsername(result.username ?? '');
                    setFullName(result.fullname ?? '');
                    setBio(result.bio ?? '');
                    setCareer(result.career ?? '');
                    setImagePreview(result.photo ? `${apiUrl}/users/${result.photo}` : nullPhoto);
                }
            } catch (err) {
                setError('Failed to fetch user data');
            }
        };
        fetchProfile();
    }, [loggedUser, apiUrl]);

    const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        const isValid = /^[a-z0-9._]*$/.test(value);

        if (!isValid) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Username',
                text: 'Username can only contain lowercase letters, numbers, dots, and underscores.',
            });
            return;
        }

        setUsername(value);
        setIsAvailable(null);

        if (value.length > 2) {
            try {
                const result = await checkUsernameAvailability(value);
                setIsAvailable(result.status === 'available');
            } catch (error) {
                setIsAvailable(null);
                console.error('Error checking username availability:', error);
            }
        }
    };

    const handleChangeProfilePhoto = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setProfilePhoto(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username) {
            Swal.fire({
                icon: 'error',
                title: 'Missing Information',
                text: 'Username is required.',
            });
            return;
        }

        try {
            const profileData = new FormData();
            profileData.append('username', username);
            profileData.append('fullname', fullname);
            profileData.append('bio', bio);
            profileData.append('career', career);
            if (photo) profileData.append('photo', photo);

            if (loggedUser) {
                const result = await updateProfileData(loggedUser, profileData);
                if (result.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Profile Updated',
                        text: 'Your profile has been updated successfully.',
                        confirmButtonText: 'Go to Profile',
                    }).then(() => navigate('/profile'));
                }
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update profile. Please try again.',
            });
        }
    };

    return (
        <div className="page-wrapper header-fixed">
            <header className="header bg-white">
                <div className="container">
                    <div className="main-bar">
                        <div className="left-content">
                            <a href="/profile" className="back-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </a>
                        </div>
                        <div className="mid-content">
                            <h4 className="title mb-0">Edit Profile</h4>
                        </div>
                        <div className="right-content" style={{ minWidth: '30px' }}>
                            <a href="#" className="text-dark font-20">						
                                <i className="fa-solid fa-check" style={{ marginLeft: '15px', width: '35px' }}></i>
                            </a>
                        </div>
                    </div>
                </div>
            </header>
            <div className="page-content">
                <div className="container">
                    <div className="edit-profile">
                        <div className="profile-image">
                            <img 
                                src={imagePreview} 
                                alt="Profile" 
                                className="media media-100 rounded-circle" 
                            />
                            <a href="#" onClick={handleChangeProfilePhoto}>
                                Change Profile Photo
                            </a>
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
                                <p style={{ textAlign: 'left', marginBottom: '5px' }}>Email</p>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={email}
                                    disabled
                                />
                            </div>
                            <div className="mb-3">
                                <p style={{ textAlign: 'left', marginBottom: '5px' }}>Username</p>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Username"
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                                {isAvailable === null ? null : isAvailable ? (
                                    <span style={{ color: 'green' }}>Username is available</span>
                                ) : (
                                    <span style={{ color: 'red' }}>Username is taken</span>
                                )}
                            </div>
                            <div className="mb-3">
                                <p style={{ textAlign: 'left', marginBottom: '5px' }}>Full Name</p>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="-"
                                    value={fullname}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <p style={{ textAlign: 'left', marginBottom: '5px' }}>Career</p>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="-"
                                    value={career}
                                    onChange={(e) => setCareer(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <p style={{ textAlign: 'left', marginBottom: '5px' }}>Bio</p>
                                <textarea
                                    className="form-control"
                                    placeholder="-"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
