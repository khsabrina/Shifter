import React, { useState } from 'react';
import './UserCircle.css';
import UserPic from './NoPhotoUser.png'

interface User {
  name: string;
  age: number;
  imageSrc: string;
}

interface UserCircleProps {
  user: User;
}

const UserCircle: React.FC<UserCircleProps> = ({ user }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleMouseEnter = () => {
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  return (
    <div className="user-circle" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <img src={user.imageSrc} alt={user.name} />
      {showPopup && <UserPopup user={user} />}
    </div>
  );
};

interface UserPopupProps {
  user: User;
}

const UserPopup: React.FC<UserPopupProps> = ({ user }) => {
  const popupStyle = {
    position: "absolute" as const,
    top: "calc(100%)",
    right: "auto",
    left: "auto",
    bottom: "auto",
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "30px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    alignItems: "center",
  };

  return (
    <div className="user-popup" style={popupStyle}>
      <div className="user-popup-image">
        <img src={user.imageSrc} alt={user.name} />
      </div>
      <div className="user-popup-details">
        <div className="user-popup-name">{user.name}</div>
        <div className="user-popup-age">{user.age} years old</div>
      </div>
    </div>
  );
};

export default UserCircle;
