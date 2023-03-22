import React from 'react';
import './SideBar.css';
import HouseIcon from '@mui/icons-material/House';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import ProioritiserIcon from '@mui/icons-material/EventAvailableSharp';
import TeamIcon from '@mui/icons-material/Groups2Sharp';
import SettingsIcon from '@mui/icons-material/SettingsSharp';
import LogoutIcon from '@mui/icons-material/LogoutSharp';

function SideBar(): JSX.Element {
    return (
        <div className="Menu">
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
            
            			
            {/* <a href="#" > <HouseIcon/> Home</a>

            <div style={margin-top: 20px}>
                <CalendarIcon/>
            </div>

			<a href="#"><CalendarIcon/>Calendar</a>
			<a href="#"><ProioritiserIcon/> Proioritiser</a>
            <a href="#"><TeamIcon/> Team</a>
			<a href="#"><LogoutIcon/> Logout</a> */}


        </div>
    );
}

export default SideBar;