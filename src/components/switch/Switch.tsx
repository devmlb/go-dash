import type { JSX } from "react";

import "./Switch.css";

function Switch({
    className,
    id,
    isChecked,
    setIsChecked,
    animationDisabled = false,
}: {
    className?: string;
    id?: string;
    isChecked: boolean;
    setIsChecked: (isChecked: boolean) => void;
    animationDisabled?: boolean;
}): JSX.Element {
    return (
        <label
            className={
                "switch" +
                (animationDisabled ? "" : " animate") +
                (className ? ` ${className}` : "")
            }
            id={id}
        >
            <input
                className="switch-input"
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
            />
            <span className="switch-slider" />
        </label>
    );
}

export { Switch };
