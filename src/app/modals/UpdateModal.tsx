import { useState } from "react";
import { Update } from "@tauri-apps/plugin-updater";
import { BadgeAlert } from "lucide-react";

import "./UpdateModal.css";
import { Modal } from "../../components/modal/Modal";

function UpdateModal({
    isOpen,
    close,
    restart,
    updateDetails,
}: {
    isOpen: boolean;
    close: () => void;
    restart: () => Promise<void>;
    updateDetails: Update;
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const handleConfirm = async (): Promise<void> => {
        try {
            setIsLoading(true);
            await restart();
            close();
        } catch (e) {
            setError("Unexpected error: try again later");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onCancel={close}
            onConfirm={handleConfirm}
            confirmActionText="Redémarrer et installer"
            cancelActionText="Plus tard"
            title="Mise à jour disponible"
            titleIcon={<BadgeAlert />}
        >
            <div className="update-modal-content">
                <div>
                    La version {updateDetails.version} de GO Dash a été
                    téléchargée. Redémarrez l'application pour terminer
                    l'installation.
                </div>
                <span className="notes-title">Notes de version</span>
                <div>{updateDetails.body}</div>
            </div>
        </Modal>
    );
}

export { UpdateModal };
