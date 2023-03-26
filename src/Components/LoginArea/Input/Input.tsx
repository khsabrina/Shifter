import "./Input.css";
import { TextField, Button, ButtonGroup } from "@mui/material";
import { Login } from "@mui/icons-material";
import { useForm } from "react-hook-form";

interface LoginForm {
    username: string;
    password: string;
}
function Input(): JSX.Element {
    // const [userName, setUserName] = React.useState<string>('');
    const { register, handleSubmit, watch, formState: { errors } } = useForm<LoginForm>();
    const onSubmit = (data: LoginForm) => { console.log(data); }
    return (
        <div className="Input Box">
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <TextField
                    label="Username"
                    // get and set the useState ^
                    // value={userName}
                    // onChange={(e) => setUserName(e.target.value)}
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
