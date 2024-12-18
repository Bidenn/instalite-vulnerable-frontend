import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { detailPost, deletePost, toggleLikePost, storeComment, deleteComment } from '../../../apis/PostApi'; 
import Swal from 'sweetalert2';

import u1 from '../../assets/images/avatar/NullUserPhoto.png';

const PostDetail: React.FC = () => {
    const loggedUser = localStorage.getItem('loggedUser');
    const { postId } = useParams();
    const navigate = useNavigate();
    const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;
    const [post, setPost] = useState<any>(null);
    const [authorPhoto, setAuthorPhoto] = useState<any>(null);
    const [authorUsername, setAuthorUsername] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [liked, setLiked] = useState<boolean>(false); 
    const [likeCount, setLikeCount] = useState<number>(0); 

    useEffect(() => {
        if (!loggedUser) {
            navigate('/login');
            return;
        }

        const loadPostDetail = async () => {
            try {
                const postData = await detailPost(postId!);
                const postAuthor = postData.post.author;

                const authorUsername = postAuthor.username;
                const authorPhoto = postAuthor.photo;

                setPost(postData.post);
                setAuthorPhoto(authorPhoto);
                setAuthorUsername(authorUsername);
                setComments(postData.comments || []); 
                setLikeCount(postData.totalLikes || 0); 
                setLiked(postData.isLiked); 
            } catch (err) {
                console.error('Failed to fetch post details:', err);
                setError('An error occurred while fetching post details.');
            }
        };

        loadPostDetail();
    }, [postId, loggedUser, navigate]);

    const handleDeletePost = async () => {
        if (!postId) return;

        try {
            const response = await deletePost(postId);

            if (response.error) {
                Swal.fire({
                    title: 'Error!',
                    text: `Failed to delete post: ${response.error}`,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            } else {
                Swal.fire({
                    title: 'Success!',
                    text: 'Post deleted successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate('/home'); 
                });
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            Swal.fire({
                title: 'Error!',
                text: "An error occurred while deleting the post.",
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    const handleLikePost = async () => {
        if (!postId) return; 
    
        try {
            const response = await toggleLikePost(postId, loggedUser!);
            if (response.success) {
                window.location.reload();
                setLiked(!liked); 
                setLikeCount(likeCount + (liked ? -1 : 1)); 
            }
        } catch (error) {
            console.error('Error liking the post:', error);
        }
    };
    
    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !postId) return;
    
        try {
            if (loggedUser) {
                const response = await storeComment(postId, newComment, loggedUser);
    
                if (response.error) {
                    Swal.fire({
                        title: 'Error!',
                        text: `Failed to create comment: ${response.error}`,
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                } else {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Comment added successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });

                    setComments((prevComments) => [...prevComments, response.comment]); 
                    setNewComment('');
    
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000); 
                }
            } else {
                console.error("Logged user is null");
                navigate('/login');
            }
        } catch (error) {
            console.error('Error storing comment:', error);
        }
    };    

    const handleDeleteComment = async (commentId: string) => {
        try {
            const response = await deleteComment(commentId);
            if (response.error) {
                Swal.fire({
                    title: 'Error!',
                    text: `Failed to delete comment: ${response.error}`,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            } else {
                Swal.fire({
                    title: 'Success!',
                    text: 'Comment deleted successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            }
            if (response.success) {
                setComments((prevComments) =>
                    prevComments.filter((comment) => comment.id !== commentId)
                );
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    if (error) return <p>{error}</p>;
    if (!post) return <p>Loading...</p>;

    return (
        <div className="page-wrapper header-fixed">
            <header className="header">
                <div className="container">
                    <div className="main-bar">
                        <div className="left-content">
                            <a href="/home" className="back-btn">
                                <i className="fa-solid fa-arrow-left"></i>
                            </a>
                            <h4 className="title mb-0">Instalite Vulnerable</h4>
                        </div>
                    </div>
                </div>
            </header>
            <div className="page-content" style={{ overflowY: 'auto', height: 'calc(100vh - 60px)', paddingBottom: '50px' }}>
                <div className="content-inner pt-0">
                    <div className="container p-0 mt-2 ml-1">
                        <div className="top-meta d-flex justify-content-start align-items-center mb-2">
                            <a href={`/profile/${authorUsername}`} className="media media-40" style={{ marginRight: 3, marginLeft: 5 }}>
                                <img
                                    className="rounded-circle mb-0"
                                    src={authorPhoto ? `${apiUrl}/users/${authorPhoto}` : u1}
                                    alt="User profile"
                                    style={{ width: 30, height: 30 }}
                                />
                            </a>
                            <div className="meta-content">
                                <p className="title mb-0" style={{ fontWeight: 'normal', fontSize: 12, lineHeight: '1.2' }}>
                                    <a href={`/profile/${authorUsername}`}>{authorUsername}</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="container p-0">
                        <div className="dz-media">
                            <img src={`${apiUrl}/posts/${post.content}`} alt="Post content" style={{ width: '100%', borderRadius: 0 }} />
                        </div>
                    </div>
                    <div className="container" style={{ paddingLeft: 0, paddingTop: 5, paddingBottom: 0 }}>
                        <div className="post-card" style={{ width: '100%', borderRadius: 0 }}>
                            <div className="post-footer">
                                <div className="post-meta-btn d-flex align-items-center mt-0">
                                    <a
                                        href="#"
                                        className="action-btn d-flex align-items-center"
                                        style={{ textDecoration: 'none', color: 'red' }}
                                        onClick={handleLikePost}
                                    >
                                        <i className={`fa-solid fa-heart ${liked ? 'liked' : ''}`}> {likeCount}</i>
                                    </a>
                                    <a href="#" className="action-btn d-flex align-items-center" style={{ textDecoration: 'none', color: '#000' }}>
                                        <i className="fa-solid fa-comment"> {comments.length}</i>
                                    </a>
                                    <button
                                        onClick={handleDeletePost}
                                        className="action-btn d-flex align-items-center me-3"
                                        style={{ background: 'transparent', border: 'none', color: '#000' }}
                                    >
                                        <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container pt-1">
                        <div className="post-card" style={{ width: '100%', borderRadius: 0 }}>
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
                                        {authorUsername}
                                    </span>
                                    <span>
                                        {post.caption}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container profile-area bottom-content">
                        <ul className="dz-comments-list">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <li key={comment.id}>
                                        <div className="list-content">
                                            <img src={comment.user?.photo ? `${apiUrl}/users/${comment.user.photo}` : u1} alt="/" />
                                            <div>
                                                <h6 className="font-13 mb-1" style={{ textAlign: 'left' }}>{comment.user?.username}</h6>
                                                <p className="mb-2" style={{fontSize:'12px', textAlign:'left'}}>{comment.text}</p>
                                            </div>
                                        </div>
                                        <div className="ms-auto">
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="action-btn d-flex align-items-center me-3"
                                                style={{ background: 'transparent', border: 'none', color: '#000' }}
                                            >
                                                <i className="fa-regular fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p>No comments available.</p>
                            )}
                        </ul>
                    </div>
                </div>
                <footer className="footer fixed border-top">
                    <div className="container p-2">
                        <div className="commnet-footer">
                            <div className="d-flex align-items-center flex-1">
                                <form className="flex-1">
                                    <input type="text" className="form-control" placeholder="Add a Comments..." value={newComment} onChange={(e) => setNewComment(e.target.value)}/>
                                </form>
                            </div>
                            <button className="send-btn" onClick={handleCommentSubmit}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M21.4499 11.11L3.44989 2.11C3.27295 2.0187 3.07279 1.9823 2.87503 2.00546C2.67728 2.02862 2.49094 2.11029 2.33989 2.24C2.18946 2.37064 2.08149 2.54325 2.02982 2.73567C1.97815 2.9281 1.98514 3.13157 2.04989 3.32L4.99989 12L2.09989 20.68C2.05015 20.8267 2.03517 20.983 2.05613 21.1364C2.0771 21.2899 2.13344 21.4364 2.2207 21.5644C2.30797 21.6924 2.42378 21.7984 2.559 21.874C2.69422 21.9496 2.84515 21.9927 2.99989 22C3.15643 21.9991 3.31057 21.9614 3.44989 21.89L21.4499 12.89C21.6137 12.8061 21.7512 12.6786 21.8471 12.5216C21.9431 12.3645 21.9939 12.184 21.9939 12C21.9939 11.8159 21.9431 11.6355 21.8471 11.4784C21.7512 11.3214 21.6137 11.1939 21.4499 11.11ZM4.70989 19L6.70989 13H16.7099L4.70989 19ZM6.70989 11L4.70989 5L16.7599 11H6.70989Z" fill="#40189D"></path>
                                </svg>
                            </button>
                        </div>    
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PostDetail;
