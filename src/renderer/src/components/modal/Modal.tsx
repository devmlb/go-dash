import { JSX, ReactNode } from "react";
import { Pen } from "lucide-react";

import "./Modal.css";

function Modal({
    isOpen,
    onClose,
    onConfirm,
    confirmActionText = "Enregistrer",
    isConfirmActionEnabled = true,
    children,
    title,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    confirmActionText?: string;
    isConfirmActionEnabled?: boolean;
    children: ReactNode;
    title: string;
}): JSX.Element {
    return (
        <div className={isOpen ? "modal open" : "modal"}>
            <div className="scrim" />
            <div className="container">
                <div className="window">
                    <div className="title">
                        <Pen />
                        <h3>{title}</h3>
                    </div>
                    <div className="content">{children}</div>
                    <div className="actions">
                        <button onClick={onClose}>Annuler</button>
                        <button
                            onClick={onConfirm}
                            disabled={!isConfirmActionEnabled}
                        >
                            {confirmActionText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Modal };
