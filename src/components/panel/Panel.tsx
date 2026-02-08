import { useState, type JSX } from "react";
import { MapPin, Calendar } from "lucide-react";

import "./Panel.css";
import { getPreview, openOrgan } from "../../utils/api";
import { useApi } from "../../utils/hooks/api.hook";
import type { Organ } from "../../utils/types/api.types";
import { useBridgeReady } from "../../utils/hooks/bridge.hook";

function Panel({
    selectedOrgan,
}: {
    selectedOrgan: Organ | null;
}): JSX.Element {
    const {
        data: preview,
        isLoading: isPreviewLoading,
        error: previewError,
    } = useApi<string>(
        selectedOrgan
            ? async (): Promise<string> => await getPreview(selectedOrgan.id)
            : async (): Promise<string> => "",
        [selectedOrgan],
        useBridgeReady(),
    );

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

    return (
        <div className="panel">
            {selectedOrgan ? (
                !isPreviewLoading &&
                !previewError &&
                preview && (
                    <>
                        <div className="preview-container shimmer-loading">
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
                        </div>
                        <div className="content">
                            <div className="legend">
                                Passer la souris sur l'image pour zoomer.
                            </div>
                            <div className="actions">
                                <div className="infos">
                                    <h2 className="name">
                                        {selectedOrgan.name}
                                    </h2>
                                    <div>
                                        <MapPin size={16} />
                                        {selectedOrgan.country}
                                    </div>
                                    <div>
                                        <Calendar size={16} />
                                        {selectedOrgan.date.toString()}
                                    </div>
                                </div>
                                <button
                                    onClick={() => openOrgan(selectedOrgan.id)}
                                >
                                    Ouvrir l'orgue
                                </button>
                            </div>
                        </div>
                    </>
                )
            ) : (
                <div className="none">Aucun orgue sélectionné.</div>
            )}
        </div>
    );
}

export { Panel };
