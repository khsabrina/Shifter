import React, { useState } from 'react';
import './UserCircle.css';
import UserPic from './NoPhotoUser.png'

interface User {
  imageSrc: string;
}

interface UserCircleProps {
  imageSrc: string;
}

const UserCircle: React.FC<UserCircleProps> = ({ imageSrc }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleMouseEnter = () => {
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  return (
    <div className="user-circle">
      <img src={imageSrc}/>
    </div>
  );
};


export default UserCircle;
