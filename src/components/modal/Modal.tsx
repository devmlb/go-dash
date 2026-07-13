import { cloneElement, type JSX, type ReactNode } from "react";

import "./Modal.css";
import { TextButton } from "../button/Button";

function Modal({
    isOpen,
    onCancel,
    onConfirm,
    confirmActionText = "Enregistrer",
    cancelActionText = "Annuler",
    isConfirmActionEnabled = true,
    children,
    title,
    titleIcon,
}: {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    confirmActionText?: string;
    cancelActionText?: string;
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
                            text={cancelActionText}
                            secondary
                            onClick={onCancel}
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
