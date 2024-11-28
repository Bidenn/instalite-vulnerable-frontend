import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { detailPost } from '../apis/PostApi'; // Pastikan API ini sudah benar
import PostHeader from './PostHeader';
import Menubar from './Menubar';
import './assets/css/style.css';
import nullPhoto from './assets/images/avatar/NullUserPhoto.png';

const PostDetail: React.FC = () => {
    const { postId } = useParams<{ postId: string }>(); // Ambil `postId` dari URL
    const [postContent, setPostContent] = useState<string>(''); // State untuk konten
    const [postCaption, setPostCaption] = useState<string>(''); // State untuk caption
    const [userPhoto, setPosterPhoto] = useState<string>(''); // State untuk caption
    const [userName, setPosterUsername] = useState<string>(''); // State untuk caption

    // Fungsi untuk memuat data postingan
    const loadPostData = async () => {
        try {
            if (!postId) return; // Pastikan `postId` valid
            const postData = await detailPost(postId); // Panggil API
            const posterData = postData.user;

            if (postData) {
                setPostContent(postData.content || ''); // Simpan konten
                setPostCaption(postData.caption || ''); // Simpan caption
                setPosterPhoto(posterData.photoProfile || ''); // Simpan caption
                setPosterUsername(posterData.username || ''); // Simpan caption
            }
        } catch (error) {
            console.error('Failed to fetch post data:', error);
        }
    };

    // Panggil `loadPostData` saat komponen dimuat
    useEffect(() => {
        loadPostData();
    }, [postId]);

    // Fungsi untuk meng-handle klik konten (opsional, sesuaikan kebutuhan)
    const handleContentClick = () => {
        console.log('Content clicked!');
    };

    return (
        <div className="page-wraper header-fixed">
            <PostHeader />
            <div className="page-content">
                <div className="content-inner pt-0">
                    <div className="container p-b50">
                        <div className="post-card">
                            <div className="top-meta" style={{ marginBottom: 5 }}>
                                <div className="d-flex justify-content-between align-items-start">
                                    <a href="user-profile.html" className="media media-40">
                                        <img className="rounded" src={userPhoto ? `${userPhoto}` : nullPhoto} alt="photo profile" />
                                    </a>
                                    <div className="meta-content ms-2">
                                        <p className="title mb-0 d-flex align-items-start">
                                            <a href="#" style={{ fontWeight: "bold", fontSize: 15 }}>
                                                {userName}
                                            </a>
                                        </p>
                                        <ul className="meta-list">
                                            <li>
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M12.25 5.83331C12.25 9.91665 7 13.4166 7 13.4166C7 13.4166 1.75 9.91665 1.75 5.83331C1.75 4.44093 2.30312 3.10557 3.28769 2.121C4.27226 1.13644 5.60761 0.583313 7 0.583313C8.39239 0.583313 9.72774 1.13644 10.7123 2.121C11.6969 3.10557 12.25 4.44093 12.25 5.83331Z"
                                                        stroke="black"
                                                        strokeOpacity="0.6"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M7 7.58331C7.9665 7.58331 8.75 6.79981 8.75 5.83331C8.75 4.86681 7.9665 4.08331 7 4.08331C6.0335 4.08331 5.25 4.86681 5.25 5.83331C5.25 6.79981 6.0335 7.58331 7 7.58331Z"
                                                        stroke="black"
                                                        strokeOpacity="0.6"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                Jakarta, Indonesia
                                            </li>
                                            <li>2m ago</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="dz-media"
                                style={{ marginBottom: 5, cursor: 'pointer' }}
                                onClick={handleContentClick}
                            >
                                <img src={"http://localhost:5000/posts/" + postContent} alt="Post content" />
                            </div>
                            <div className="post-footer mt-2">
                                <p className="d-flex align-items-start">{postCaption}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Menubar />
        </div>
    );
};

export default PostDetail;
