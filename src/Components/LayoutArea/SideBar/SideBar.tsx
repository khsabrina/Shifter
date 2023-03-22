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
            <div style={{marginTop: '10px' , display:'flex',marginLeft: '7px'}}>
                <div>
                    <Logo/>
                </div>
            </div>
            <div style={{marginTop: '10px' , display:'flex',marginLeft: '7px'}}>
                <div style={{display:'flex', alignItems:'center'}}>
                    <HouseIcon/>
                    <h6>Home</h6>
                </div>
            </div>
            <div style={{marginTop: '-30px' , display:'flex',marginLeft: '7px'}}>
                <div style={{display:'flex', alignItems:'center'}}>
                    <CalendarIcon/>
                    <h6>Calendar</h6>
                </div>
            </div>
            <div style={{marginTop: '-30px' , display:'flex',marginLeft: '7px'}}>
                <div style={{display:'flex', alignItems:'center'}}>
                    <ProioritiserIcon/>
                    <h6>Proioritiser</h6>
                </div>
            </div>
            <div style={{marginTop: '-30px' , display:'flex',marginLeft: '7px'}}>
                <div style={{display:'flex', alignItems:'center'}}>
                    <TeamIcon/>
                    <h6>Team</h6>
                </div>
            </div>
            <div style={{marginTop: '-30px',display:'flex', marginLeft: '7px'}}>
                <div style={{display:'flex', alignItems:'center'}}>
                    <LogoutIcon/>
                    <h6>Logout</h6>
                </div>
            </div>
        </div>
    );
}

export default SideBar;