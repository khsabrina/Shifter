import React from 'react';
import './SideBar.css';
import HouseIcon from '@mui/icons-material/House';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import ProioritiserIcon from '@mui/icons-material/EventAvailableSharp';
import TeamIcon from '@mui/icons-material/Groups2Sharp';
import SettingsIcon from '@mui/icons-material/SettingsSharp';
import LogoutIcon from '@mui/icons-material/LogoutSharp';
import Logo from '../Logo/Logo';
import { Link } from 'react-router-dom';

function SideBar(): JSX.Element {
  return (
    <div className="SideBar">
      <div style={{marginTop: '10px' , display:'flex',marginLeft: '7px', marginBottom: '30px'}}>
        <div>
          <Logo/>
        </div>
      </div>
      <div style={{ display:'flex',marginLeft: '7px',marginBottom: '10px'}}>
        <Link to="/home" style={{border: 'none', background: 'none', cursor: 'pointer', display:'flex', alignItems:'center'}}>
          <HouseIcon/>
          <span>Home</span>
        </Link>
      </div>
      <div style={{ display:'flex',marginLeft: '7px',marginBottom: '10px'}}>
        <Link to="/calendar" style={{border: 'none', background: 'none', cursor: 'pointer', display:'flex', alignItems:'center'}}>
          <CalendarIcon/>
          <span>Calendar</span>
        </Link>
      </div>
      <div style={{ display:'flex',marginLeft: '7px',marginBottom: '10px'}}>
        <Link to="/prioritizer" style={{border: 'none', background: 'none', cursor: 'pointer', display:'flex', alignItems:'center'}}>
          <ProioritiserIcon/>
          <span>Prioritizer</span>
        </Link>
      </div>
      <div style={{ display:'flex',marginLeft: '7px',marginBottom: '10px'}}>
        <Link to="/team" style={{border: 'none', background: 'none', cursor: 'pointer', display:'flex', alignItems:'center'}}>
          <TeamIcon/>
          <span>Team</span>
        </Link>
      </div>
      <div style={{display:'flex', marginLeft: '7px',marginBottom: '10px'}}>
        <Link to="/settings" style={{border: 'none', background: 'none', cursor: 'pointer', display:'flex', alignItems:'center'}}>
          <SettingsIcon/>
          <span>Settings</span>
        </Link>
      </div>
      <div style={{display:'flex', marginLeft: '7px',marginBottom: '10px'}}>
        <Link to="/logout" style={{border: 'none', background: 'none', cursor: 'pointer', display:'flex', alignItems:'center'}}>
          <LogoutIcon/>
          <span>Logout</span>
        </Link>
      </div>
    </div>

    
  );
}

export default SideBar;
