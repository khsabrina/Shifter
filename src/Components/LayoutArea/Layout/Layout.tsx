import SideBar from "../SideBar/SideBar";
import "./Layout.css";
import UserCircle from "../UserCircle/UserCircle"
import UserPic from '../UserCircle/NoPhotoUser.png'
import auth from "../../auth/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


interface User {
  firstName: string | undefined;
  lastName: string | undefined;
  jobDescription: string | undefined;
  imageSrc: string | undefined;
}

interface LayoutProps {
  PageName: string;
  component: React.ComponentType<any>;
}

function Layout(props: LayoutProps): JSX.Element {
  const user: User = {
    firstName: localStorage.getItem("firstName") as string | undefined,
    lastName: localStorage.getItem("lastName") as string | undefined,
    jobDescription: localStorage.getItem("jobDescription") as string | undefined,
    imageSrc: localStorage.getItem("imageSrc") === "Empty" ? UserPic as string | undefined : localStorage.getItem("imageSrc") as string | undefined,
  };
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());
  // const [user, SetUser] = useState(user);

  useEffect(() => {
    if (!isAuthenticated) {
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
      <div className="layout-component"><props.component /></div>
    </div>
  );
}

export default Layout;
