import React from 'react';
import './assets/css/story.css';
import nullPhoto from './assets/images/avatar/NullUserPhoto.png';

interface StoryProps {
  userName: string;
  profilePhoto: string | null;
}

const Story: React.FC<StoryProps> = ({ userName, profilePhoto }) => {
  return (
    <div className="author-notification mb-4">
      <div className="swiper-btn-center-lr my-0">
        <div className="swiper-container categorie-swiper">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <a href="/profile" className="categore-box style-1">
                <div className="story-bx">
                  <img
                    src={profilePhoto ? `http://localhost:5000/users/${profilePhoto}` : nullPhoto}
                    alt="Photo Profile"
                  />
                  <div className="add-box"></div>
                </div>
                <span className="detail">{userName}</span> {/* Update text to show the username */}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
