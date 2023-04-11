import Logo from "../../LayoutArea/Logo/Logo";
import Input from "../Input/Input";
import "./Login.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import auth from "../../auth/auth";

function Login(): JSX.Element {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/calendar');
        }
    }, [isAuthenticated, navigate]);
    if (isAuthenticated) {
        // Show a loading or splash screen here
        return <></>;
    }

    return (
        <div className="Login">
            <Logo />
            <Input />
            <ToastContainer />
        </div>

    );
}

export default Login;
