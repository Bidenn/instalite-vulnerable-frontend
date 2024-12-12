import React from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/css/style.css';
import nullPhoto from './assets/images/avatar/NullUserPhoto.png';

interface PostcardProps {
    userName: string;
    userImage: string;
    postContent: string;
    postCaption: string;
    postId: string;
}

const PostcardHeader: React.FC<{ userName: string; userImage: string; postId: string }> = ({ userName, userImage, postId }) => {
    return (
        <div className="top-meta" style={{ marginBottom: 5 }}>
            <div className="d-flex justify-content-between align-items-start">
                <a href="" className="media media-40">
                    <img className="rounded" src={userImage ? `${userImage}` : nullPhoto} alt="photo profile" />
                </a>
                <div className="meta-content ms-2">
                    <p className="title mb-0 d-flex align-items-start">
                        <a href="" style={{ fontWeight: "bold", fontSize: 15 }}>
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
    );
};

const PostcardContent: React.FC<{ postContent: string; postId: string }> = ({ postContent, postId }) => {
    const navigate = useNavigate();
    
    const handleImageClick = () => {
        navigate(`/posts/${postId}`); 
    };

    return (
        <div className="dz-media" style={{ marginBottom: 5 }}>
            <img src={postContent} alt="Post content" style={{ cursor: 'pointer' }} onClick={handleImageClick} />
        </div>
    );
};

const PostcardFooter: React.FC<{ userName: string; postCaption: string }> = ({ postCaption }) => {
    const truncatedContent = postCaption.length > 100 ? `${postCaption.substring(0, 100)}...` : postCaption;

    return (
        <div className="post-footer">
            <p className="d-flex align-items-start">{truncatedContent}</p>
        </div>
    );
};

const Postcard: React.FC<PostcardProps> = ({ userName, userImage, postContent, postCaption, postId }) => {
    
    const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;
    
    return (
        <div className="post-card">
            <PostcardHeader
                userName={userName}
                userImage={userImage ? `${apiUrl}/users/${userImage}` : nullPhoto}
                postId={postId}
            />

            <PostcardContent postContent={`${apiUrl}/posts/${postContent}`} postId={postId} />

            <PostcardFooter userName={userName} postCaption={postCaption} />
        </div>
    );
};

export default Postcard;
