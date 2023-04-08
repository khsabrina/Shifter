import React, { useState } from 'react';
import './SideBar.css';
import HouseIcon from '@mui/icons-material/House';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import ProioritiserIcon from '@mui/icons-material/EventAvailableSharp';
import TeamIcon from '@mui/icons-material/Groups2Sharp';
import SettingsIcon from '@mui/icons-material/SettingsSharp';
import LogoutIcon from '@mui/icons-material/LogoutSharp';
import Logo from '../Logo/Logo';
import { Link } from 'react-router-dom';
import Logout from '../../Pages/Logout/Logout'

const buttonStyle = {
    // border: '1px solid black',
    background: 'none',
    // cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    // borderRadius: '15px',
    padding: '5px',
    marginBottom: '10px',
    textDecoration: 'none',
    // boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
    minWidth: '100px', // or any other value that suits your design
  };
  

const iconStyle = {
  marginRight: '10px',
  color: 'black',
};

const textStyle = {
  font: 'icon',
  color: 'black',
};

function SideBar(): JSX.Element {

    const [showPopup, setShowPopup] = useState(false);

    function handleConfirm() {
      // handle the confirmation action
      setShowPopup(false);
    }
  
    function handleCancel() {
      // handle the cancel action
      setShowPopup(false);
    }
  return (
    <div className="SideBar">
      <div style={{marginTop: '10px' , display:'flex',marginLeft: '7px', marginBottom: '30px'}}>
        <div>
          <Logo/>
        </div>
      </div>
      <div style={{ display:'flex',marginLeft: '7px'}}>
        <Link to="/home" style={buttonStyle}>
          <HouseIcon style={iconStyle}/>
          <span style={textStyle}>Home</span>
        </Link>
      </div>
      <div style={{ display:'flex',marginLeft: '7px'}}>
        <Link to="/calendar" style={buttonStyle}>
          <CalendarIcon style={iconStyle}/>
          <span style={textStyle}>Calendar</span>
        </Link>
      </div>
      <div style={{ display:'flex',marginLeft: '7px'}}>
        <Link to="/prioritizer" style={buttonStyle}>
          <ProioritiserIcon style={iconStyle}/>
          <span style={textStyle}>Prioritizer</span>
        </Link>
      </div>
      <div style={{ display:'flex',marginLeft: '7px'}}>
        <Link to="/team" style={buttonStyle}>
          <TeamIcon style={iconStyle}/>
          <span style={textStyle}>Team</span>
        </Link>
      </div>
      <div style={{display:'flex', marginLeft: '7px'}}>
        <Link to="/settings" style={buttonStyle}>
          <SettingsIcon style={iconStyle}/>
          <span style={textStyle}>Settings</span>
        </Link>
      </div>
      <div style={{display:'flex', marginLeft: '7px'}}>
        <Link to="#" onClick={() => setShowPopup(true)} style={buttonStyle}>
            <LogoutIcon style={iconStyle}/>
            <span style={textStyle}>Logout</span>
        </Link>
        {showPopup && (
            <Logout
            message="Are you sure you want to exit?"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            />
        )}
        {/* <Link to="/login" style={buttonStyle}>
          <LogoutIcon style={iconStyle}/>
          <span style={textStyle}>Logout</span>
        </Link> */}
      </div>
    </div>
  );
}

export default SideBar;
