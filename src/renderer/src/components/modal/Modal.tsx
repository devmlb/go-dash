import { cloneElement, JSX, ReactNode } from "react";

import "./Modal.css";
import { TextButton } from "../button/Button";

function Modal({
    isOpen,
    onClose,
    onConfirm,
    confirmActionText = "Enregistrer",
    isConfirmActionEnabled = true,
    children,
    title,
    titleIcon,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    confirmActionText?: string;
    isConfirmActionEnabled?: boolean;
    children: ReactNode;
    title: string;
    titleIcon: JSX.Element;
}): JSX.Element {
    return (
        <div className={isOpen ? "modal open" : "modal"}>
            <div className="scrim" />
            <div className="container">
                <div className="window">
                    <div className="title">
                        {cloneElement(titleIcon, {
                            size: 20,
                            strokeWidth: 2.75,
                        })}
                        <h3>{title}</h3>
                    </div>
                    <div className="content">{children}</div>
                    <div className="actions">
                        <TextButton
                            text="Annuler"
                            secondary
                            onClick={onClose}
                        />
                        <TextButton
                            disabled={!isConfirmActionEnabled}
                            text={confirmActionText}
                            onClick={onConfirm}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Modal };
