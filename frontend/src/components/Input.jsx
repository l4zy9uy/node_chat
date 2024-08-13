import "./Input.css";
import {clsx} from "clsx";

function Input ({ label, id, type, required, register, errors, disabled }) {
    return (<div>
        <label htmlFor={id} className="login-input-label">
            {label}
        </label>
        <div className="login-input-div-fields">
            <input
                id={id}
                type={type}
                autoComplete={id}
                disabled={disabled}
                {...register(id, {required})}
                className={clsx("form-input",
                    errors[id] && "error",
                    disabled && "disabled"
                )}/>
        </div>
    </div>)
}

export default Input;