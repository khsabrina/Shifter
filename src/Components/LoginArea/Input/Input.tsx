import "./Input.css";
import { TextField, Button, ButtonGroup } from "@mui/material";
import { Login } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { userLogin } from "../../../actions/apiActions";

interface LoginForm {
    username: string;
    password: string;
}
function Input(): JSX.Element {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<LoginForm>();
    const onSubmit = (data: LoginForm) => {

        userLogin(data);
    }
    return (
        <div className="Input Box">
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <TextField
                    label="Username"
                    variant="outlined"
                    className="TextBox"
                    {...register("username")}
                />

                <TextField
                    label="Password"
                    variant="outlined"
                    className="TextBox"
                    type='password'
                    {...register("password", { required: true, minLength: 2, maxLength: { message: 'barak noob at react', value: 20 } })}
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
