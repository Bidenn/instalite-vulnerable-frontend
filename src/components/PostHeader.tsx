import React from 'react';

const PostHeader: React.FC = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="main-bar">
                    <div className="left-content">
                        <a href="/home" className="back-btn">
                            <i className="fa-solid fa-arrow-left"></i>
                        </a>
                        <h4 className="title mb-0">Instalite</h4>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default PostHeader;
