import React from 'react';
import './SideBar.css';
import HouseIcon from '@mui/icons-material/House';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import ProioritiserIcon from '@mui/icons-material/EventAvailableSharp';
import TeamIcon from '@mui/icons-material/Groups2Sharp';
import SettingsIcon from '@mui/icons-material/SettingsSharp';
import LogoutIcon from '@mui/icons-material/LogoutSharp';
import Logo from '../Logo/Logo'

function SideBar(): JSX.Element {
    return (
        <div className="SideBar">
            <div style={{marginTop: '10px' , display:'flex',marginLeft: '7px', marginBottom: '30px'}}>
                <div>
                    <Logo/>
                </div>
            </div>
            <div style={{ display:'flex',marginLeft: '7px',marginBottom: '10px'}}>
                <button style={{border: 'none', background: 'none', cursor: 'pointer', display:'flex', alignItems:'center'}}>
                    <HouseIcon/>
                    <span>Home</span>
                </button>
            </div>
            <div style={{ display:'flex',marginLeft: '7px',marginBottom: '10px'}}>
                <button style={{border: 'none', background: 'none', cursor: 'pointer', display:'flex', alignItems:'center'}}>
                    <CalendarIcon/>
                    <span>Calendar</span>
                </button>
            </div>
            <div style={{ display:'flex',marginLeft: '7px',marginBottom: '10px'}}>
                <button style={{border: 'none', background: 'none', cursor: 'pointer', display:'flex', alignItems:'center'}}>
                    <ProioritiserIcon/>
                    <span>Proioritiser</span>
                </button>
            </div>
            <div style={{ display:'flex',marginLeft: '7px',marginBottom: '10px'}}>
                <button style={{border: 'none', background: 'none', cursor: 'pointer', display:'flex', alignItems:'center'}}>
                    <TeamIcon/>
                    <span>Team</span>
                </button>
            </div>
            <div style={{display:'flex', marginLeft: '7px',marginBottom: '10px'}}>
                <button style={{border: 'none', background: 'none', cursor: 'pointer', display:'flex', alignItems:'center'}}>
                    <SettingsIcon/>
                    <span>Settings</span>
                </button>
            </div>
            <div style={{display:'flex', marginLeft: '7px',marginBottom: '10px'}}>
                <button style={{border: 'none', background: 'none', cursor: 'pointer', display:'flex', alignItems:'center'}}>
                    <LogoutIcon/>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default SideBar;
