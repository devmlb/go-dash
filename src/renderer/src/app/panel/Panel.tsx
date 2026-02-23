import { useReducer, useState, type JSX } from "react";
import { MapPin, Calendar, Hammer, Globe, Tag } from "lucide-react";
import { createPortal } from "react-dom";

import "./Panel.css";
import { getPreview, openOrgan, removeOrgan } from "../../utils/api";
import { useApi } from "../../utils/hooks/api.hook";
import type { MinimalOrgan } from "../../utils/types/api.type";
import { EditModal } from "../modals/EditModal";

function Panel({
    selectedOrgan,
    reload,
}: {
    selectedOrgan: MinimalOrgan | null;
    reload: () => void;
}): JSX.Element {
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
    const [previewReloadCount, reloadPreview] = useReducer(
        (count: number) => count + 1,
        0,
    );

    const closeEditModal = (): void => setIsEditModalOpen(false);
    const openEditModal = async (): Promise<void> => setIsEditModalOpen(true);
    const handleSaved = (): void => {
        reloadPreview();
        reload();
    };
    const handleRemoved = (): void => {
        if (!selectedOrgan) return;

        removeOrgan(selectedOrgan._id);
        reload();
    };

    const {
        data: preview,
        isLoading: isPreviewLoading,
        error: previewError,
    } = useApi<string | null>(
        selectedOrgan
            ? async (): Promise<string | null> =>
                  await getPreview(selectedOrgan._id)
            : async (): Promise<null> => null,
        [selectedOrgan, previewReloadCount],
    );

    return (
        <div className="panel">
            {selectedOrgan ? (
                <>
                    <div className="preview-container shimmer-loading">
                        {!isPreviewLoading && !previewError && preview && (
                            <div
                                className="preview"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                style={{
                                    scale: isHovering ? 1.5 : 1,
                                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                                    backgroundImage: `url(${preview})`,
                                }}
                            />
                        )}
                    </div>
                    <div className="preview-legend">
                        Passer la souris sur l&apos;image pour zoomer.
                    </div>
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
                                        Site web
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="actions">
                            <button onClick={handleRemoved}>Supprimer</button>
                            <button onClick={() => openEditModal()}>
                                Modifier
                            </button>
                            <button
                                onClick={() => openOrgan(selectedOrgan._id)}
                            >
                                Ouvrir
                            </button>
                        </div>
                    </div>
                    {createPortal(
                        <EditModal
                            isOpen={isEditModalOpen}
                            close={closeEditModal}
                            organId={selectedOrgan._id}
                            onSaved={handleSaved}
                        />,
                        document.body,
                    )}
                </>
            ) : (
                <div className="none">Aucun orgue sélectionné.</div>
            )}
        </div>
    );
}

export { Panel };
