import React from 'react';
import '../../assets/css/story.css';
import nullPhoto from '../../assets/images/avatar/NullUserPhoto.png';

interface StoryProps {
    username: string;
    photo: string | null;
}

const Story: React.FC<StoryProps> = ({ username, photo }) => {

  const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;

  return (
    <div className="author-notification mb-4">
        <div className="swiper-btn-center-lr my-0">
            <div className="swiper-container categorie-swiper">
                <div className="swiper-wrapper">
                    <div className="swiper-slide">
                        <a href="/profile" className="categore-box style-1">
                            <div className="story-bx">
                                <img src={photo ? `${apiUrl}/users/${photo}` : nullPhoto} alt="Not Image Photo"/>
                                <div className="add-box"></div>
                            </div>
                            <span className="detail">{username}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Story;
