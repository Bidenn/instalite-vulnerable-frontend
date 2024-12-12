import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomepageHeader from './HomepageHeader';
import Story from './Story';
import Postcard from './Postcard';
import Menubar from './Menubar';

import { fetchHomepagePosts } from '../apis/HomepageApi'; 

const Homepage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]); 
  const [error, setError] = useState<string | null>(null); 
  const [loggedUser, setLoggedUser] = useState<any>(null); 
  const navigate = useNavigate(); 
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (userId) {
          const response = await fetchHomepagePosts(userId);
          if ('error' in response) {
            setError(response.error);
          } else if (!response.loggedUser) {
            navigate('/login'); 
          } else {
            setPosts(response.posts);
            setLoggedUser(response.loggedUser);
          }
        } else {
          console.log('User not logged in');
          navigate('/login'); 
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Error fetching posts');
      }
    };

    fetchPosts();
  }, [userId, navigate]); 

  return (
    <div className="page-wraper header-fixed">
      <HomepageHeader />
      <div className="page-content">
        <div className="content-inner pt-0">
          <div className="container p-b50">
            {loggedUser && (
              <Story userName={loggedUser.username} profilePhoto={loggedUser.profilePhoto}/>
            )}
            {error && <div className="error-message">{error}</div>}
            {posts.length > 0 ? (
              posts.map((post) => (
                <Postcard
                  key={post.id}
                  postId={post.id}
                  userName={post.user.username}
                  userImage={post.user.profilePhoto}
                  postContent={post.content}
                  postCaption={post.caption}
                />
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>
        </div>
      </div>
      <Menubar />
    </div>
  );
};

export default Homepage;
