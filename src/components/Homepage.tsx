import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate in React Router v6
import HomepageHeader from './HomepageHeader';
import Story from './Story';
import Postcard from './Postcard';
import Menubar from './Menubar';

import { fetchHomepagePosts } from '../apis/HomepageApi'; // Assume this is the function to fetch posts

const Homepage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]); // State to store posts
  const [error, setError] = useState<string | null>(null); // State for error message
  const [loggedUser, setLoggedUser] = useState<any>(null); // State to store logged-in user
  const navigate = useNavigate(); // React Router v6 hook for navigation
  const userId = localStorage.getItem('userId');

  console.log(posts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (userId) {
          const response = await fetchHomepagePosts(userId);
          if ('error' in response) {
            setError(response.error);
          } else if (!response.loggedUser) {
            navigate('/login'); // Redirect to /login if logged user is not found
          } else {
            setPosts(response.posts);
            setLoggedUser(response.loggedUser);
          }
        } else {
          console.log('User not logged in');
          navigate('/login'); // Redirect to /login if userId is not found in localStorage
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Error fetching posts');
      }
    };

    fetchPosts();
  }, [userId, navigate]); // Add navigate to dependency array

  return (
    <div className="page-wraper header-fixed">
      {/* Header Section */}
      <HomepageHeader />

      <div className="page-content">
        <div className="content-inner pt-0">
          <div className="container p-b50">
            {/* Story Section */}
            {loggedUser && (
              <Story
                userName={loggedUser.username} // Pass the correct prop name
                profilePhoto={loggedUser.profilePhoto} // Pass the correct prop name
              />
            )}

            {/* Display posts */}
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

      {/* Menubar Section */}
      <Menubar />
    </div>
  );
};

export default Homepage;
