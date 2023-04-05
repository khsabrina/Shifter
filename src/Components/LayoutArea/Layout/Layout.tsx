import SideBar from "../SideBar/SideBar";
import "./Layout.css";
import UserCircle from "../UserCircle/UserCircle"
import UserPic from '../UserCircle/NoPhotoUser.png'
import { BrowserRouter as Router, Routes , Route, Link } from 'react-router-dom';
import Home from '../../Pages/Home/Home';
import Calendar from '../../Pages/Calendar/Calendar';
import Prioritizer from '../../Pages/Prioritizer/Prioritizer';
import Team from '../../Pages/Team/Team';
import Settings from '../../Pages/Settings/Settings';


interface User {
  name: string;
  age: number;
  imageSrc: string;
}

interface LayoutProps {
  PageName: string;
}

function Layout(props: LayoutProps): JSX.Element {
  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "40px",
    padding: "0 20px",
  };

  const homeStyle = {
    textAlign: "center" as const,
    width: "100%",
  };

  const userCircleStyle = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    fontWeight: "bold",
    fontSize: "40px",
    marginTop: "5px",
  };

  const user: User = {
    name: "John Doe",
    age: 32,
    imageSrc: UserPic,
  };

  return (
    <div className="Layout">
      <div className="Header">
        <div style={headerStyle}>
          <div style={homeStyle}>{props.PageName}</div>
          <div style={userCircleStyle}>
            <UserCircle user={user} />
          </div>
        </div>
      </div>
      <aside className="SideBar">
        <SideBar />
      </aside>
      <div className="Calendar">{/* <Calander1/> */}</div>
    </div>
  );
}

export default Layout;
