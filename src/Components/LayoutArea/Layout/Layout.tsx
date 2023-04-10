import SideBar from "../SideBar/SideBar";
import "./Layout.css";
import UserCircle from "../UserCircle/UserCircle"
import UserPic from '../UserCircle/NoPhotoUser.png'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import auth from "../../auth/auth";
import Login from "../../LoginArea/Login/Login";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


interface User {
  firstName: string;
  lastName: string;
  jobDescription: string;
  imageSrc: string;
}

interface LayoutProps {
  PageName: string;
  component: React.ComponentType<any>;
}

function Layout(props: LayoutProps): JSX.Element {
  const user2: User ={
    firstName : "authname",
    lastName: "authlastName",
    jobDescription: "authjobDescription",
    imageSrc: "authimageSrc",
  }
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());
  const [d, Setd] = useState<User>(user2);
  const [user, SetUser] = useState(d);

  useEffect(() => {
    const user2: User = {
      firstName : auth.name,
      lastName: auth.lastName,
      jobDescription: auth.jobDescription,
      imageSrc: auth.imageSrc,
    };
    // user.firstName = auth.name;
    // user.lastName =auth.lastName;
    // user.jobDescription = auth.jobDescription;
    // user.jobDescription= auth.imageSrc;
    Setd(user2)

  });
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("asddsaa");
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);



  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "40px",
    padding: "0 20px",
  };
  const textStyle = {
    border: '1px solid black',
    background: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '15px',
    padding: '10px',
    marginBottom: '10px',
    textDecoration: 'none',
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
    minWidth: '100px', // or any other value that suits your design
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





  if (!isAuthenticated) {
    // Show a loading or splash screen here
    return <></>;
  }

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
      <div className="Calendar"><props.component /></div>
    </div>
  );
}

export default Layout;
