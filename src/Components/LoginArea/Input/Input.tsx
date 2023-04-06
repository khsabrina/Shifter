import "./Input.css";
import { TextField, Button, ButtonGroup } from "@mui/material";
import { Login } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { userLogin } from "../../../actions/apiActions";
import { useNavigate } from "react-router-dom";
import auth from "../../auth/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginForm {
    username: string;
    password: string;
}

function Input(): JSX.Element {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<LoginForm>();
    const navigate = useNavigate();
    const onSubmit = async (data: LoginForm) => {
        const mesaage = await userLogin(data);
        if (auth.isAuthenticated() === true) {
            auth.logout();
            navigate('/home');
        }
        else {
            toast.error(mesaage, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };
    return (
        <div className="Input Box">
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <TextField
                    label="Username"
                    variant="outlined"
                    className={`TextBox ${errors.password ? "error" : ""}`}
                    {...register("username", {
                        required: true,
                    })}
                />

                <TextField
                    label="Password"
                    variant="outlined"
                    className={`TextBox ${errors.password ? "error" : ""}`}
                    type='password'
                    {...register("password", {
                        required: true,
                    })}
                />

                <ButtonGroup variant="contained" fullWidth>
                    <Button
                        type="submit"
                        color="primary"
                        startIcon={<Login />}
                    >
                        Login
                    </Button>
                </ButtonGroup>
            </form>
        </div>
    );
}

export default Input;
