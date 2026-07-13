import { useReducer, useState, type JSX } from "react";
import {
    MapPin,
    Calendar,
    Hammer,
    Globe,
    Tag,
    Trash,
    Pen,
    ExternalLink,
    GamepadDirectional,
    KeyboardMusic,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import "./Panel.css";
import { organApi } from "../../api/organ.api";
import { useApi } from "../../utils/hooks/api.hook";
import type { MinimalOrgan } from "../../utils/types/organ.type";
import { EditModal } from "../modals/EditModal";
import { IconButton, TextButton } from "../../components/button/Button";
import { Modal } from "../../components/modal/Modal";

function extractWebsite(url: string): string {
    const result = url.match(/https?:\/\/([^/]+)/);
    return result ? result[1] : url;
}

function Panel({
    selectedOrgan,
    reloadFn,
}: {
    selectedOrgan: MinimalOrgan | null;
    reloadFn: () => void;
}): JSX.Element {
    const { t } = useTranslation();
    const [mousePosition, setMousePosition] = useState<{
        x: number;
        y: number;
    }>({ x: 50, y: 50 });
    const [isHovering, setIsHovering] = useState<boolean>(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>): void => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const [previewReloadCount, reloadPreview] = useReducer(
        (count: number) => count + 1,
        0,
    );

    const closeEditModal = (): void => setIsEditModalOpen(false);
    const openEditModal = async (): Promise<void> => setIsEditModalOpen(true);
    const closeDeleteModal = (): void => setIsDeleteModalOpen(false);
    const openDeleteModal = async (): Promise<void> =>
        setIsDeleteModalOpen(true);
    const handleSaved = (): void => {
        reloadPreview();
        reloadFn();
    };
    const handleRemoved = (): void => {
        if (!selectedOrgan) return;
        closeDeleteModal();
        organApi.remove(selectedOrgan.id);
        reloadFn();
    };

    const {
        data: preview,
        isLoading: isPreviewLoading,
        error: previewError,
    } = useApi<string | null>(
        selectedOrgan
            ? async (): Promise<string | null> =>
                  `data:image;base64,${await organApi.getPreviewB64(selectedOrgan.id)}`
            : async (): Promise<null> => null,
        [selectedOrgan, previewReloadCount],
    );

    return (
        <div className="panel">
            {selectedOrgan ? (
                <>
                    {!isPreviewLoading && !previewError && !preview ? null : (
                        <>
                            <div className="preview-container shimmer-loading">
                                {!isPreviewLoading &&
                                    !previewError &&
                                    preview && (
                                        <div
                                            className="preview"
                                            onMouseMove={handleMouseMove}
                                            onMouseEnter={() =>
                                                setIsHovering(true)
                                            }
                                            onMouseLeave={() =>
                                                setIsHovering(false)
                                            }
                                            style={{
                                                scale: isHovering ? 1.5 : 1,
                                                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                                                backgroundImage: `url(${preview})`,
                                            }}
                                        />
                                    )}
                            </div>
                            <div className="preview-legend">
                                {t("panel.previewHelper")}
                            </div>
                        </>
                    )}
                    <div className="content">
                        <div className="infos">
                            <h2 className="name">{selectedOrgan.name}</h2>
                            <div>
                                <MapPin size={16} />
                                {selectedOrgan.country}
                            </div>
                            {selectedOrgan.year && (
                                <div>
                                    <Calendar size={16} />
                                    {selectedOrgan.year.toString()}
                                </div>
                            )}
                            {selectedOrgan.builder && (
                                <div>
                                    <Hammer size={16} />
                                    {selectedOrgan.builder}
                                </div>
                            )}
                            {selectedOrgan.stops && (
                                <div>
                                    <GamepadDirectional size={16} />
                                    {`${selectedOrgan.stops} ${t("common.stop", { count: selectedOrgan.stops })}`}
                                </div>
                            )}
                            {selectedOrgan.keyboards && (
                                <div>
                                    <KeyboardMusic size={16} />
                                    {`${selectedOrgan.keyboards} ${t("common.keyboard", { count: selectedOrgan.keyboards })}`}
                                </div>
                            )}
                            {selectedOrgan.features && (
                                <div>
                                    <Tag size={16} />
                                    {selectedOrgan.features}
                                </div>
                            )}
                            {selectedOrgan.url && (
                                <div>
                                    <Globe size={16} />
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href={selectedOrgan.url}
                                    >
                                        {extractWebsite(selectedOrgan.url)}
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="actions">
                            <div className="secondary">
                                <IconButton
                                    secondary
                                    onClick={openDeleteModal}
                                    icon={<Trash />}
                                />
                                <IconButton
                                    secondary
                                    onClick={openEditModal}
                                    icon={<Pen />}
                                />
                            </div>
                            <TextButton
                                text={t("panel.openButton")}
                                onClick={() => organApi.open(selectedOrgan.id)}
                                icon={<ExternalLink />}
                            />
                        </div>
                    </div>
                    {createPortal(
                        <EditModal
                            isOpen={isEditModalOpen}
                            close={closeEditModal}
                            organId={selectedOrgan.id}
                            onSaved={handleSaved}
                        />,
                        document.body,
                    )}
                    {createPortal(
                        <Modal
                            isOpen={isDeleteModalOpen}
                            onCancel={closeDeleteModal}
                            onConfirm={handleRemoved}
                            title={t("modal.delete.title")}
                            titleIcon={<Trash />}
                            confirmActionText={t("common.delete")}
                        >
                            {t("modal.delete.body", {
                                organName: selectedOrgan.name,
                            })}
                        </Modal>,
                        document.body,
                    )}
                </>
            ) : (
                <div className="none">{t("panel.noneSelected")}</div>
            )}
        </div>
    );
}

export { Panel };
