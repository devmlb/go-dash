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
    const handleConfirm = async (): Promise<void> => {
        try {
            await restart();
            close();
        } catch (e) {
            console.error(e);
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
