import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Homepage from './components/pages/home/Homepage';
import Register from './components/pages/auth/RegisterPage';
import Login from './components/pages/auth/LoginPage';
import UserProfile from './components/pages/profile/UserProfilePage';
import CreatePost from './components/pages/post/CreatePostPage';
import EditProfile from './components/pages/profile/EditProfilePage';
import PostDetail from './components/pages/post/PostDetailPage';
import ProtectedRoute from './components/utils/ProtectedRoute';
import IdleTimer from './components/utils/IdleTimer';
import CreateProfile from './components/pages/profile/CreateProfilePage';
import PublicProfile from './components/pages/public/PublicProfilePage';
import SearchPublicProfile from './components/pages/public/SearchPublicProfilePage';

function App() {
    const loggedUser = localStorage.getItem('loggedUser');

    return (
        <div className="App">
            <Router>
                <IdleTimer>
                    <Routes>
                        {/* Redirect root to login */}
                        <Route path="/" element={<Navigate to="/login" replace />} />

                        {/* Public Routes */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/home" element={<Homepage />} />
                            <Route path="/profile" element={<UserProfile />} />
                            <Route path="/search" element={<SearchPublicProfile />} />
                            <Route path="/profile/:username" element={<PublicProfile />} />
                            <Route path="/create-post" element={<CreatePost />} />
                            <Route path="/profile/:loggedUser/edit" element={<EditProfile />} /> {/* Passing token here */}
                            <Route path="/posts/:postId" element={<PostDetail />} />
                        </Route>

                        {/* Non-protected Route for creating profile */}
                        <Route path="/create-profile" element={<CreateProfile />} /> 
                    </Routes>
                </IdleTimer>
            </Router>
        </div>
    );
}

export default App;
