import {useCallback, useState} from "react";
import {useForm} from "react-hook-form";
import Input from "./Input.jsx";
import Button from "./Button.jsx";
import axios from "axios";
import {toast} from "react-hot-toast";

function AuthForm() {
    const Variant = Object.freeze({
        LOGIN: 'LOGIN',
        REGISTER: 'REGISTER'
    });

    const [authState, setAuthState] = useState(Variant.LOGIN);
    const [isLoading, setIsLoading] = useState(false);

    const toggleAuthState = useCallback(() => {
        if (authState === 'LOGIN') {
            setAuthState('REGISTER');
        } else {
            setAuthState('LOGIN');
        }
    }, [authState]);

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({
        defaultValues: {
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            password: '',
            phone_number: ''
        }
    });

    const onSubmit = (data) => {
        console.log("submitted");
        setIsLoading(true);
        if (authState === Variant.REGISTER) {
            axios.post("http://localhost:8080/register/", data)
                .then((res) => {
                    toast.success("You register successfully");
                })
                .catch(() => {
                    toast.error('Something went wrong!')
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
        else {
            axios.post("http://localhost:8080/login", data)
                .then((res) => {
                    console.log(res);
                    toast.success("You are signed in");
                })
                .catch(() => {
                    toast.error("Credentials error");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };
    return (<div className="bar">
        <div className="inside-bar">
            <form className="login-form"
                  onSubmit={handleSubmit(onSubmit)}>
                {authState === Variant.REGISTER &&
                    <Input id="first_name" label="First Name" register={register}
                           errors={errors}/>}
                {authState === Variant.REGISTER &&
                    <Input id="last_name" label="Last Name" register={register}
                           errors={errors}/>}
                <Input id="username" label="Username" type="text"
                       register={register} errors={errors} disabled={isLoading}/>
                {authState === Variant.REGISTER &&
                    <Input id="email" label="Email" type="email" register={register}
                       errors={errors} disabled={isLoading}/>}
                <Input id="password" label="Password" type="password"
                       register={register} errors={errors} disabled={isLoading}/>
                { authState === Variant.REGISTER &&
                    <Input id="phone_number" label="Phone number" type="text"
                       register={register} errors={errors} disabled={isLoading}/>
                }
                <div>
                    <Button disabled={isLoading} fullWidth type="submit">
                        {authState === "LOGIN" ? "Sign in" : "Register"}
                    </Button>
                </div>
            </form>
        </div>
    </div>);
}

export default AuthForm;