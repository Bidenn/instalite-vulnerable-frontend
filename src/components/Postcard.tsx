import React from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/css/style.css';
import nullPhoto from './assets/images/avatar/NullUserPhoto.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { deletePost } from '../apis/PostApi';

// Type definition for the props
interface PostcardProps {
    userName: string;
    userImage: string;
    postContent: string;
    postCaption: string;
    postId: string;
}

const handleDeletePost = async (postId: string) => {
    try {
        const response = await deletePost(postId);

        if (response.error) {
            alert(`Failed to delete post: ${response.error}`);
        } else {
            alert("Post deleted successfully!");
            // Logic for refreshing the post list
        }
    } catch (error) {
        console.error("Error deleting post:", error);
        alert("An error occurred while deleting the post.");
    }
};

// PostcardHeader: Displays the user image and username
const PostcardHeader: React.FC<{ userName: string; userImage: string; postId: string }> = ({ userName, userImage, postId }) => {
    return (
        <div className="top-meta" style={{ marginBottom: 5 }}>
            <div className="d-flex justify-content-between align-items-start">
                <a href="user-profile.html" className="media media-40">
                    <img className="rounded" src={userImage ? `${userImage}` : nullPhoto} alt="photo profile" />
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
            <FontAwesomeIcon
                icon={faTrash}
                style={{ cursor: "pointer" }}
                onClick={() => handleDeletePost(postId)}
            />
        </div>
    );
};

// PostcardContent: Displays the full image (100% width)
const PostcardContent: React.FC<{ postContent: string; postId: string }> = ({ postContent, postId }) => {
    const navigate = useNavigate(); // Hook for navigation

    const handleImageClick = () => {
        navigate(`/posts/${postId}`); // Navigate to the detailed view of the post
    };

    return (
        <div className="dz-media" style={{ marginBottom: 5, cursor: 'pointer' }} onClick={handleImageClick}>
            <img src={postContent} alt="Post content" />
            <div className="post-meta-btn" style={{ marginTop: 10 }}>
                <ul>
                    <li>
                        <a href="javascript:void(0);" className="action-btn bg-primary">
                            <i className="fa-regular fa-heart fill-icon"></i>
                            <i className="fa-solid fa-heart fill-icon-2"></i>
                            <h6 className="font-14 mb-0 ms-2" id="value1">221</h6>
                        </a>
                    </li>
                    <li>
                        <a href="comment.html" className="action-btn bg-secondary">
                            <i className="fa-solid fa-comment fill-icon"></i>
                            <h6 className="font-14 mb-0 ms-2">150</h6>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

// PostcardFooter: Displays the username and a truncated version of the post content
const PostcardFooter: React.FC<{ userName: string; postCaption: string }> = ({ postCaption }) => {
    const truncatedContent = postCaption.length > 100 ? `${postCaption.substring(0, 100)}...` : postCaption;

    return (
        <div className="post-footer">
            <p className="d-flex align-items-start">{truncatedContent}</p>
        </div>
    );
};

// Main Postcard component combining all three sections
const Postcard: React.FC<PostcardProps> = ({ userName, userImage, postContent, postCaption, postId }) => {
    return (
        <div className="post-card">
            {/* Postcard Header */}
            <PostcardHeader
                userName={userName}
                userImage={userImage ? `http://localhost:5000/users/${userImage}` : nullPhoto}
                postId={postId}
            />

            {/* Postcard Content */}
            <PostcardContent postContent={`http://localhost:5000/posts/${postContent}`} postId={postId} />

            {/* Postcard Footer */}
            <PostcardFooter userName={userName} postCaption={postCaption} />
        </div>
    );
};

export default Postcard;
