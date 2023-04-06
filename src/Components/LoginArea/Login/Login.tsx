import Logo from "../../LayoutArea/Logo/Logo";
import Input from "../Input/Input";
import "./Login.css";
import { ToastContainer } from "react-toastify";

function Login(): JSX.Element {
    return (
        <div className="Login">
            <Logo />
            <Input />
            <ToastContainer />
        </div>

    );
}

export default Login;
