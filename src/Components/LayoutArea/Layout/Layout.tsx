import SideBar from "../SideBar/SideBar";
import "./Layout.css";
import Calander1 from "../../Calander/Calander"

function Layout(): JSX.Element {
    return (
        <div className="Layout">
            <div className = "Header">
                    Home 
            </div>
            <aside className = "SideBar">
                <SideBar />
            </aside>
            <div className = "Calendar">
                <Calander1/>
            </div>
        </div>
    );
}

export default Layout;
