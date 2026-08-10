import type { Update } from "@tauri-apps/plugin-updater";
import { BadgeAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

import "./UpdateModal.css";
import { Modal } from "../../components/modal/Modal";
import Markdown from "react-markdown";

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
    const { t } = useTranslation();
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
            confirmActionText={t("modal.update.restartButton")}
            cancelActionText={t("modal.update.laterButton")}
            title={t("modal.update.title")}
            titleIcon={<BadgeAlert />}
        >
            <div className="update-modal-content">
                <div>
                    {t("modal.update.body.infos", {
                        version: updateDetails.version,
                    })}
                </div>
                <div>
                    <Markdown>{updateDetails.body}</Markdown>
                </div>
            </div>
        </Modal>
    );
}

export { UpdateModal };
