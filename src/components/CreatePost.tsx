import React, { useState, useEffect } from 'react';
import camlogo from './assets/images/cam-logo-removed.png';
import { storePost } from '../apis/PostApi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2

const CreatePost: React.FC = () => {
    const [postContent, setPostContent] = useState<string>(''); // Caption
    const [selectedImage, setSelectedImage] = useState<File | null>(null); // Image
    const [userId, setUserId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'User not authenticated',
                text: 'Please log in to create a post.',
            });
        }
    }, []);

    // Handle caption change
    const handlePostContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPostContent(e.target.value);
    };

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setSelectedImage(file);
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!userId) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'User ID not found. Please log in.',
            });
            return;
        }

        if (!selectedImage || !postContent) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete Data',
                text: 'Please provide both an image and a caption.',
            });
            return;
        }

        const formData = new FormData();
        formData.append('userId', userId); // Attach user ID
        formData.append('caption', postContent); // Attach caption
        formData.append('content', selectedImage); // Attach image file

        try {
            const response = await storePost(formData);
            if (response.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Post Failed',
                    text: 'Failed to create post. Please try again.',
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Post Created',
                    text: 'Your post was created successfully!',
                }).then(() => {
                    navigate('/Home');
                });
            }
        } catch (error) {
            console.error("Error creating post:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while creating the post. Please try again.',
            });
        }
    };

    return (
        <div className="page-wraper header-fixed">
            {/* Header */}
            <header className="header bg-white">
                <div className="container">
                    <div className="main-bar">
                        <div className="left-content">
                            <a href="/" className="back-btn">
                                <i className="fa-solid fa-arrow-left"></i>
                            </a>
                            <h4 className="title mb-0">Create Post</h4>
                        </div>
                        <div className="mid-content"></div>
                        <div className="right-content">
                            <button onClick={handleSubmit} className="post-btn">POST</button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="page-content">
                <div className="container">
                    <div className="post-content-area">
                        {/* Image Upload */}
                        <div className="image-upload-container text-center">
                            {!selectedImage && (
                                <label htmlFor="file-upload" className="image-upload-icon">
                                    <img src={camlogo} alt="Camera Logo" style={{ maxWidth: '100px' }} />
                                    <input
                                        type="file"
                                        id="file-upload"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            )}

                            {selectedImage && (
                                <div className="image-preview mt-3">
                                    <img
                                        src={URL.createObjectURL(selectedImage)}
                                        alt="Selected Preview"
                                        className="img-fluid"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Caption Input */}
                        <div className="caption-input mt-3">
                            <textarea
                                className="form-control"
                                placeholder="Enter a caption..."
                                value={postContent}
                                onChange={handlePostContentChange}
                                rows={3}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
