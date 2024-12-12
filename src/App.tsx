import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Homepage from './components/Homepage';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';
import EditProfile from './components/EditProfile';
import PostDetail from './components/PostDetail';
import ProtectedRoute from './components/utils/ProtectedRoute';
import IdleTimer from './components/utils/IdleTimer';

function App() {
    return (
        <div className="App">
            <Router>
                <IdleTimer>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/login" element={<Login />}/>
                        <Route element={<ProtectedRoute />}>
                            <Route path="/home" element={<Homepage />} />
                            <Route path="/profile/:userId" element={<Profile />} />
                            <Route path="/create-post" element={<CreatePost />} />
                            <Route path="/profile/:userId/edit" element={<EditProfile />} />
                            <Route path="/posts/:postId" element={<PostDetail />} />
                        </Route>          
                    </Routes>
                </IdleTimer>
            </Router>
        </div>
    );
}

export default App;
