import {clsx} from "clsx";
import "./Button.css";

function Button ({type, fullWidth, children, onClick, secondary, danger, disabled}) {
    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={clsx(
                "custom-button",
                disabled && "disabled",
                fullWidth && "full-width",
                secondary ? "secondary" : "primary",
                danger && "danger"
            )}>
            {children}
    </button>)
}

export default Button;