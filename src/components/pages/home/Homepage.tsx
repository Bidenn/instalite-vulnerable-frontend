import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomepageHeader from './HomepageHeader';
import Story from './Story';
import Postcard from '../post/PostcardComponents';
import Menubar from '../shared/Menubar';

import { fetchHomepagePosts } from '../../../apis/HomepageApi';

const Homepage: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]); 
    const [error, setError] = useState<string | null>(null); 
    const [loggedUser, setLoggedUser] = useState<any>(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            const loggedUser = localStorage.getItem('loggedUser'); 
            if (!loggedUser) {
                console.log('User not logged in');
                navigate('/login'); 
                return;
            }

            try {
                const response = await fetchHomepagePosts(loggedUser); 
                if ('error' in response) {
                    setError(response.error); 
                } else {
                    setPosts(response.posts); 
                    setLoggedUser(response.loggedUser);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('Failed to fetch posts. Please try again later.');
            }
        };

        fetchPosts();
    }, [navigate]); 

    const handlePostClick = (postId: string) => {
        navigate(`/posts/${postId}`); 
    };

    return (
        <div className="page-wraper header-fixed">
            <HomepageHeader />
            <div className="page-content">
                <div className="content-inner pt-0">
                    <div className="container p-b50">
                        {loggedUser && (
                            <Story
                                username={loggedUser.username} 
                                photo={loggedUser.photo} 
                            />
                        )}
                        {error && <div className="error-message">{error}</div>}
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <Postcard
                                    key={post.id}
                                    postId={post.id}
                                    username={post.author.username} 
                                    photo={post.author.photo} 
                                    postContent={post.content}
                                    postCaption={post.caption}
                                    onClick={() => handlePostClick(post.id)}
                                    likeCounts='100'
                                    commentCounts='100'
                                />
                            ))
                        ) : (
                            <p>No posts available.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Menubar Section */}
            <Menubar />
        </div>
    );
};

export default Homepage;
