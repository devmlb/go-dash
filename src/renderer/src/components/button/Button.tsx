import { cloneElement, JSX } from "react";

import "./Button.css";

function Button({
    className,
    id,
    text,
    icon,
    iconOnly = false,
    onClick = () => {},
    secondary = false,
    disabled = false,
    loading = false,
}: {
    className: string | undefined;
    id: string | undefined;
    text: string | undefined;
    icon: JSX.Element | undefined;
    iconOnly: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    secondary: boolean;
    disabled: boolean;
    loading: boolean;
}): JSX.Element {
    let classes = "button";
    classes += iconOnly ? " icon-button" : "";
    classes += secondary ? " secondary" : " primary";
    classes += loading ? " loading" : "";
    classes += className ? ` ${className}` : "";

    return (
        <button
            id={id}
            disabled={disabled || loading}
            className={classes}
            onClick={onClick}
        >
            {icon ? cloneElement(icon, { size: 16, strokeWidth: 2.75 }) : null}
            {text && <span>{text}</span>}
        </button>
    );
}

function IconButton({
    className,
    id,
    icon,
    onClick = () => {},
    secondary = false,
    disabled = false,
    loading = false,
}: {
    className?: string;
    id?: string;
    icon: JSX.Element;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    secondary?: boolean;
    disabled?: boolean;
    loading?: boolean;
}): JSX.Element {
    return (
        <Button
            className={className}
            id={id}
            text={undefined}
            icon={icon}
            iconOnly={true}
            onClick={onClick}
            secondary={secondary}
            disabled={disabled}
            loading={loading}
        />
    );
}

function TextButton({
    className,
    id,
    text,
    icon,
    onClick = () => {},
    secondary = false,
    disabled = false,
    loading = false,
}: {
    className?: string;
    id?: string;
    text: string;
    icon?: JSX.Element;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    secondary?: boolean;
    disabled?: boolean;
    loading?: boolean;
}): JSX.Element {
    return (
        <Button
            className={className}
            id={id}
            text={text}
            icon={icon}
            iconOnly={false}
            onClick={onClick}
            secondary={secondary}
            disabled={disabled}
            loading={loading}
        />
    );
}

export { TextButton, IconButton };
