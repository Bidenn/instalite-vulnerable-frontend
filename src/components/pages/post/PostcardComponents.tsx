import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/style.css';
import nullPhoto from '../../assets/images/avatar/NullUserPhoto.png';

interface PostcardProps {
    username: string;
    photo: string;
    postContent: string;
    postCaption: string;
    postId: string;
    onClick?: () => void;
    likeCounts: string;
    commentCounts: string;
}

const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;

const PostcardHeader: React.FC<{ username: string; photo: string }> = ({ username, photo }) => {
    return (
        <div className="top-meta" style={{ marginBottom: 5 }}>
            <div className="d-flex justify-content-between align-items-start">
                <a href={`/profile/${username}`} className="media media-40">
                    <img
                        className="rounded"
                        src={photo ? `${photo}` : nullPhoto}
                        alt="profile"
                        style={{ width: '30px', height: 'auto' }}
                    />
                </a>
                <div className="meta-content ms-2">
                    <p className="title mb-0 d-flex align-items-start">
                        <a href={`/profile/${username}`} style={{ fontWeight: "bold", fontSize: 15, marginTop: 5 }}>
                            {username}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

const PostcardContent: React.FC<{ postContent: string }> = ({ postContent }) => {
    return (
        <div className="dz-media" style={{ marginBottom: 5 }}>
            <img src={postContent} alt="Not Image Post" style={{borderRadius: '0px'}}/>
        </div>
    );
};

const PostcardFooter: React.FC<{username: string; postCaption: string}> = ({ username, postCaption }) => {
    const truncatedContent = postCaption.length > 100 ? `${postCaption.substring(0, 100)}...` : postCaption;
    return (
        <div className="post-footer">
            <div
                style={{
                    fontSize: 14,
                    lineHeight: 1.5,
                    marginBottom: 0,
                    textAlign: 'left',
                    wordBreak: 'break-word', 
                }}
            >
                <span
                    style={{
                        fontWeight: 'bold',
                        marginRight: 8, 
                        display: 'inline', 
                    }}
                >
                    {username}
                </span>
                <span>
                    {truncatedContent}
                </span>
            </div>
        </div>
    );
};

const Postcard: React.FC<PostcardProps> = ({ username, photo, postContent, postCaption, postId }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/posts/${postId}`); 
    };

    return (
        <div
            className="post-card"
            onClick={handleCardClick}
            style={{ cursor: "pointer" }}
        >
            <PostcardHeader username={username} photo={photo ? `${apiUrl}/users/${photo}` : nullPhoto} />
            <PostcardContent postContent={`${apiUrl}/posts/${postContent}`} />
            <PostcardFooter username={username} postCaption={postCaption} />
        </div>
    );
};

export default Postcard;
